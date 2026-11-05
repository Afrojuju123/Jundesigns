import { NextResponse } from "next/server";

/**
 * Feature flag helper for Jun Designs.
 * Defaults to false in production until backend storage (D1) is fully migrated.
 */
export function isBookingsEnabled(): boolean {
  const flag =
    process.env.NEXT_PUBLIC_BOOKINGS_ENABLED ?? process.env.BOOKINGS_ENABLED;
  return flag === "true";
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
