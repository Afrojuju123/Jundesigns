import { NextRequest, NextResponse } from "next/server";
import { purgeExpiredHolds } from "@/lib/booking/store";
import { isBookingsEnabled } from "@/lib/flags";

export async function GET(request: NextRequest) {
  if (!isBookingsEnabled()) {
    return NextResponse.json({ message: "Cron jobs paused: bookings disabled." });
  }

  // Optional secret verification
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    const { searchParams } = new URL(request.url);
    const token =
      authHeader?.replace(/^Bearer\s+/i, "") || searchParams.get("secret");
    if (token !== cronSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const purgedCount = purgeExpiredHolds();

  return NextResponse.json({
    success: true,
    action: "reconcile-holds",
    timestamp: new Date().toISOString(),
    purgedCount,
  });
}
