import { NextResponse } from "next/server";

/**
 * Feature flag helper for Jun Designs.
 * Defaults to true now that D1 storage is live, but respects explicit environment overrides.
 */
export function isBookingsEnabled(): boolean {
  const flag =
    process.env.NEXT_PUBLIC_BOOKINGS_ENABLED ?? process.env.BOOKINGS_ENABLED;
  if (flag === undefined) {
    return true;
  }
  return flag === "true" || flag === "1";
}

export const BOOKING_DISABLED_MESSAGE =
  "Online booking opens soon. To reserve now, message us on WhatsApp or call +250 780 324 944";

export function disabledBookingResponse() {
  return NextResponse.json(
    {
      error: BOOKING_DISABLED_MESSAGE,
      disabled: true,
    },
    { status: 503 }
  );
}

export function disabledAdminResponse() {
  return NextResponse.json(
    {
      error: "Service unavailable: Platform maintenance in progress.",
      disabled: true,
    },
    { status: 404 }
  );
}
