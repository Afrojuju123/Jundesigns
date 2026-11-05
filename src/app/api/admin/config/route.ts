import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/booking/admin-auth";
import { bookingConfig } from "@/lib/booking/config";
import {
  updateSlotCapacity,
  toggleBlockedDate,
  updateCancellationPolicyText,
} from "@/lib/booking/store";

export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    capacityPerSlot: bookingConfig.capacityPerSlot,
    blockedDates: bookingConfig.blockedDates,
    cancellationPolicyText: bookingConfig.cancellationPolicyText,
  });
}

export async function POST(request: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (typeof body.capacityPerSlot === "number") {
      updateSlotCapacity(body.capacityPerSlot);
    }

    if (body.toggleBlockedDate) {
      const { date, blocked } = body.toggleBlockedDate;
      if (date && typeof blocked === "boolean") {
        toggleBlockedDate(date, blocked);
      }
    }

    if (typeof body.cancellationPolicyText === "string") {
      updateCancellationPolicyText(body.cancellationPolicyText);
    }

    return NextResponse.json({
      success: true,
      config: {
        capacityPerSlot: bookingConfig.capacityPerSlot,
        blockedDates: bookingConfig.blockedDates,
        cancellationPolicyText: bookingConfig.cancellationPolicyText,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Config update failed." }, { status: 500 });
  }
}
