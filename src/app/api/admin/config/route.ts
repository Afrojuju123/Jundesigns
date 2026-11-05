import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/booking/admin-auth";
import { bookingConfig } from "@/lib/booking/config";
import {
  updateSlotCapacity,
  toggleBlockedDate,
  updateCancellationPolicyText,
  getAdminConfig,
} from "@/lib/booking/store";
import { isBookingsEnabled, disabledAdminResponse } from "@/lib/flags";

export async function GET() {
  if (!isBookingsEnabled()) {
    return disabledAdminResponse();
  }

  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = await getAdminConfig();
  return NextResponse.json(config);
}

export async function POST(request: NextRequest) {
  if (!isBookingsEnabled()) {
    return disabledAdminResponse();
  }

  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (typeof body.capacityPerSlot === "number") {
      await updateSlotCapacity(body.capacityPerSlot);
    }

    if (body.toggleBlockedDate) {
      const { date, blocked } = body.toggleBlockedDate;
      if (date && typeof blocked === "boolean") {
        await toggleBlockedDate(date, blocked);
      }
    }

    if (typeof body.cancellationPolicyText === "string") {
      await updateCancellationPolicyText(body.cancellationPolicyText);
    }

    const updatedConfig = await getAdminConfig();
    return NextResponse.json({
      success: true,
      config: updatedConfig,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to update configuration." },
      { status: 500 }
    );
  }
}
