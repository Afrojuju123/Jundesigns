import { NextRequest, NextResponse } from "next/server";
import { paymentProvider } from "@/lib/booking/payment";
import { confirmBookingPayment } from "@/lib/booking/store";

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("x-signature") || "";
    const payload = await request.json();

    const { valid, reference } = await paymentProvider.verifyWebhook(payload, signature);

    if (!valid || !reference) {
      return NextResponse.json({ error: "Invalid webhook signature or payload." }, { status: 401 });
    }

    const isLate = payload?.isLate === true;
    const paymentRef = payload?.paymentReference || `WEBHOOK-PAY-${Date.now()}`;

    const result = await confirmBookingPayment(reference, paymentRef, "card", {
      isLateWebhook: isLate,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error, errorCode: result.errorCode },
        { status: result.errorCode === "REFUNDED_CAPACITY_LOST" ? 200 : 400 }
      );
    }

    return NextResponse.json({ received: true, status: result.booking?.status });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Webhook processing error." }, { status: 500 });
  }
}
