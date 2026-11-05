import { NextRequest, NextResponse } from "next/server";
import { createBookingHold } from "@/lib/booking/store";
import { CreateHoldParams } from "@/lib/booking/types";

export async function POST(request: NextRequest) {
  try {
    const body: CreateHoldParams = await request.json();

    // Required fields check
    if (
      !body.workshopSlug ||
      !body.date ||
      !body.slot ||
      !body.guests ||
      !body.customerName ||
      !body.customerEmail ||
      !body.customerPhone
    ) {
      return NextResponse.json(
        { error: "Please provide all required customer and session details." },
        { status: 400 }
      );
    }

    const result = await createBookingHold(body);

    if (!result.success) {
      const status =
        result.errorCode === "CAPACITY_EXCEEDED"
          ? 409
          : result.errorCode === "CUTOFF_PASSED" || result.errorCode === "PAST_DATE"
          ? 400
          : 422;

      return NextResponse.json(
        { error: result.error, errorCode: result.errorCode },
        { status }
      );
    }

    return NextResponse.json({ success: true, booking: result.booking }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Internal server error creating hold." },
      { status: 500 }
    );
  }
}
