import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/booking/admin-auth";
import { cancelBooking } from "@/lib/booking/store";
import { isBookingsEnabled, disabledAdminResponse } from "@/lib/flags";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ reference: string }> }
) {
  if (!isBookingsEnabled()) {
    return disabledAdminResponse();
  }

  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { reference } = await params;
  const { reason } = await request.json().catch(() => ({ reason: "Cancelled by admin" }));

  const result = await cancelBooking(reference, reason);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result);
}
