import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, getAdminCookieHeader } from "@/lib/booking/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!verifyPassword(password)) {
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    }

    const cookieHeader = getAdminCookieHeader();
    const response = NextResponse.json({ success: true });
    response.cookies.set(cookieHeader.name, cookieHeader.value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: cookieHeader.maxAge,
      sameSite: "lax",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Login failed." }, { status: 500 });
  }
}
