/**
 * Cloudflare D1 Booking Store Implementation — Jun Designs
 *
 * Fully replaces legacy JSON file storage with Cloudflare D1 (parameterized SQLite).
 * Preserves the exact public interface while ensuring concurrency-safe,
 * ACID-compliant queries on Cloudflare Workers and local SQLite environments.
 */

import { workshops } from "@/content/workshops";
import {
  Booking,
  BookingStatus,
  DayAvailability,
  SlotAvailability,
  TimeSlot,
  CreateHoldParams,
} from "./types";
import { bookingConfig, TIME_SLOTS, calculateEstimates } from "./config";
import {
  sendBookingConfirmationEmail,
  sendStudioAlertEmail,
  sendReminderEmail,
} from "./email";
import { pesapalClient } from "./pesapal/client";
import { pesapalProvider } from "./pesapal/provider";
import type { PesapalTransactionStatusResponse } from "./pesapal/types";
import { getDb } from "@/lib/db/d1";

interface BookingRow {
  id: string;
  reference: string;
  workshop_slug: string;
  date: string;
  slot: string;
  guests: number;
  status: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  special_requests: string | null;
  amount_paid: number;
  currency: string;
  pesapal_order_tracking_id: string | null;
  pesapal_merchant_reference: string | null;
  payment_method: string | null;
  hold_expires_at: string | null;
  created_at: string;
  updated_at: string;
  reminder_sent_at: string | null;
  cancelled_at: string | null;
  refund_amount: number | null;
  refund_reason: string | null;
}

interface AdminConfigRow {
  id: number;
  capacity_per_slot: number;
  blocked_dates: string;
  cancellation_policy_text: string;
  updated_at: string;
}

/**
 * Maps a SQLite/D1 database row to the typed Booking interface.
 */
function rowToBooking(row: BookingRow): Booking {
  const workshop = workshops.find((w) => w.slug === row.workshop_slug);
  const workshopName = workshop ? workshop.name : row.workshop_slug;

  const phoneParts = (row.customer_phone || "").trim().split(" ");
  const customerCountry = phoneParts.length > 1 && phoneParts[0].startsWith("+") ? phoneParts[0] : "+250";
  const customerPhone = phoneParts.length > 1 && phoneParts[0].startsWith("+") ? phoneParts.slice(1).join(" ") : row.customer_phone || "";

  return {
    id: row.id,
    reference: row.reference,
    workshopSlug: row.workshop_slug,
    workshopName,
    date: row.date,
    slot: row.slot as TimeSlot,
    guests: row.guests,
    amountRwf: row.amount_paid,
    amountUsdEstimate: Math.round((row.amount_paid / bookingConfig.usdRate) * 100) / 100,
    currency: "RWF",
    status: row.status as BookingStatus,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone,
    customerCountry,
    note: row.special_requests || undefined,
    holdExpiresAt: row.hold_expires_at || new Date(0).toISOString(),
    paymentReference: row.pesapal_merchant_reference || undefined,
    paymentProvider: (row.payment_method as any) || undefined,
    pesapalOrderTrackingId: row.pesapal_order_tracking_id || undefined,
    pesapalMerchantReference: row.pesapal_merchant_reference || undefined,
    pesapalPaymentMethod: row.payment_method || undefined,
    reminderEmailSentAt: row.reminder_sent_at || undefined,
    cancellationReason: row.refund_reason || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Generate human-readable reference code: JUN-YYYY-XXXX (avoiding ambiguous chars)
 */
export function generateReference(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const year = new Date().getFullYear();
  let part = "";
  for (let i = 0; i < 4; i++) {
    part += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `JUN-${year}-${part}`;
}

/**
 * Purge expired 10-minute holds from D1.
 */
export async function purgeExpiredHolds(): Promise<number> {
  const db = await getDb();
  const nowIso = new Date().toISOString();
  const res = await db
    .prepare(
      "UPDATE bookings SET status = 'cancelled', updated_at = ? WHERE status = 'held' AND hold_expires_at <= ?"
    )
    .bind(nowIso, nowIso)
    .run();
  return (res?.meta as any)?.changes || 0;
}

/**
 * Helper to fetch dynamic admin configuration from D1 with fallback to defaults.
 */
export async function getAdminConfig(): Promise<{
  capacityPerSlot: number;
  blockedDates: string[];
  cancellationPolicyText: string;
}> {
  try {
    const db = await getDb();
    const row = await db.prepare("SELECT * FROM admin_config WHERE id = 1").first<AdminConfigRow>();
    if (row) {
      let blocked: string[] = [];
      try {
        blocked = JSON.parse(row.blocked_dates || "[]");
      } catch {
        blocked = [];
      }
      return {
        capacityPerSlot: row.capacity_per_slot ?? bookingConfig.capacityPerSlot,
        blockedDates: blocked,
        cancellationPolicyText: row.cancellation_policy_text || bookingConfig.cancellationPolicyText,
      };
    }
  } catch (err) {
    console.warn("Failed to load admin_config from D1, using defaults:", err);
  }

  return {
    capacityPerSlot: bookingConfig.capacityPerSlot,
    blockedDates: bookingConfig.blockedDates,
    cancellationPolicyText: bookingConfig.cancellationPolicyText,
  };
}

/**
 * Cutoff check: same-day bookings must be made at least 2 hours before the slot in Kigali (UTC+2).
 */
export function isSlotPastCutoff(dateStr: string, slot: TimeSlot, now = new Date()): boolean {
  const kigaliOffset = 2 * 60; // minutes
  const nowUtc = now.getTime() + now.getTimezoneOffset() * 60000;
  const kigaliNow = new Date(nowUtc + kigaliOffset * 60000);

  const pad = (n: number) => String(n).padStart(2, "0");
  const kigaliTodayStr = `${kigaliNow.getFullYear()}-${pad(kigaliNow.getMonth() + 1)}-${pad(kigaliNow.getDate())}`;

  if (dateStr < kigaliTodayStr) return true;
  if (dateStr > kigaliTodayStr) return false;

  const [slotHour, slotMin] = slot.split(":").map(Number);
  const slotDate = new Date(kigaliNow);
  slotDate.setHours(slotHour, slotMin, 0, 0);

  const diffMs = slotDate.getTime() - kigaliNow.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  return diffHours < bookingConfig.cutoffHoursBeforeSlot;
}

/**
 * Calculate availability for a workshop on a given date.
 */
export async function getDayAvailability(
  workshopSlug: string,
  dateStr: string,
  now = new Date()
): Promise<DayAvailability> {
  await purgeExpiredHolds();
  const config = await getAdminConfig();
  const db = await getDb();

  const nowIso = now.toISOString();
  const todayStr = nowIso.split("T")[0];
  const maxDate = new Date(now);
  maxDate.setDate(maxDate.getDate() + bookingConfig.maxDaysInAdvance);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  const isPast = dateStr < todayStr;
  const isBeyondWindow = dateStr > maxDateStr;
  const isBlocked = config.blockedDates.includes(dateStr);

  // Query occupied seats by slot for this workshop & date
  const occupancyQuery = await db
    .prepare(
      `SELECT slot, SUM(guests) as total_occupied,
              SUM(CASE WHEN status = 'paid' THEN guests ELSE 0 END) as booked_count,
              SUM(CASE WHEN status IN ('held', 'payment_pending') THEN guests ELSE 0 END) as held_count
       FROM bookings
       WHERE workshop_slug = ? AND date = ?
         AND status IN ('paid', 'held', 'payment_pending')
         AND (status = 'paid' OR hold_expires_at > ?)
       GROUP BY slot`
    )
    .bind(workshopSlug, dateStr, nowIso)
    .all<{ slot: string; total_occupied: number; booked_count: number; held_count: number }>();

  const occupancyMap = new Map<string, { booked: number; held: number; total: number }>();
  for (const row of occupancyQuery.results || []) {
    occupancyMap.set(row.slot, {
      booked: row.booked_count || 0,
      held: row.held_count || 0,
      total: row.total_occupied || 0,
    });
  }

  const slots: SlotAvailability[] = TIME_SLOTS.map((slotDef) => {
    const slot = slotDef.slot;
    const stats = occupancyMap.get(slot) || { booked: 0, held: 0, total: 0 };
    const remainingPlaces = Math.max(0, config.capacityPerSlot - stats.total);
    const isPastCutoff = isSlotPastCutoff(dateStr, slot, now);

    let isAvailable = true;
    let disabledReason: string | undefined;

    if (isPast) {
      isAvailable = false;
      disabledReason = "Date has passed";
    } else if (isBeyondWindow) {
      isAvailable = false;
      disabledReason = `Bookings open ${bookingConfig.maxDaysInAdvance} days in advance`;
    } else if (isBlocked) {
      isAvailable = false;
      disabledReason = "Studio closed on this date";
    } else if (isPastCutoff) {
      isAvailable = false;
      disabledReason = "Cut-off time has passed for this session";
    } else if (remainingPlaces <= 0) {
      isAvailable = false;
      disabledReason = "Fully booked";
    }

    return {
      slot,
      timeLabel: slotDef.label,
      totalCapacity: config.capacityPerSlot,
      bookedCount: stats.booked,
      heldCount: stats.held,
      remainingPlaces,
      isAvailable,
      disabledReason,
    };
  });

  const hasSpace = slots.some((s) => s.isAvailable && s.remainingPlaces > 0);

  return {
    date: dateStr,
    slots,
    hasSpace,
    isPast,
    isBlocked,
    isBeyondWindow,
  };
}

/**
 * Atomically create a 10-minute hold for booking places.
 */
export async function createBookingHold(
  params: CreateHoldParams
): Promise<{ success: boolean; booking?: Booking; error?: string; errorCode?: string }> {
  await purgeExpiredHolds();
  const db = await getDb();
  const config = await getAdminConfig();

  // Check idempotency if key provided
  if (params.idempotencyKey) {
    const existingKey = await db
      .prepare("SELECT response FROM idempotency_keys WHERE key = ?")
      .bind(params.idempotencyKey)
      .first<{ response: string }>();

    if (existingKey?.response) {
      try {
        const cached = JSON.parse(existingKey.response);
        return { success: true, booking: cached };
      } catch {}
    }
  }

  const workshop = workshops.find((w) => w.slug === params.workshopSlug);
  if (!workshop) {
    return { success: false, error: "Invalid workshop selected.", errorCode: "INVALID_WORKSHOP" };
  }

  if (params.guests < 1 || params.guests > bookingConfig.maxGuestsPerBooking) {
    return {
      success: false,
      error: `Guests must be between 1 and ${bookingConfig.maxGuestsPerBooking}.`,
      errorCode: "INVALID_GUEST_COUNT",
    };
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(params.date)) {
    return { success: false, error: "Invalid date format.", errorCode: "INVALID_DATE" };
  }

  const todayStr = new Date().toISOString().split("T")[0];
  if (params.date < todayStr) {
    return { success: false, error: "Cannot book past dates.", errorCode: "PAST_DATE" };
  }

  if (config.blockedDates.includes(params.date)) {
    return { success: false, error: "The studio is closed on this date.", errorCode: "DATE_BLOCKED" };
  }

  if (isSlotPastCutoff(params.date, params.slot)) {
    return {
      success: false,
      error: "Same-day booking cut-off has passed for this slot.",
      errorCode: "CUTOFF_PASSED",
    };
  }

  const now = new Date();
  const nowIso = now.toISOString();

  // Concurrency check: query active occupancy
  const occRow = await db
    .prepare(
      `SELECT COALESCE(SUM(guests), 0) as occupied
       FROM bookings
       WHERE workshop_slug = ? AND date = ? AND slot = ?
         AND status IN ('paid', 'held', 'payment_pending')
         AND (status = 'paid' OR hold_expires_at > ?)`
    )
    .bind(params.workshopSlug, params.date, params.slot, nowIso)
    .first<{ occupied: number }>();

  const occupied = occRow?.occupied || 0;
  const remaining = config.capacityPerSlot - occupied;

  if (params.guests > remaining) {
    return {
      success: false,
      error:
        remaining > 0
          ? `Only ${remaining} place${remaining === 1 ? "" : "s"} left for this session.`
          : "This session is completely sold out.",
      errorCode: "CAPACITY_EXCEEDED",
    };
  }

  const expiresAt = new Date(now.getTime() + 10 * 60 * 1000).toISOString();
  const reference = generateReference();
  const id = `bk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const amountRwf = workshop.priceRwf * params.guests;
  const { usd } = calculateEstimates(amountRwf);

  const phone = [params.customerCountry, params.customerPhone].filter(Boolean).join(" ");

  const booking: Booking = {
    id,
    reference,
    workshopSlug: workshop.slug,
    workshopName: workshop.name,
    date: params.date,
    slot: params.slot,
    guests: params.guests,
    amountRwf,
    amountUsdEstimate: usd,
    currency: "RWF",
    status: "held",
    customerName: params.customerName.trim(),
    customerEmail: params.customerEmail.trim().toLowerCase(),
    customerPhone: params.customerPhone.trim(),
    customerCountry: params.customerCountry || "+250",
    note: params.note?.trim() || undefined,
    holdExpiresAt: expiresAt,
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  // If live Pesapal is enabled, initialize the transaction
  if (process.env.PESAPAL_CONSUMER_KEY && process.env.PESAPAL_CONSUMER_SECRET) {
    try {
      const orderRes = await pesapalProvider.createPaymentOrder(booking);

      if (!orderRes.order_tracking_id || !orderRes.redirect_url) {
        return {
          success: false,
          error: (orderRes as any).error?.message || "Failed to initialize payment gateway.",
          errorCode: "PESAPAL_INIT_FAILED",
        };
      }

      booking.status = "payment_pending";
      booking.pesapalOrderTrackingId = orderRes.order_tracking_id;
      booking.pesapalMerchantReference = reference;
      booking.redirectUrl = orderRes.redirect_url;
    } catch (err: any) {
      console.error("Pesapal order creation failed during hold:", err);
      return {
        success: false,
        error: `Payment initialization failed: ${err.message || "Unable to connect to Pesapal."}`,
        errorCode: "PESAPAL_INIT_FAILED",
      };
    }
  } else {
    booking.status = "payment_pending";
    booking.redirectUrl = `/booking/mock-checkout?ref=${booking.reference}`;
  }

  // Insert booking into D1
  await db
    .prepare(
      `INSERT INTO bookings (
        id, reference, workshop_slug, date, slot, guests, status,
        customer_name, customer_email, customer_phone, special_requests,
        amount_paid, currency, pesapal_order_tracking_id, pesapal_merchant_reference,
        payment_method, hold_expires_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      booking.id,
      booking.reference,
      booking.workshopSlug,
      booking.date,
      booking.slot,
      booking.guests,
      booking.status,
      booking.customerName,
      booking.customerEmail,
      phone,
      booking.note || null,
      booking.amountRwf,
      booking.currency,
      booking.pesapalOrderTrackingId || null,
      booking.pesapalMerchantReference || null,
      booking.paymentProvider || null,
      booking.holdExpiresAt,
      booking.createdAt,
      booking.updatedAt
    )
    .run();

  if (params.idempotencyKey) {
    await db
      .prepare("INSERT OR REPLACE INTO idempotency_keys (key, response, created_at) VALUES (?, ?, ?)")
      .bind(params.idempotencyKey, JSON.stringify(booking), nowIso)
      .run();
  }

  return { success: true, booking };
}

/**
 * Confirm booking payment and dispatch transactional emails.
 */
export async function confirmBookingPayment(
  reference: string,
  paymentReference: string,
  provider: "card" | "momo" | "airtel" = "card",
  options?: { isLateWebhook?: boolean; forceExpired?: boolean }
): Promise<{ success: boolean; booking?: Booking; error?: string; errorCode?: string }> {
  const db = await getDb();
  const config = await getAdminConfig();

  const row = await db
    .prepare("SELECT * FROM bookings WHERE UPPER(reference) = UPPER(?)")
    .bind(reference)
    .first<BookingRow>();

  if (!row) {
    return { success: false, error: "Booking reference not found.", errorCode: "NOT_FOUND" };
  }

  const booking = rowToBooking(row);

  // Idempotency: if already paid, ensure emails were dispatched and return success
  if (booking.status === "paid") {
    if (!booking.confirmationEmailSentAt) {
      await sendBookingConfirmationEmail(booking);
      await db.prepare("UPDATE bookings SET reminder_sent_at = ? WHERE id = ?").bind(new Date().toISOString(), booking.id).run();
    }
    return { success: true, booking };
  }

  const now = new Date();
  const nowIso = now.toISOString();
  const isExpired = options?.forceExpired || (booking.holdExpiresAt && now > new Date(booking.holdExpiresAt));

  if (isExpired && !options?.isLateWebhook) {
    await db.prepare("UPDATE bookings SET status = 'cancelled', updated_at = ? WHERE id = ?").bind(nowIso, booking.id).run();
    return {
      success: false,
      error: "Your 10-minute hold has expired. Please select your time slot again.",
      errorCode: "EXPIRED_HOLD",
    };
  }

  if (isExpired && options?.isLateWebhook) {
    const occRow = await db
      .prepare(
        `SELECT COALESCE(SUM(guests), 0) as occupied
         FROM bookings
         WHERE reference != ? AND workshop_slug = ? AND date = ? AND slot = ?
           AND status IN ('paid', 'held')`
      )
      .bind(reference, booking.workshopSlug, booking.date, booking.slot)
      .first<{ occupied: number }>();

    const occupied = occRow?.occupied || 0;
    if (occupied + booking.guests > config.capacityPerSlot) {
      await db
        .prepare("UPDATE bookings SET status = 'refunded', pesapal_merchant_reference = ?, updated_at = ? WHERE id = ?")
        .bind(paymentReference, nowIso, booking.id)
        .run();

      booking.status = "refunded";
      return {
        success: false,
        error: "Late payment arrived after hold expired and slot was filled. Automatic refund initiated.",
        errorCode: "REFUNDED_CAPACITY_LOST",
      };
    }
  }

  // Confirm booking to paid in D1
  await db
    .prepare(
      `UPDATE bookings
       SET status = 'paid', pesapal_merchant_reference = ?, payment_method = ?, updated_at = ?
       WHERE id = ?`
    )
    .bind(paymentReference, provider, nowIso, booking.id)
    .run();

  booking.status = "paid";
  booking.paymentReference = paymentReference;
  booking.paymentProvider = provider;
  booking.updatedAt = nowIso;

  // Send transactional emails
  try {
    await sendBookingConfirmationEmail(booking);
    await sendStudioAlertEmail(booking);
  } catch (err) {
    console.error("Failed to send confirmation emails:", err);
  }

  return { success: true, booking };
}

/**
 * Shared atomic, idempotent transition function for Pesapal transaction updates.
 */
export async function applyPesapalStatusTransition(
  orderTrackingId: string,
  options?: {
    merchantReference?: string;
    overrideStatus?: PesapalTransactionStatusResponse;
  }
): Promise<{
  success: boolean;
  booking?: Booking | null;
  error?: string;
  transition?: string;
}> {
  const db = await getDb();

  // 1. Fetch status from Pesapal if not provided
  let status = options?.overrideStatus;
  if (!status) {
    try {
      status = await pesapalClient.getTransactionStatus(orderTrackingId);
    } catch (err: any) {
      return {
        success: false,
        error: `Failed to query Pesapal status: ${err.message}`,
        booking: null,
      };
    }
  }

  // 2. Locate booking by merchant reference or orderTrackingId
  const targetRef = (status.merchant_reference || options?.merchantReference || "").toUpperCase();

  let row = await db
    .prepare(
      `SELECT * FROM bookings
       WHERE UPPER(reference) = UPPER(?) OR pesapal_order_tracking_id = ?
       LIMIT 1`
    )
    .bind(targetRef, orderTrackingId)
    .first<BookingRow>();

  if (!row) {
    return {
      success: false,
      error: `Booking not found for merchant reference "${targetRef}" or tracking ID "${orderTrackingId}"`,
      booking: null,
    };
  }

  const booking = rowToBooking(row);
  const nowIso = new Date().toISOString();

  // 3. Process status codes
  const code = status.status_code;
  let transition = "unchanged";

  if (code === 1) {
    // COMPLETED
    if (booking.status !== "paid") {
      const confirmRes = await confirmBookingPayment(
        booking.reference,
        orderTrackingId,
        (status.payment_method as any) || "card",
        { isLateWebhook: true }
      );
      transition = confirmRes.success ? "completed" : "refunded_late_payment";
    }
  } else if (code === 2) {
    // FAILED
    if (booking.status !== "paid") {
      await db
        .prepare("UPDATE bookings SET status = 'cancelled', updated_at = ? WHERE id = ?")
        .bind(nowIso, booking.id)
        .run();
      booking.status = "cancelled";
      transition = "failed";
    }
  } else if (code === 3) {
    // REVERSED
    await db
      .prepare("UPDATE bookings SET status = 'refunded', updated_at = ? WHERE id = ?")
      .bind(nowIso, booking.id)
      .run();
    booking.status = "refunded";
    transition = "reversed";
  }

  return { success: true, booking, transition };
}

/**
 * Refund a booking
 */
export async function refundBooking(
  reference: string,
  amountRwf: number,
  reason: string
): Promise<{ success: boolean; booking?: Booking; error?: string }> {
  const db = await getDb();
  const nowIso = new Date().toISOString();

  const row = await db
    .prepare("SELECT * FROM bookings WHERE UPPER(reference) = UPPER(?)")
    .bind(reference)
    .first<BookingRow>();

  if (!row) {
    return { success: false, error: "Booking reference not found." };
  }

  await db
    .prepare(
      `UPDATE bookings
       SET status = 'refunded', refund_amount = ?, refund_reason = ?, updated_at = ?
       WHERE id = ?`
    )
    .bind(amountRwf, reason.trim(), nowIso, row.id)
    .run();

  const updated = rowToBooking({
    ...row,
    status: "refunded",
    refund_amount: amountRwf,
    refund_reason: reason.trim(),
    updated_at: nowIso,
  });

  return { success: true, booking: updated };
}

/**
 * Cancel a booking
 */
export async function cancelBooking(
  reference: string,
  reason = "Cancelled by admin"
): Promise<{ success: boolean; booking?: Booking; error?: string }> {
  const db = await getDb();
  const nowIso = new Date().toISOString();

  const row = await db
    .prepare("SELECT * FROM bookings WHERE UPPER(reference) = UPPER(?)")
    .bind(reference)
    .first<BookingRow>();

  if (!row) {
    return { success: false, error: "Booking reference not found." };
  }

  await db
    .prepare("UPDATE bookings SET status = 'cancelled', refund_reason = ?, updated_at = ? WHERE id = ?")
    .bind(reason, nowIso, row.id)
    .run();

  const updated = rowToBooking({
    ...row,
    status: "cancelled",
    refund_reason: reason,
    updated_at: nowIso,
  });

  return { success: true, booking: updated };
}

/**
 * Reschedule a booking to a new date & slot
 */
export async function rescheduleBooking(
  reference: string,
  newDate: string,
  newSlot: TimeSlot
): Promise<{ success: boolean; booking?: Booking; error?: string }> {
  const db = await getDb();
  const config = await getAdminConfig();
  const nowIso = new Date().toISOString();

  const row = await db
    .prepare("SELECT * FROM bookings WHERE UPPER(reference) = UPPER(?)")
    .bind(reference)
    .first<BookingRow>();

  if (!row) {
    return { success: false, error: "Booking reference not found." };
  }

  if (config.blockedDates.includes(newDate)) {
    return { success: false, error: "The studio is closed on the new selected date." };
  }

  // Check capacity on new date & slot
  const occRow = await db
    .prepare(
      `SELECT COALESCE(SUM(guests), 0) as occupied
       FROM bookings
       WHERE reference != ? AND workshop_slug = ? AND date = ? AND slot = ?
         AND status = 'paid'`
    )
    .bind(reference, row.workshop_slug, newDate, newSlot)
    .first<{ occupied: number }>();

  const occupied = occRow?.occupied || 0;
  if (occupied + row.guests > config.capacityPerSlot) {
    return {
      success: false,
      error: `Not enough capacity in the new slot (${config.capacityPerSlot - occupied} places left).`,
    };
  }

  await db
    .prepare("UPDATE bookings SET date = ?, slot = ?, updated_at = ? WHERE id = ?")
    .bind(newDate, newSlot, nowIso, row.id)
    .run();

  const updated = rowToBooking({
    ...row,
    date: newDate,
    slot: newSlot,
    updated_at: nowIso,
  });

  return { success: true, booking: updated };
}

/**
 * Fetch a single booking by reference
 */
export async function getBookingByReference(reference: string): Promise<Booking | undefined> {
  await purgeExpiredHolds();
  const db = await getDb();
  const row = await db
    .prepare("SELECT * FROM bookings WHERE UPPER(reference) = UPPER(?)")
    .bind(reference)
    .first<BookingRow>();

  return row ? rowToBooking(row) : undefined;
}

/**
 * Fetch all bookings
 */
export async function getAllBookings(): Promise<Booking[]> {
  await purgeExpiredHolds();
  const db = await getDb();
  const res = await db.prepare("SELECT * FROM bookings ORDER BY date DESC, slot ASC").all<BookingRow>();
  return (res.results || []).map(rowToBooking);
}

/**
 * Group upcoming bookings by date and time slot for the admin view.
 */
export async function getUpcomingBookingsGrouped(): Promise<
  {
    date: string;
    dateFormatted: string;
    slots: {
      slot: TimeSlot;
      label: string;
      totalGuests: number;
      bookings: Booking[];
    }[];
  }[]
> {
  const allBookings = await getAllBookings();
  const todayStr = new Date().toISOString().split("T")[0];

  const upcoming = allBookings
    .filter((b) => b.date >= todayStr && (b.status === "paid" || b.status === "held"))
    .sort((a, b) => a.date.localeCompare(b.date));

  const byDate = new Map<string, Booking[]>();
  for (const b of upcoming) {
    const list = byDate.get(b.date) || [];
    list.push(b);
    byDate.set(b.date, list);
  }

  const result: {
    date: string;
    dateFormatted: string;
    slots: {
      slot: TimeSlot;
      label: string;
      totalGuests: number;
      bookings: Booking[];
    }[];
  }[] = [];

  for (const [date, bookingsOnDate] of byDate.entries()) {
    const dateFormatted = new Date(`${date}T12:00:00Z`).toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const slots = TIME_SLOTS.map((slotDef) => {
      const inSlot = bookingsOnDate.filter((b) => b.slot === slotDef.slot);
      const totalGuests = inSlot.reduce((sum, b) => sum + b.guests, 0);
      return {
        slot: slotDef.slot,
        label: slotDef.label,
        totalGuests,
        bookings: inSlot,
      };
    });

    result.push({ date, dateFormatted, slots });
  }

  return result;
}

/**
 * Admin action: Update capacity per slot
 */
export async function updateSlotCapacity(capacity: number): Promise<void> {
  const db = await getDb();
  await db
    .prepare("UPDATE admin_config SET capacity_per_slot = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1")
    .bind(Math.max(1, capacity))
    .run();
}

/**
 * Admin action: Add or remove blocked dates
 */
export async function toggleBlockedDate(dateStr: string, blocked: boolean): Promise<void> {
  const db = await getDb();
  const config = await getAdminConfig();
  let dates = [...config.blockedDates];

  if (blocked && !dates.includes(dateStr)) {
    dates.push(dateStr);
  } else if (!blocked) {
    dates = dates.filter((d) => d !== dateStr);
  }

  await db
    .prepare("UPDATE admin_config SET blocked_dates = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1")
    .bind(JSON.stringify(dates))
    .run();
}

/**
 * Admin action: Update cancellation policy text
 */
export async function updateCancellationPolicyText(newPolicy: string): Promise<void> {
  const db = await getDb();
  await db
    .prepare("UPDATE admin_config SET cancellation_policy_text = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1")
    .bind(newPolicy.trim())
    .run();
}

/**
 * Scheduled job: Process due 24h reminders
 */
export async function processDueReminders(): Promise<{
  scanned: number;
  sent: number;
  references: string[];
}> {
  const db = await getDb();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const rows = await db
    .prepare("SELECT * FROM bookings WHERE status = 'paid' AND reminder_sent_at IS NULL")
    .all<BookingRow>();

  let sent = 0;
  const sentRefs: string[] = [];

  for (const row of rows.results || []) {
    const booking = rowToBooking(row);
    const [year, month, day] = booking.date.split("-").map(Number);
    const bookingDate = new Date(year, month - 1, day);
    const diffDays = (bookingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays >= 0 && diffDays <= 1.5) {
      const res = await sendReminderEmail(booking);
      if (res.success) {
        sent++;
        sentRefs.push(booking.reference);
        await db
          .prepare("UPDATE bookings SET reminder_sent_at = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
          .bind(new Date().toISOString(), booking.id)
          .run();
      }
    }
  }

  return {
    scanned: rows.results?.length || 0,
    sent,
    references: sentRefs,
  };
}

/**
 * Reset booking store (used in test suites).
 */
export async function resetBookingStore(): Promise<void> {
  const db = await getDb();
  await db.exec("DELETE FROM bookings; DELETE FROM idempotency_keys; DELETE FROM audit_log;");
}
