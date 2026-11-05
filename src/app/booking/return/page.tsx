import { redirect } from "next/navigation";
import { applyPesapalStatusTransition, getBookingByReference } from "@/lib/booking/store";

interface ReturnPageProps {
  searchParams: Promise<{
    OrderTrackingId?: string;
    orderTrackingId?: string;
    OrderMerchantReference?: string;
    orderMerchantReference?: string;
  }>;
}

export default async function BookingReturnPage({ searchParams }: ReturnPageProps) {
  const params = await searchParams;
  const orderTrackingId = params.OrderTrackingId || params.orderTrackingId || "";
  const orderMerchantReference =
    params.OrderMerchantReference || params.orderMerchantReference || "";

  if (!orderTrackingId && !orderMerchantReference) {
    redirect("/workshops");
  }

  let bookingReference = orderMerchantReference;

  if (orderTrackingId) {
    try {
      const result = await applyPesapalStatusTransition(orderTrackingId, {
        merchantReference: orderMerchantReference,
      });

      if (result.booking) {
        bookingReference = result.booking.reference;

        if (result.booking.status === "paid") {
          redirect(`/booking/${bookingReference}?confirmed=1`);
        } else if (result.booking.status === "failed") {
          redirect(`/booking/cancelled?reference=${bookingReference}&status=failed`);
        } else if (result.booking.status === "refunded") {
          redirect(`/booking/cancelled?reference=${bookingReference}&status=refunded`);
        }
      }
    } catch (err) {
      console.error("Error processing return callback:", err);
    }
  }

  // Fallback check
  if (bookingReference) {
    const b = getBookingByReference(bookingReference);
    if (b && b.status === "paid") {
      redirect(`/booking/${bookingReference}?confirmed=1`);
    } else {
      redirect(`/booking/${bookingReference}`);
    }
  }

  redirect("/workshops");
}
