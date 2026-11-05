import { NextRequest, NextResponse } from "next/server";
import { getDayAvailability } from "@/lib/booking/store";
import { isBookingsEnabled, disabledBookingResponse } from "@/lib/flags";

export async function GET(request: NextRequest) {
  if (!isBookingsEnabled()) {
    return disabledBookingResponse();
  }

  const searchParams = request.nextUrl.searchParams;
  const workshopSlug = searchParams.get("workshop");
  const date = searchParams.get("date");

  if (!workshopSlug || !date) {
    return NextResponse.json(
      { error: "Missing workshop or date parameter." },
      { status: 400 }
    );
  }

  try {
    const availability = await getDayAvailability(workshopSlug, date);
    return NextResponse.json(availability);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to fetch availability." },
      { status: 500 }
    );
  }
}
