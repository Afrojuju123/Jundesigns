import { NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/booking/admin-auth";
import { isBookingsEnabled, disabledAdminResponse } from "@/lib/flags";

export async function POST() {
  if (!isBookingsEnabled()) {
    return disabledAdminResponse();
  }

  const response = NextResponse.json({ success: true });
  response.cookies.delete(ADMIN_COOKIE.name);
  return response;
}
