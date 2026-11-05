import fs from "fs";
import path from "path";
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

const DATA_DIR = path.join(process.cwd(), "data");
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");
const CONFIG_FILE = path.join(DATA_DIR, "admin-config.json");

// Persistent memory store
interface StoreState {
  bookings: Map<string, Booking>; // key: reference
  idempotencyMap: Map<string, string>; // key: idempotencyKey, value: reference
  mutex: Promise<void>;
  initialized: boolean;
}

// Global singleton to persist across hot reloads in dev
const globalStore = global as unknown as { __JUN_BOOKING_STORE__?: StoreState };

if (!globalStore.__JUN_BOOKING_STORE__) {
  globalStore.__JUN_BOOKING_STORE__ = {
    bookings: new Map(),
    idempotencyMap: new Map(),
    mutex: Promise.resolve(),
    initialized: false,
  };
}

const state = globalStore.__JUN_BOOKING_STORE__;

function ensureDataDir(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.error("Failed to create data dir:", err);
  }
}

function persistStore(): void {
  try {
    ensureDataDir();
    const bookingsArray = Array.from(state.bookings.values());
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookingsArray, null, 2), "utf8");

    const adminConfig = {
      capacityPerSlot: bookingConfig.capacityPerSlot,
      blockedDates: bookingConfig.blockedDates,
      cancellationPolicyText: bookingConfig.cancellationPolicyText,
    };
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(adminConfig, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to persist bookings store:", err);
  }
}

function seedSampleBookings(): void {
  const today = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");

  const getDateStr = (offsetDays: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + offsetDays);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };

  const sampleBookings: Booking[] = [
    {
      id: "bk-sample-1",
      reference: "JUN-2026-M8K2",
      workshopSlug: "imigongo-painting",
      workshopName: "Imigongo Painting",
      date: getDateStr(1), // Tomorrow
      slot: "10:00",
      guests: 2,
      amountRwf: 50000,
      amountUsdEstimate: 37.04,
      currency: "RWF",
      status: "paid",
      customerName: "Elena Rostova",
      customerEmail: "elena.r@example.com",
      customerPhone: "788 123 456",
      customerCountry: "+250",
      note: "Two adults. First time in Kigali, very excited for traditional art!",
      holdExpiresAt: new Date(Date.now() + 86400000).toISOString(),
      paymentReference: "PAY-RW-982141",
      paymentProvider: "card",
      confirmationEmailSentAt: new Date(Date.now() - 3600000).toISOString(),
      studioEmailSentAt: new Date(Date.now() - 3600000).toISOString(),
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "bk-sample-2",
      reference: "JUN-2026-W3F7",
      workshopSlug: "hand-weaving",
      workshopName: "Carpet Hand-Weaving",
      date: getDateStr(1), // Tomorrow
      slot: "16:00",
      guests: 3,
      amountRwf: 75000,
      amountUsdEstimate: 55.56,
      currency: "RWF",
      status: "paid",
      customerName: "David Campbell",
      customerEmail: "d.campbell@example.org",
      customerPhone: "415 889 0122",
      customerCountry: "+1",
      note: "Traveling with family. Daughter is an art student.",
      holdExpiresAt: new Date(Date.now() + 86400000).toISOString(),
      paymentReference: "PAY-MOMO-554109",
      paymentProvider: "momo",
      confirmationEmailSentAt: new Date(Date.now() - 4000000).toISOString(),
      studioEmailSentAt: new Date(Date.now() - 4000000).toISOString(),
      createdAt: new Date(Date.now() - 8000000).toISOString(),
      updatedAt: new Date(Date.now() - 4000000).toISOString(),
    },
    {
      id: "bk-sample-3",
      reference: "JUN-2026-D4P9",
      workshopSlug: "traditional-dance",
      workshopName: "Traditional Rwandan Dance",
      date: getDateStr(3),
      slot: "10:00",
      guests: 4,
      amountRwf: 100000,
      amountUsdEstimate: 74.07,
      currency: "RWF",
      status: "paid",
      customerName: "Sarah de Vries",
      customerEmail: "sarah.devries@example.nl",
      customerPhone: "6 1234 5678",
      customerCountry: "+31",
      note: "Please inform the instructor we may take brief video clips for memory.",
      holdExpiresAt: new Date(Date.now() + 86400000).toISOString(),
      paymentReference: "PAY-RW-771920",
      paymentProvider: "card",
      confirmationEmailSentAt: new Date(Date.now() - 10000000).toISOString(),
      studioEmailSentAt: new Date(Date.now() - 10000000).toISOString(),
      createdAt: new Date(Date.now() - 12000000).toISOString(),
      updatedAt: new Date(Date.now() - 10000000).toISOString(),
    },
    {
      id: "bk-sample-4",
      reference: "JUN-2026-I9Q1",
      workshopSlug: "igisoro-game",
      workshopName: "Igisoro Game",
      date: getDateStr(4),
      slot: "16:00",
      guests: 2,
      amountRwf: 50000,
      amountUsdEstimate: 37.04,
      currency: "RWF",
      status: "paid",
      customerName: "Marc Dubois",
      customerEmail: "m.dubois@example.fr",
      customerPhone: "6 98 76 54 32",
      customerCountry: "+33",
      note: "Interested in the mathematical rules and history.",
      holdExpiresAt: new Date(Date.now() + 86400000).toISOString(),
      paymentReference: "PAY-AIRTEL-129034",
      paymentProvider: "airtel",
      confirmationEmailSentAt: new Date(Date.now() - 15000000).toISOString(),
      studioEmailSentAt: new Date(Date.now() - 15000000).toISOString(),
      createdAt: new Date(Date.now() - 16000000).toISOString(),
      updatedAt: new Date(Date.now() - 15000000).toISOString(),
    },
  ];

  for (const b of sampleBookings) {
    state.bookings.set(b.reference, b);
  }
  persistStore();
}

function loadPersistedStore(): void {
  if (state.initialized) return;
  state.initialized = true;

  try {
    ensureDataDir();

    // Load admin config if exists
    if (fs.existsSync(CONFIG_FILE)) {
      const configRaw = fs.readFileSync(CONFIG_FILE, "utf8");
      const cfg = JSON.parse(configRaw);
      if (typeof cfg.capacityPerSlot === "number") {
        bookingConfig.capacityPerSlot = cfg.capacityPerSlot;
      }
      if (Array.isArray(cfg.blockedDates)) {
        bookingConfig.blockedDates = cfg.blockedDates;
      }
      if (typeof cfg.cancellationPolicyText === "string") {
        bookingConfig.cancellationPolicyText = cfg.cancellationPolicyText;
      }
    }

    // Load bookings if exists
    if (fs.existsSync(BOOKINGS_FILE)) {
      const bookingsRaw = fs.readFileSync(BOOKINGS_FILE, "utf8");
      const bookings: Booking[] = JSON.parse(bookingsRaw);
      if (Array.isArray(bookings) && bookings.length > 0) {
        state.bookings.clear();
        for (const b of bookings) {
          state.bookings.set(b.reference, b);
          if (b.idempotencyKey) {
            state.idempotencyMap.set(b.idempotencyKey, b.reference);
          }
        }
        return;
      }
    }

    // If no bookings existed, seed initial sample bookings
    seedSampleBookings();
  } catch (err) {
    console.error("Error reading bookings file:", err);
    seedSampleBookings();
  }
}

// Run initial load
loadPersistedStore();

/**
 * Execute an operation under an atomic mutex lock to prevent race conditions.
 */
async function withLock<T>(fn: () => Promise<T> | T): Promise<T> {
  const previousMutex = state.mutex;
  let unlock: () => void = () => {};
  state.mutex = new Promise<void>((resolve) => {
    unlock = resolve;
  });

  try {
    await previousMutex;
    return await fn();
  } finally {
    unlock();
  }
}

/**
 * Generate human-readable booking reference: JUN- + 8 uppercase alphanumerics, e.g. JUN-8F3K2Q9X
 * Enforces uniqueness across the booking store.
 */
export function generateReference(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let ref = "";
  let attempts = 0;
  do {
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    ref = `JUN-${code}`;
    attempts++;
  } while (state.bookings.has(ref) && attempts < 100);
  return ref;
}

/**
 * Purge expired holds that were not completed within 10 minutes.
 * Cancels pending Pesapal orders asynchronously.
 */
export function purgeExpiredHolds(): number {
  const now = new Date();
  let count = 0;
  for (const [, booking] of state.bookings.entries()) {
    if (booking.status === "held" || booking.status === "payment_pending") {
      const expires = new Date(booking.holdExpiresAt);
      if (now > expires) {
        booking.status = "failed";
        booking.updatedAt = now.toISOString();
        count++;

        // Cancel on Pesapal if order was submitted
        if (booking.pesapalOrderTrackingId) {
          pesapalClient
            .cancelOrder(booking.pesapalOrderTrackingId)
            .catch(() => {});
        }
      }
    }
  }
  if (count > 0) {
    persistStore();
  }
  return count;
}

/**
 * Check if same-day cut-off has passed for a given slot.
 * All times evaluated in Kigali Time (CAT, UTC+2).
 */
export function isSlotPastCutoff(dateStr: string, slot: TimeSlot, now = new Date()): boolean {
  const kigaliOffset = 2 * 60; // minutes
  const utcNow = now.getTime() + now.getTimezoneOffset() * 60000;
  const kigaliNow = new Date(utcNow + kigaliOffset * 60000);

  const [year, month, day] = dateStr.split("-").map(Number);
  const slotHour = slot === "10:00" ? 10 : 16;

  const slotKigaliTime = new Date(year, month - 1, day, slotHour, 0, 0);

  if (kigaliNow >= slotKigaliTime) {
    return true;
  }

  const isSameDay =
    kigaliNow.getFullYear() === year &&
    kigaliNow.getMonth() === month - 1 &&
    kigaliNow.getDate() === day;

  if (isSameDay) {
    const diffHours = (slotKigaliTime.getTime() - kigaliNow.getTime()) / (1000 * 60 * 60);
    if (diffHours < bookingConfig.cutoffHoursBeforeSlot) {
      return true;
    }
  }

  return false;
}

/**
 * Get availability details for a specific workshop and date.
 */
export async function getDayAvailability(
  workshopSlug: string,
  dateStr: string
): Promise<DayAvailability> {
  return withLock(async () => {
    purgeExpiredHolds();

    const todayStr = new Date().toISOString().split("T")[0];
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + bookingConfig.maxDaysInAdvance);
    const maxDateStr = maxDate.toISOString().split("T")[0];

    const isPast = dateStr < todayStr;
    const isBeyondWindow = dateStr > maxDateStr;
    const isBlocked = bookingConfig.blockedDates.includes(dateStr);

    const slots: SlotAvailability[] = TIME_SLOTS.map(({ slot, label }) => {
      let bookedCount = 0;
      let heldCount = 0;

      for (const booking of state.bookings.values()) {
        if (
          booking.workshopSlug === workshopSlug &&
          booking.date === dateStr &&
          booking.slot === slot
        ) {
          if (booking.status === "paid") {
            bookedCount += booking.guests;
          } else if (booking.status === "held" || booking.status === "payment_pending") {
            heldCount += booking.guests;
          }
        }
      }

      const totalOccupied = bookedCount + heldCount;
      const remainingPlaces = Math.max(0, bookingConfig.capacityPerSlot - totalOccupied);

      let isAvailable = true;
      let disabledReason: string | undefined;

      if (isPast) {
        isAvailable = false;
        disabledReason = "Past date";
      } else if (isBeyondWindow) {
        isAvailable = false;
        disabledReason = "Beyond 90-day window";
      } else if (isBlocked) {
        isAvailable = false;
        disabledReason = "Studio closed";
      } else if (isSlotPastCutoff(dateStr, slot)) {
        isAvailable = false;
        disabledReason = "Cut-off time passed for today";
      } else if (remainingPlaces <= 0) {
        isAvailable = false;
        disabledReason = "Sold out";
      }

      return {
        slot,
        timeLabel: label,
        totalCapacity: bookingConfig.capacityPerSlot,
        bookedCount,
        heldCount,
        remainingPlaces,
        isAvailable,
        disabledReason,
      };
    });

    const hasSpace = slots.some((s) => s.isAvailable);

    return {
      date: dateStr,
      slots,
      hasSpace,
      isPast,
      isBlocked,
      isBeyondWindow,
    };
  });
}

/**
 * Atomically create a 10-minute hold for guests.
 */
export async function createBookingHold(
  params: CreateHoldParams
): Promise<{ success: boolean; booking?: Booking; error?: string; errorCode?: string }> {
  return withLock(async () => {
    purgeExpiredHolds();

    if (params.idempotencyKey && state.idempotencyMap.has(params.idempotencyKey)) {
      const ref = state.idempotencyMap.get(params.idempotencyKey)!;
      const existing = state.bookings.get(ref);
      if (existing) {
        return { success: true, booking: existing };
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

    if (bookingConfig.blockedDates.includes(params.date)) {
      return { success: false, error: "The studio is closed on this date.", errorCode: "DATE_BLOCKED" };
    }

    if (isSlotPastCutoff(params.date, params.slot)) {
      return {
        success: false,
        error: "Same-day booking cut-off has passed for this slot.",
        errorCode: "CUTOFF_PASSED",
      };
    }

    let occupied = 0;
    for (const b of state.bookings.values()) {
      if (
        b.workshopSlug === params.workshopSlug &&
        b.date === params.date &&
        b.slot === params.slot &&
        (b.status === "paid" || b.status === "held" || b.status === "payment_pending")
      ) {
        occupied += b.guests;
      }
    }

    const remaining = bookingConfig.capacityPerSlot - occupied;
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

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000);
    const reference = generateReference();
    const id = `bk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const amountRwf = workshop.priceRwf * params.guests;
    const { usd } = calculateEstimates(amountRwf);

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
      customerName: params.customerName,
      customerEmail: params.customerEmail,
      customerPhone: params.customerPhone,
      customerCountry: params.customerCountry,
      note: params.note,
      holdExpiresAt: expiresAt.toISOString(),
      idempotencyKey: params.idempotencyKey,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    // If Pesapal is configured, submit order to obtain tracking ID & redirect URL
    const hasPesapal =
      process.env.PESAPAL_CONSUMER_KEY &&
      process.env.PESAPAL_CONSUMER_SECRET &&
      process.env.PESAPAL_CONSUMER_KEY !== "mock";

    if (hasPesapal) {
      try {
        const pesapalOrder = await pesapalProvider.createPaymentOrder(booking);
        booking.pesapalOrderTrackingId = pesapalOrder.order_tracking_id;
        booking.redirectUrl = pesapalOrder.redirect_url;
        booking.status = "payment_pending";
        booking.paymentProvider = "pesapal";
      } catch (err: any) {
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

    state.bookings.set(reference, booking);
    if (params.idempotencyKey) {
      state.idempotencyMap.set(params.idempotencyKey, reference);
    }
    persistStore();

    return { success: true, booking };
  });
}

/**
 * Atomically process or confirm payment for a held booking.
 * Sends confirmation email to guest and alert email to Jun Designs studio idempotently.
 */
export async function confirmBookingPayment(
  reference: string,
  paymentReference: string,
  provider: "card" | "momo" | "airtel" = "card",
  options?: { isLateWebhook?: boolean; forceExpired?: boolean }
): Promise<{ success: boolean; booking?: Booking; error?: string; errorCode?: string }> {
  return withLock(async () => {
    const booking = state.bookings.get(reference);
    if (!booking) {
      return { success: false, error: "Booking reference not found.", errorCode: "NOT_FOUND" };
    }

    // Idempotency: if already paid, ensure emails were dispatched, return existing success
    if (booking.status === "paid") {
      if (!booking.confirmationEmailSentAt) {
        await sendBookingConfirmationEmail(booking);
      }
      if (!booking.studioEmailSentAt) {
        await sendStudioAlertEmail(booking);
      }
      persistStore();
      return { success: true, booking };
    }

    const now = new Date();
    const isExpired = options?.forceExpired || now > new Date(booking.holdExpiresAt);

    if (isExpired && !options?.isLateWebhook) {
      booking.status = "failed";
      booking.updatedAt = now.toISOString();
      persistStore();
      return {
        success: false,
        error: "Your 10-minute hold has expired. Please select your time slot again.",
        errorCode: "EXPIRED_HOLD",
      };
    }

    if (isExpired && options?.isLateWebhook) {
      let occupied = 0;
      for (const b of state.bookings.values()) {
        if (
          b.reference !== reference &&
          b.workshopSlug === booking.workshopSlug &&
          b.date === booking.date &&
          b.slot === booking.slot &&
          (b.status === "paid" || b.status === "held")
        ) {
          occupied += b.guests;
        }
      }
      if (occupied + booking.guests > bookingConfig.capacityPerSlot) {
        booking.status = "refunded";
        booking.paymentReference = paymentReference;
        booking.updatedAt = now.toISOString();
        persistStore();
        return {
          success: false,
          error: "Late payment arrived after hold expired and slot was filled. Automatic refund initiated.",
          errorCode: "REFUNDED_CAPACITY_LOST",
        };
      }
    }

    // Confirm booking to paid
    booking.status = "paid";
    booking.paymentReference = paymentReference;
    booking.paymentProvider = provider;
    booking.updatedAt = now.toISOString();

    // Trigger transactional emails
    if (!booking.confirmationEmailSentAt) {
      await sendBookingConfirmationEmail(booking);
    }
    if (!booking.studioEmailSentAt) {
      await sendStudioAlertEmail(booking);
    }
    persistStore();

    return { success: true, booking };
  });
}

/**
 * Shared atomic, idempotent transition function for Pesapal transaction updates.
 * Used by:
 * 1. IPN Webhook (GET /api/pesapal/ipn)
 * 2. Return URL callback (GET /booking/return)
 * 3. Client drawer status polling (GET /api/booking/[reference]/status)
 * 4. Reconciliation cron job (GET /api/cron/reconcile-pending)
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
  return withLock(async () => {
    // 1. Fetch transaction status from Pesapal if not provided
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
    const targetRef = (
      status.merchant_reference ||
      options?.merchantReference ||
      ""
    ).toUpperCase();

    let booking = state.bookings.get(targetRef);
    if (!booking) {
      for (const b of state.bookings.values()) {
        if (b.pesapalOrderTrackingId === orderTrackingId) {
          booking = b;
          break;
        }
      }
    }

    if (!booking) {
      return {
        success: false,
        error: `Booking not found for merchant reference "${targetRef}" or tracking ID "${orderTrackingId}"`,
        booking: null,
      };
    }

    // Keep tracking ID up-to-date
    if (!booking.pesapalOrderTrackingId) {
      booking.pesapalOrderTrackingId = orderTrackingId;
    }
    if (status.payment_method) {
      booking.pesapalPaymentMethod = status.payment_method;
    }
    if (status.payment_account) {
      booking.pesapalPaymentAccount = status.payment_account;
    }

    // 3. Security checks: currency & amount verification
    if (status.currency && status.currency.toUpperCase() !== "RWF") {
      console.error(
        `[SECURITY ALERT] Pesapal currency mismatch for ${booking.reference}: expected RWF, got ${status.currency}`
      );
      return {
        success: false,
        error: `Security alert: Currency mismatch (${status.currency} vs RWF). Payment rejected.`,
        booking,
      };
    }

    if (
      typeof status.amount === "number" &&
      Math.round(status.amount) !== booking.amountRwf
    ) {
      console.error(
        `[SECURITY ALERT] Pesapal amount mismatch for ${booking.reference}: expected ${booking.amountRwf}, got ${status.amount}`
      );
      return {
        success: false,
        error: `Security alert: Payment amount mismatch (${status.amount} vs ${booking.amountRwf}). Payment rejected.`,
        booking,
      };
    }

    // 4. Handle Status Codes
    // status_code: 0 = INVALID/PENDING, 1 = COMPLETED, 2 = FAILED, 3 = REVERSED
    const statusCode = status.status_code;

    if (statusCode === 1) {
      // COMPLETED: Payment successful
      if (booking.status === "paid") {
        // Idempotent: already marked paid. Ensure transactional emails were sent.
        if (!booking.confirmationEmailSentAt) {
          await sendBookingConfirmationEmail(booking);
        }
        if (!booking.studioEmailSentAt) {
          await sendStudioAlertEmail(booking);
        }
        persistStore();
        return { success: true, booking, transition: "already_paid" };
      }

      // Check if hold expired before payment was completed
      const now = new Date();
      const isExpired = now > new Date(booking.holdExpiresAt);

      if (isExpired) {
        // Capacity check: did other confirmed bookings fill the slot in the meantime?
        let occupied = 0;
        for (const b of state.bookings.values()) {
          if (
            b.reference !== booking.reference &&
            b.workshopSlug === booking.workshopSlug &&
            b.date === booking.date &&
            b.slot === booking.slot &&
            b.status === "paid"
          ) {
            occupied += b.guests;
          }
        }

        if (occupied + booking.guests > bookingConfig.capacityPerSlot) {
          // Capacity lost! Initiate automatic refund and flag for admin
          booking.status = "refunded";
          booking.refundStatus = "requested";
          booking.pesapalConfirmationCode = status.confirmation_code;
          booking.cancellationReason =
            "Payment arrived after 10-minute hold expired and slot capacity was filled by other guests. Automatic refund requested.";
          booking.updatedAt = now.toISOString();
          persistStore();

          // Attempt automated refund request to Pesapal
          if (status.confirmation_code) {
            pesapalProvider
              .requestRefund(
                status.confirmation_code,
                booking.amountRwf,
                "Automatic refund: slot filled after hold expiration",
                "system-auto"
              )
              .catch((err) => {
                console.error("Auto refund request failed:", err);
              });
          }

          return {
            success: false,
            error:
              "Your payment was received, but the 10-minute hold expired and all places were taken. A full refund has been requested.",
            booking,
            transition: "refunded_capacity_lost",
          };
        }
      }

      // Mark paid
      booking.status = "paid";
      booking.pesapalConfirmationCode = status.confirmation_code;
      booking.paymentReference =
        status.confirmation_code || `PESAPAL-${orderTrackingId.substring(0, 8)}`;
      booking.paymentProvider = "pesapal";
      booking.paidAt = now.toISOString();
      booking.updatedAt = now.toISOString();

      // Send transactional emails idempotently
      if (!booking.confirmationEmailSentAt) {
        await sendBookingConfirmationEmail(booking);
      }
      if (!booking.studioEmailSentAt) {
        await sendStudioAlertEmail(booking);
      }

      persistStore();
      return { success: true, booking, transition: "marked_paid" };
    }

    if (statusCode === 2) {
      // FAILED
      if (booking.status !== "paid") {
        booking.status = "failed";
        booking.updatedAt = new Date().toISOString();
        persistStore();
      }
      return {
        success: false,
        error: status.message || "Payment was failed or cancelled by issuer.",
        booking,
        transition: "marked_failed",
      };
    }

    if (statusCode === 3) {
      // REVERSED
      booking.status = "refunded";
      booking.refundStatus = "refunded";
      booking.updatedAt = new Date().toISOString();
      persistStore();
      return {
        success: true,
        booking,
        transition: "marked_reversed",
      };
    }

    // statusCode === 0 or unknown: Pending
    return {
      success: true,
      booking,
      transition: "pending",
    };
  });
}

/**
 * Admin action: Request refund via Pesapal API 3.0
 */
export async function refundBooking(
  reference: string,
  remarks: string,
  username = "admin"
): Promise<{ success: boolean; booking?: Booking; error?: string }> {
  return withLock(async () => {
    const booking = state.bookings.get(reference.toUpperCase());
    if (!booking) {
      return { success: false, error: "Booking reference not found." };
    }
    if (booking.status !== "paid") {
      return { success: false, error: "Only paid bookings can be refunded." };
    }

    const confCode = booking.pesapalConfirmationCode || booking.paymentReference;
    if (!confCode) {
      return {
        success: false,
        error: "No Pesapal payment confirmation code available for refund.",
      };
    }

    try {
      await pesapalProvider.requestRefund(
        confCode,
        booking.amountRwf,
        remarks,
        username
      );

      booking.refundStatus = "requested";
      booking.refundRemarks = remarks;
      booking.refundRequestedAt = new Date().toISOString();
      booking.updatedAt = new Date().toISOString();
      persistStore();

      return { success: true, booking };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Failed to submit refund request to Pesapal.",
      };
    }
  });
}

/**
 * Fetch booking by reference.
 */
export function getBookingByReference(reference: string): Booking | undefined {
  purgeExpiredHolds();
  return state.bookings.get(reference.toUpperCase());
}

/**
 * Fetch all bookings (for Admin)
 */
export function getAllBookings(): Booking[] {
  purgeExpiredHolds();
  return Array.from(state.bookings.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Get upcoming bookings grouped by date and slot (for Admin view)
 */
export function getUpcomingBookingsGrouped(): {
  date: string;
  dateFormatted: string;
  slots: {
    slot: TimeSlot;
    label: string;
    totalGuests: number;
    bookings: Booking[];
  }[];
}[] {
  purgeExpiredHolds();
  const todayStr = new Date().toISOString().split("T")[0];

  const dateMap = new Map<string, Map<TimeSlot, Booking[]>>();

  for (const b of state.bookings.values()) {
    if (b.status !== "failed" && b.date >= todayStr) {
      if (!dateMap.has(b.date)) {
        dateMap.set(b.date, new Map([["10:00", []], ["16:00", []]]));
      }
      const slotMap = dateMap.get(b.date)!;
      if (slotMap.has(b.slot)) {
        slotMap.get(b.slot)!.push(b);
      }
    }
  }

  // Sort dates ascending
  const sortedDates = Array.from(dateMap.keys()).sort();

  return sortedDates.map((dateStr) => {
    const slotMap = dateMap.get(dateStr)!;
    const [year, month, day] = dateStr.split("-").map(Number);
    const d = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    const dateFormatted = d.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });

    return {
      date: dateStr,
      dateFormatted,
      slots: [
        {
          slot: "10:00" as TimeSlot,
          label: "Morning 10:00am",
          totalGuests: (slotMap.get("10:00") || []).reduce(
            (acc, b) => acc + (b.status === "paid" ? b.guests : 0),
            0
          ),
          bookings: slotMap.get("10:00") || [],
        },
        {
          slot: "16:00" as TimeSlot,
          label: "Afternoon 4:00pm",
          totalGuests: (slotMap.get("16:00") || []).reduce(
            (acc, b) => acc + (b.status === "paid" ? b.guests : 0),
            0
          ),
          bookings: slotMap.get("16:00") || [],
        },
      ],
    };
  });
}

/**
 * Admin action: Cancel booking
 */
export async function cancelBooking(
  reference: string,
  reason: string = "Admin cancelled"
): Promise<{ success: boolean; booking?: Booking; error?: string }> {
  return withLock(async () => {
    const booking = state.bookings.get(reference.toUpperCase());
    if (!booking) {
      return { success: false, error: "Booking reference not found." };
    }

    booking.status = "cancelled";
    booking.cancellationReason = reason;
    booking.updatedAt = new Date().toISOString();
    persistStore();

    return { success: true, booking };
  });
}

/**
 * Admin action: Reschedule booking
 */
export async function rescheduleBooking(
  reference: string,
  newDate: string,
  newSlot: TimeSlot
): Promise<{ success: boolean; booking?: Booking; error?: string }> {
  return withLock(async () => {
    const booking = state.bookings.get(reference.toUpperCase());
    if (!booking) {
      return { success: false, error: "Booking reference not found." };
    }

    if (bookingConfig.blockedDates.includes(newDate)) {
      return { success: false, error: "The studio is closed on the new selected date." };
    }

    // Check capacity on new date & slot
    let occupied = 0;
    for (const b of state.bookings.values()) {
      if (
        b.reference !== reference &&
        b.workshopSlug === booking.workshopSlug &&
        b.date === newDate &&
        b.slot === newSlot &&
        b.status === "paid"
      ) {
        occupied += b.guests;
      }
    }

    if (occupied + booking.guests > bookingConfig.capacityPerSlot) {
      return {
        success: false,
        error: `Not enough capacity in the new slot (${bookingConfig.capacityPerSlot - occupied} places left).`,
      };
    }

    booking.date = newDate;
    booking.slot = newSlot;
    booking.updatedAt = new Date().toISOString();
    persistStore();

    return { success: true, booking };
  });
}

/**
 * Admin action: Update capacity per slot
 */
export function updateSlotCapacity(capacity: number): void {
  bookingConfig.capacityPerSlot = Math.max(1, capacity);
  persistStore();
}

/**
 * Admin action: Add or remove blocked dates
 */
export function toggleBlockedDate(dateStr: string, blocked: boolean): void {
  if (blocked && !bookingConfig.blockedDates.includes(dateStr)) {
    bookingConfig.blockedDates.push(dateStr);
  } else if (!blocked) {
    bookingConfig.blockedDates = bookingConfig.blockedDates.filter((d) => d !== dateStr);
  }
  persistStore();
}

/**
 * Admin action: Update cancellation policy text
 */
export function updateCancellationPolicyText(newPolicy: string): void {
  bookingConfig.cancellationPolicyText = newPolicy.trim();
  persistStore();
}

/**
 * Scheduled job: Process due 24h reminders
 */
export async function processDueReminders(): Promise<{
  scanned: number;
  sent: number;
  references: string[];
}> {
  return withLock(async () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let sent = 0;
    const sentRefs: string[] = [];

    for (const booking of state.bookings.values()) {
      if (booking.status === "paid" && !booking.reminderEmailSentAt) {
        const [year, month, day] = booking.date.split("-").map(Number);
        const bookingDate = new Date(year, month - 1, day);
        const diffDays = (bookingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

        // If session is within the next 1-2 days (e.g. tomorrow)
        if (diffDays >= 0 && diffDays <= 1.5) {
          const res = await sendReminderEmail(booking);
          if (res.success) {
            sent++;
            sentRefs.push(booking.reference);
          }
        }
      }
    }

    if (sent > 0) {
      persistStore();
    }

    return {
      scanned: state.bookings.size,
      sent,
      references: sentRefs,
    };
  });
}

/**
 * Helper to reset/seed store (used for test suites).
 */
export function resetBookingStore(): void {
  state.bookings.clear();
  state.idempotencyMap.clear();
  seedSampleBookings();
}
