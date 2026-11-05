import { NextRequest, NextResponse } from "next/server";
import { paymentProvider } from "@/lib/booking/payment";
import { PaymentRequest } from "@/lib/booking/types";

export async function POST(request: NextRequest) {
  try {
    const body: PaymentRequest = await request.json();

    if (!body.bookingReference || !body.provider) {
      return NextResponse.json(
        { error: "Missing booking reference or payment provider." },
        { status: 400 }
      );
    }

    const result = await paymentProvider.processPayment(body);

    if (!result.success) {
      const status =
        result.errorCode === "EXPIRED_HOLD"
          ? 410
          : result.errorCode === "DECLINED"
          ? 402
          : result.errorCode === "NETWORK_ERROR"
          ? 504
          : 400;

      return NextResponse.json(
        { error: result.error, errorCode: result.errorCode },
        { status }
      );
    }

    return NextResponse.json({
      success: true,
      booking: result.booking,
      paymentReference: result.paymentReference,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Internal payment error." },
      { status: 500 }
    );
  }
}
