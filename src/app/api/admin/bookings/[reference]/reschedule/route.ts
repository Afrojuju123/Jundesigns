import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/booking/admin-auth";
import { rescheduleBooking } from "@/lib/booking/store";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ reference: string }> }
) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { reference } = await params;
  const { newDate, newSlot } = await request.json();

  if (!newDate || !newSlot) {
    return NextResponse.json({ error: "Missing newDate or newSlot." }, { status: 400 });
  }

  const result = await rescheduleBooking(reference, newDate, newSlot);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result);
}
