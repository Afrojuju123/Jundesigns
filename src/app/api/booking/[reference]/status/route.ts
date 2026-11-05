import { NextRequest, NextResponse } from "next/server";
import {
  applyPesapalStatusTransition,
  getBookingByReference,
  purgeExpiredHolds,
} from "@/lib/booking/store";
import { isBookingsEnabled, disabledBookingResponse } from "@/lib/flags";

// Debounce map: trackingId -> last checked timestamp
const lastStatusCheckMap = new Map<string, number>();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ reference: string }> }
) {
  if (!isBookingsEnabled()) {
    return disabledBookingResponse();
  }

  const { reference } = await params;

  if (!reference) {
    return NextResponse.json(
      { error: "Missing booking reference." },
      { status: 400 }
    );
  }

  await purgeExpiredHolds();
  let booking = await getBookingByReference(reference.toUpperCase());

  if (!booking) {
    return NextResponse.json(
      { error: "Booking reference not found." },
      { status: 404 }
    );
  }

  // If already in final state, return immediately
  if (booking.status === "paid" || booking.status === "failed" || booking.status === "refunded") {
    return NextResponse.json({
      status: booking.status,
      reference: booking.reference,
      paidAt: booking.paidAt,
      confirmationCode: booking.pesapalConfirmationCode,
      booking,
    });
  }

  // If hold expired, mark as expired
  const isExpired = Date.now() > new Date(booking.holdExpiresAt).getTime();
  if (isExpired) {
    return NextResponse.json({
      status: "expired",
      reference: booking.reference,
      holdExpiresAt: booking.holdExpiresAt,
      booking,
    });
  }

  // If pending and has Pesapal tracking ID, check status with Pesapal (rate limited to once every 3s)
  if (booking.pesapalOrderTrackingId) {
    const now = Date.now();
    const lastCheck = lastStatusCheckMap.get(booking.pesapalOrderTrackingId) || 0;

    if (now - lastCheck >= 3000) {
      lastStatusCheckMap.set(booking.pesapalOrderTrackingId, now);
      try {
        const result = await applyPesapalStatusTransition(
          booking.pesapalOrderTrackingId,
          { merchantReference: booking.reference }
        );
        if (result.booking) {
          booking = result.booking;
        }
      } catch (err) {
        console.warn("Pesapal status check error during polling:", err);
      }
    }
  }

  return NextResponse.json({
    status: booking.status,
    reference: booking.reference,
    holdExpiresAt: booking.holdExpiresAt,
    redirectUrl: booking.redirectUrl,
    booking,
  });
}
