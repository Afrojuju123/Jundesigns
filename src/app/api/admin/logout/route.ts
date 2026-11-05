import { NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/booking/admin-auth";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(ADMIN_COOKIE.name);
  return response;
}
