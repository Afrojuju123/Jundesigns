import { NextRequest, NextResponse } from "next/server";
import { applyPesapalStatusTransition } from "@/lib/booking/store";
import { isBookingsEnabled, disabledBookingResponse } from "@/lib/flags";

export async function GET(request: NextRequest) {
  if (!isBookingsEnabled()) {
    return disabledBookingResponse();
  }

  const { searchParams } = new URL(request.url);
  const orderTrackingId =
    searchParams.get("OrderTrackingId") ||
    searchParams.get("orderTrackingId") ||
    "";
  const orderMerchantReference =
    searchParams.get("OrderMerchantReference") ||
    searchParams.get("orderMerchantReference") ||
    "";

  if (!orderTrackingId) {
    return NextResponse.json(
      { error: "Missing OrderTrackingId parameter" },
      { status: 400 }
    );
  }

  try {
    await applyPesapalStatusTransition(orderTrackingId, {
      merchantReference: orderMerchantReference,
    });

    // Return standard Pesapal IPN receipt acknowledgment
    return NextResponse.json(
      {
        orderNotificationType: "IPNCHANGE",
        orderTrackingId,
        orderMerchantReference,
        status: 200,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error processing Pesapal IPN:", err);
    // Return 200 with error log so Pesapal doesn't spam retry loops if it was a data mismatch
    return NextResponse.json(
      {
        orderNotificationType: "IPNCHANGE",
        orderTrackingId,
        orderMerchantReference,
        status: 200,
      },
      { status: 200 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isBookingsEnabled()) {
    return disabledBookingResponse();
  }

  // Support POST webhook payloads as well
  let orderTrackingId = "";
  let orderMerchantReference = "";

  try {
    const body = await request.json();
    orderTrackingId = body?.OrderTrackingId || body?.orderTrackingId || "";
    orderMerchantReference =
      body?.OrderMerchantReference || body?.orderMerchantReference || "";
  } catch {
    const { searchParams } = new URL(request.url);
    orderTrackingId = searchParams.get("OrderTrackingId") || "";
    orderMerchantReference = searchParams.get("OrderMerchantReference") || "";
  }

  if (orderTrackingId) {
    try {
      await applyPesapalStatusTransition(orderTrackingId, {
        merchantReference: orderMerchantReference,
      });
    } catch (err) {
      console.error("Error handling POST Pesapal IPN:", err);
    }
  }

  return NextResponse.json(
    {
      orderNotificationType: "IPNCHANGE",
      orderTrackingId,
      orderMerchantReference,
      status: 200,
    },
    { status: 200 }
  );
}
