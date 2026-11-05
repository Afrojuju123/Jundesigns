import React from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, MessageSquare, Phone } from "lucide-react";
import { pesapalClient } from "@/lib/booking/pesapal/client";
import { cancelBooking, getBookingByReference } from "@/lib/booking/store";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { Button } from "@/components/atoms/Button";

interface CancelledPageProps {
  searchParams: Promise<{
    OrderTrackingId?: string;
    orderTrackingId?: string;
    OrderMerchantReference?: string;
    orderMerchantReference?: string;
    reference?: string;
    status?: string;
  }>;
}

export default async function BookingCancelledPage({ searchParams }: CancelledPageProps) {
  const params = await searchParams;
  const orderTrackingId = params.OrderTrackingId || params.orderTrackingId || "";
  const ref =
    params.OrderMerchantReference ||
    params.orderMerchantReference ||
    params.reference ||
    "";
  const statusParam = params.status;

  if (orderTrackingId) {
    pesapalClient.cancelOrder(orderTrackingId).catch(() => {});
  }

  if (ref) {
    await cancelBooking(ref, "User cancelled on payment gateway");
  }

  const booking = ref ? getBookingByReference(ref) : undefined;

  const isRefunded = statusParam === "refunded" || booking?.status === "refunded";
  const isFailed = statusParam === "failed" || booking?.status === "failed";

  return (
    <div className="min-h-screen bg-sand-warm pt-32 pb-24 px-4 sm:px-6">
      <div className="max-w-xl mx-auto bg-brown-900 border border-amber-400/20 rounded-card p-6 sm:p-10 text-left shadow-2xl">
        <div className="w-12 h-12 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mb-6">
          <AlertCircle className="w-6 h-6 text-amber" />
        </div>

        <Eyebrow>
          {isRefunded ? "PAYMENT REFUNDED" : isFailed ? "PAYMENT FAILED" : "PAYMENT CANCELLED"}
        </Eyebrow>

        <h1 className="font-display font-bold text-2xl sm:text-3xl text-sand-bright mt-2 mb-4">
          {isRefunded
            ? "Your session hold expired and was refunded"
            : isFailed
            ? "Your payment could not be processed"
            : "Your payment was not completed"}
        </h1>

        <p className="font-sans text-sm sm:text-base text-sand-primary leading-relaxed mb-6">
          {isRefunded
            ? "The 10-minute hold on your reserved slot expired and other guests booked the remaining capacity before payment completed. A full automatic refund has been requested."
            : isFailed
            ? "Your card issuer or mobile money provider declined the transaction, or the authorization timed out. No funds were captured."
            : "You cancelled the checkout session on Pesapal. No money was charged to your mobile money or card."}
        </p>

        {ref && (
          <div className="p-4 rounded-sm bg-brown-950/80 border border-amber-400/15 mb-8 space-y-2 text-xs">
            <div className="flex justify-between text-sand-muted">
              <span>Booking Reference:</span>
              <span className="font-mono text-sand-bright font-bold">{ref}</span>
            </div>
            {booking && (
              <>
                <div className="flex justify-between text-sand-muted">
                  <span>Workshop:</span>
                  <span className="text-sand-bright">{booking.workshopName}</span>
                </div>
                <div className="flex justify-between text-sand-muted">
                  <span>Date & Slot:</span>
                  <span className="text-sand-bright">
                    {booking.date} at {booking.slot === "10:00" ? "10:00am" : "4:00pm"}
                  </span>
                </div>
              </>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link href={booking ? `/workshops/${booking.workshopSlug}?book=open` : "/workshops"} className="flex-1">
            <Button size="lg" className="w-full justify-center">
              Try booking again
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button variant="secondary" size="lg" className="w-full justify-center">
              Return to Home
            </Button>
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-amber-400/15 flex flex-wrap items-center justify-between gap-4 text-xs text-sand-muted">
          <span>Need help with payment?</span>
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/250780324944"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-amber hover:underline"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Jun Designs</span>
            </a>
            <a
              href="tel:+250780324944"
              className="inline-flex items-center gap-1.5 text-amber hover:underline"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>+250 780 324 944</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
