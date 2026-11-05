import { NextRequest, NextResponse } from "next/server";
import { processDueReminders } from "@/lib/booking/store";
import { isBookingsEnabled } from "@/lib/flags";

export async function GET(request: NextRequest) {
  if (!isBookingsEnabled()) {
    return NextResponse.json({ message: "Cron jobs paused: bookings disabled." });
  }

  try {
    const authHeader = request.headers.get("authorization");
    const secret = process.env.CRON_SECRET;

    // If a secret is configured in environment, verify it
    if (secret && authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await processDueReminders();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...result,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Reminder cron failed." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
