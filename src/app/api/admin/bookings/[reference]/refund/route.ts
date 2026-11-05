import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/booking/admin-auth";
import { refundBooking } from "@/lib/booking/store";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ reference: string }> }
) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { reference } = await params;
  const body = await request.json().catch(() => ({}));
  const remarks = body.remarks || "Refund requested by Jun Designs administrator";

  const result = await refundBooking(reference, remarks, "admin");

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result);
}
