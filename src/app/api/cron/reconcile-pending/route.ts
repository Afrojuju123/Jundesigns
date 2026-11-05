import { NextRequest, NextResponse } from "next/server";
import { getAllBookings, applyPesapalStatusTransition } from "@/lib/booking/store";
import { isBookingsEnabled } from "@/lib/flags";

export async function GET(request: NextRequest) {
  if (!isBookingsEnabled()) {
    return NextResponse.json({ message: "Cron jobs paused: bookings disabled." });
  }

  // Optional secret verification
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    const { searchParams } = new URL(request.url);
    const token =
      authHeader?.replace(/^Bearer\s+/i, "") || searchParams.get("secret");
    if (token !== cronSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const allBookings = await getAllBookings();
  const pending = allBookings.filter(
    (b) =>
      (b.status === "payment_pending" || b.status === "held") &&
      Boolean(b.pesapalOrderTrackingId)
  );

  const updated: string[] = [];

  for (const booking of pending) {
    try {
      const res = await applyPesapalStatusTransition(
        booking.pesapalOrderTrackingId!,
        { merchantReference: booking.reference }
      );
      if (res.transition && res.transition !== "pending") {
        updated.push(`${booking.reference} (${res.transition})`);
      }
    } catch (err: any) {
      console.warn(`Reconcile pending failed for ${booking.reference}:`, err.message);
    }
  }

  return NextResponse.json({
    success: true,
    action: "reconcile-pending",
    timestamp: new Date().toISOString(),
    scannedCount: pending.length,
    updatedCount: updated.length,
    updated,
  });
}
