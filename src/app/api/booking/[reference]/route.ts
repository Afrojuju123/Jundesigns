import { NextRequest, NextResponse } from "next/server";
import { getBookingByReference } from "@/lib/booking/store";
import { isBookingsEnabled, disabledBookingResponse } from "@/lib/flags";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ reference: string }> }
) {
  if (!isBookingsEnabled()) {
    return disabledBookingResponse();
  }

  const { reference } = await params;

  if (!reference) {
    return NextResponse.json({ error: "Missing booking reference." }, { status: 400 });
  }

  const booking = getBookingByReference(reference.toUpperCase());

  if (!booking) {
    return NextResponse.json({ error: "Booking reference not found." }, { status: 404 });
  }

  return NextResponse.json(booking);
}
