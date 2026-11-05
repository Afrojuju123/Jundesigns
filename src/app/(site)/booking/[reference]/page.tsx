import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBookingByReference } from "@/lib/booking/store";
import { bookingConfig } from "@/lib/booking/config";
import { formatBookingDate, formatSlotLabel } from "@/lib/booking/email";
import { workshops } from "@/content/workshops";
import { ConfirmationClientView } from "./ConfirmationClientView";

interface PageProps {
  params: Promise<{ reference: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { reference } = await params;
  return {
    title: `Booking Confirmation ${reference} | Jun Designs Kigali`,
    description: "Official workshop booking confirmation and visit logistics for Jun Designs.",
    robots: { index: false, follow: false },
  };
}

export default async function BookingConfirmationPage({ params }: PageProps) {
  const { reference } = await params;
  const booking = getBookingByReference(reference);

  if (!booking) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-20 px-4 bg-white text-brown-950">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center mx-auto text-amber text-2xl font-bold">
            ?
          </div>
          <div className="space-y-2">
            <span className="font-display text-xs font-bold uppercase tracking-eyebrow text-amber">
              — Reference Not Found
            </span>
            <h1 className="font-serif text-3xl font-semibold text-brown-950">
              Booking Not Found
            </h1>
            <p className="font-sans text-sm text-brown-700 leading-relaxed">
              We couldn’t find a booking with reference <code className="bg-stone-100 px-2 py-0.5 rounded font-mono text-xs text-brown-900">{reference}</code>. Please double-check your link or contact our studio.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center h-12 px-6 rounded-button font-display text-xs font-bold uppercase tracking-button bg-amber text-brown-950 hover:bg-amber-400 transition-colors"
            >
              Explore Workshops
            </Link>
            <a
              href="tel:+250780324944"
              className="inline-flex items-center justify-center h-12 px-6 rounded-button font-display text-xs font-bold uppercase tracking-button bg-stone-100 text-brown-950 hover:bg-stone-200 border border-stone-200 transition-colors"
            >
              Call +250 780 324 944
            </a>
          </div>
        </div>
      </div>
    );
  }

  const workshop = workshops.find((w) => w.slug === booking.workshopSlug);
  const whatToBring =
    workshop?.whatToBring ||
    "All workshop materials, tools and guidance are fully provided. Wear comfortable clothes and bring a bottle of water if you wish. Mornings and late afternoons on Rebero hill can be cool, so a light jacket is recommended.";

  const dateFormatted = formatBookingDate(booking.date);
  const timeFormatted = formatSlotLabel(booking.slot);

  return (
    <ConfirmationClientView
      booking={booking}
      dateFormatted={dateFormatted}
      timeFormatted={timeFormatted}
      whatToBring={whatToBring}
      cancellationPolicy={bookingConfig.cancellationPolicyText}
    />
  );
}
