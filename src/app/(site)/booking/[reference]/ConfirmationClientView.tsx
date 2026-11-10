"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Calendar as CalendarIcon,
  Clock,
  Users,
  MapPin,
  Phone,
  MessageSquare,
  Printer,
  Copy,
  Check,
  ArrowUpRight,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { Booking } from "@/lib/booking/types";

interface ConfirmationClientViewProps {
  booking: Booking;
  dateFormatted: string;
  timeFormatted: string;
  whatToBring: string;
  cancellationPolicy: string;
}

export const ConfirmationClientView: React.FC<ConfirmationClientViewProps> = ({
  booking,
  dateFormatted,
  timeFormatted,
  whatToBring,
  cancellationPolicy,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyRef = () => {
    navigator.clipboard.writeText(booking.reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Google Calendar URL generation
  const buildGoogleCalendarUrl = () => {
    const [year, month, day] = booking.date.split("-").map(Number);
    const startHourUtc = booking.slot === "10:00" ? 8 : 14;
    const endHourUtc = startHourUtc + 2;

    const pad = (n: number) => String(n).padStart(2, "0");
    const dtStart = `${year}${pad(month)}${pad(day)}T${pad(startHourUtc)}0000Z`;
    const dtEnd = `${year}${pad(month)}${pad(day)}T${pad(endHourUtc)}0000Z`;

    const title = encodeURIComponent(`Jun Designs — ${booking.workshopName}`);
    const details = encodeURIComponent(
      `Booking Reference: ${booking.reference}\nGuests: ${booking.guests}\nLocation: Kigali Culture Village (Agaseke Center building), Rebero, Kicukiro. Street KK 557 St, Kigali.\nPhone: +250 780 324 944`
    );
    const location = encodeURIComponent(
      `Kigali Culture Village, Rebero, Street KK 557 St, Kigali, Rwanda`
    );

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dtStart}/${dtEnd}&details=${details}&location=${location}`;
  };

  const isPaid = booking.status === "paid";
  const isHeld = booking.status === "held" || booking.status === "payment_pending";
  const isCancelled = booking.status === "cancelled";
  const isRefunded = booking.status === "refunded";

  return (
    <div className="min-h-screen bg-stone-50/70 text-brown-950 py-10 md:py-16 px-4 sm:px-6 lg:px-8">
      {/* Container: Max 760px for readable, print-friendly presentation */}
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Status Header Block */}
        <div className="bg-white rounded-card border border-stone-200/80 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
            <div className="flex items-center gap-3">
              {isPaid && (
                <div className="w-12 h-12 rounded-full bg-amber/15 text-amber flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 stroke-[2]" />
                </div>
              )}
              {isHeld && (
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 stroke-[2]" />
                </div>
              )}
              {(isCancelled || isRefunded) && (
                <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-6 h-6 stroke-[2]" />
                </div>
              )}
              <div>
                <span className="font-display text-[11px] font-bold uppercase tracking-eyebrow text-amber block">
                  — KIGALI, RWANDA
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-brown-950">
                  {isPaid && "Workshop Confirmed"}
                  {isHeld && "Booking Awaiting Payment"}
                  {isCancelled && "Booking Cancelled"}
                  {isRefunded && "Booking Refunded"}
                </h1>
              </div>
            </div>

            {/* Reference Badge with Copy */}
            <div className="flex items-center gap-2 bg-stone-100 px-3.5 py-2 rounded-sm border border-stone-200/80 self-start sm:self-auto">
              <span className="font-mono text-xs text-brown-600 uppercase">Ref:</span>
              <strong className="font-mono text-sm tracking-wider text-brown-950">
                {booking.reference}
              </strong>
              <button
                onClick={handleCopyRef}
                title="Copy reference"
                className="ml-1 text-brown-500 hover:text-amber transition-colors p-1"
                aria-label="Copy booking reference"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Intro Text */}
          <div className="pt-6">
            {isPaid && (
              <p className="font-sans text-sm sm:text-base text-brown-800 leading-relaxed">
                Thank you, <strong>{booking.customerName}</strong>. We have reserved your session for <strong>{booking.workshopName}</strong>. A confirmation email with receipt and calendar invite has been sent to <code className="bg-stone-100 px-1.5 py-0.5 rounded text-xs font-mono text-brown-900">{booking.customerEmail}</code>.
              </p>
            )}

            {isHeld && (
              <div className="space-y-3">
                <p className="font-sans text-sm text-brown-800 leading-relaxed">
                  This booking hold is awaiting payment. Holds remain reserved for 10 minutes from creation.
                </p>
                <div className="pt-2">
                  <Link
                    href={`/?book=open&workshop=${booking.workshopSlug}`}
                    className="inline-flex items-center h-11 px-5 rounded-button font-display text-xs font-bold uppercase tracking-button bg-amber text-brown-950 hover:bg-amber-400 transition-colors"
                  >
                    Resume Booking in Drawer
                  </Link>
                </div>
              </div>
            )}

            {isCancelled && (
              <p className="font-sans text-sm text-brown-800 leading-relaxed">
                This booking has been cancelled. {booking.cancellationReason && `Reason: ${booking.cancellationReason}.`} If you would like to book a new session or need help, please call or WhatsApp us.
              </p>
            )}

            {isRefunded && (
              <p className="font-sans text-sm text-brown-800 leading-relaxed">
                This booking has been refunded. The refund has been credited back to your original payment method.
              </p>
            )}
          </div>

          {/* Quick Action Buttons (Print + Add to Calendar) */}
          <div className="pt-6 flex flex-wrap items-center gap-3 print:hidden">
            <a
              href={`/api/booking/${booking.reference}/ics`}
              download={`jun-designs-${booking.reference}.ics`}
              className="inline-flex items-center gap-2 h-11 px-5 rounded-button font-display text-xs font-bold uppercase tracking-button bg-stone-100 text-brown-950 hover:bg-stone-200 border border-stone-200 transition-colors"
            >
              <CalendarIcon className="w-4 h-4 text-amber" />
              <span>Download .ICS Calendar</span>
            </a>

            <a
              href={buildGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 h-11 px-5 rounded-button font-display text-xs font-bold uppercase tracking-button bg-stone-100 text-brown-950 hover:bg-stone-200 border border-stone-200 transition-colors"
            >
              <span>Add to Google Calendar</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-brown-500" />
            </a>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 h-11 px-4 rounded-button font-display text-xs font-bold uppercase tracking-button bg-white text-brown-950 hover:bg-stone-100 border border-stone-200 transition-colors ml-auto"
            >
              <Printer className="w-4 h-4 text-brown-600" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Details & Logistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1 & 2: Session Specs */}
          <div className="md:col-span-2 bg-white rounded-card border border-stone-200/80 p-6 sm:p-8 space-y-6 shadow-sm">
            <h2 className="font-serif text-xl font-semibold text-brown-950 border-b border-stone-200 pb-3">
              Session Details
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CalendarIcon className="w-5 h-5 text-amber shrink-0 mt-0.5 stroke-[1.5]" />
                <div>
                  <span className="font-display text-xs font-bold uppercase tracking-button text-brown-600 block">
                    Date
                  </span>
                  <p className="font-sans text-sm font-semibold text-brown-950">
                    {dateFormatted}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber shrink-0 mt-0.5 stroke-[1.5]" />
                <div>
                  <span className="font-display text-xs font-bold uppercase tracking-button text-brown-600 block">
                    Time Slot
                  </span>
                  <p className="font-sans text-sm font-semibold text-brown-950">
                    {timeFormatted}
                  </p>
                  <span className="text-xs text-brown-600">
                    Please arrive 10 minutes prior to session start.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-amber shrink-0 mt-0.5 stroke-[1.5]" />
                <div>
                  <span className="font-display text-xs font-bold uppercase tracking-button text-brown-600 block">
                    Guests
                  </span>
                  <p className="font-sans text-sm font-semibold text-brown-950">
                    {booking.guests} {booking.guests === 1 ? "Guest" : "Guests"}
                  </p>
                </div>
              </div>

              {booking.note && (
                <div className="pt-2 border-t border-stone-100">
                  <span className="font-display text-xs font-bold uppercase tracking-button text-brown-600 block mb-1">
                    Your Special Requests
                  </span>
                  <p className="font-sans text-xs text-brown-800 bg-stone-50 p-3 rounded border border-stone-200/60">
                    &ldquo;{booking.note}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* What to Bring */}
            <div className="pt-4 border-t border-stone-200">
              <span className="font-display text-xs font-bold uppercase tracking-eyebrow text-amber block mb-2">
                — WHAT TO BRING
              </span>
              <p className="font-sans text-xs sm:text-sm text-brown-800 leading-relaxed">
                {whatToBring}
              </p>
            </div>
          </div>

          {/* Column 3: Payment Summary */}
          <div className="bg-white rounded-card border border-stone-200/80 p-6 space-y-5 shadow-sm self-start">
            <h3 className="font-serif text-lg font-semibold text-brown-950 border-b border-stone-200 pb-3">
              Payment Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-brown-700">
                <span>Workshop</span>
                <span className="text-right font-medium text-brown-950">{booking.workshopName}</span>
              </div>
              <div className="flex justify-between text-brown-700">
                <span>Rate</span>
                <span>
                  {booking.guests > 0
                    ? `${Math.round(booking.amountRwf / booking.guests).toLocaleString()} RWF / person`
                    : "Per person"}
                </span>
              </div>
              <div className="flex justify-between text-brown-700">
                <span>Guests</span>
                <span>&times; {booking.guests}</span>
              </div>
              <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                <span className="font-bold text-brown-950">Total Paid</span>
                <div className="text-right">
                  <span className="font-serif text-lg font-bold text-brown-950 block">
                    {booking.amountRwf.toLocaleString()} RWF
                  </span>
                  <span className="text-[11px] text-brown-600">
                    approx. ${booking.amountUsdEstimate} USD
                  </span>
                </div>
              </div>
            </div>

            {booking.paymentReference && (
              <div className="pt-3 border-t border-stone-100 text-[11px] text-brown-600 space-y-1">
                <div>
                  <span className="font-mono">Payment Ref: </span>
                  <span className="font-mono text-brown-900 font-medium">
                    {booking.paymentReference}
                  </span>
                </div>
                {booking.paymentProvider && (
                  <div>
                    <span>Method: </span>
                    <span className="capitalize text-brown-900 font-medium">
                      {booking.paymentProvider}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Location & Directions Card */}
        <div className="bg-white rounded-card border border-stone-200/80 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-amber shrink-0 mt-1 stroke-[1.5]" />
            <div className="space-y-2">
              <span className="font-display text-xs font-bold uppercase tracking-eyebrow text-amber block">
                — STUDIO LOCATION & DIRECTIONS
              </span>
              <h3 className="font-serif text-xl font-semibold text-brown-950">
                Kigali Culture Village on Rebero Hill
              </h3>
              <p className="font-sans text-sm text-brown-800 leading-relaxed">
                <strong>Address:</strong> Kigali Culture Village (Agaseke Center building), Rebero, Kicukiro. Street KK 557 St, Kigali.
              </p>
              <p className="font-sans text-xs text-brown-700 leading-relaxed">
                Directions note: Taxis and moto-taxis recognize &ldquo;Kigali Culture Village Rebero&rdquo; or CANAL Olympia nearby. Once inside the main compound gate, follow the signage to the Agaseke Center building overlooking the city.
              </p>
              <div className="pt-2">
                <a
                  href="https://maps.google.com/?q=Kigali+Culture+Village+Rebero+Rwanda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-button text-brown-950 hover:text-amber underline underline-offset-4"
                >
                  <span>Open in Google Maps</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Cancellation Policy Card */}
        <div className="bg-stone-100/80 rounded-card border border-stone-200 p-6 space-y-2">
          <span className="font-display text-[11px] font-bold uppercase tracking-eyebrow text-brown-600 block">
            — CANCELLATION & RESCHEDULING POLICY
          </span>
          <p className="font-sans text-xs sm:text-sm text-brown-800 leading-relaxed">
            {cancellationPolicy}
          </p>
        </div>

        {/* Direct Studio Contact Strip */}
        <div className="bg-white rounded-card border border-stone-200/80 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm print:hidden">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-serif text-base font-semibold text-brown-950">
              Need assistance or running late?
            </h4>
            <p className="font-sans text-xs text-brown-600">
              Our team is available every day from 8:00am to 7:00pm.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:+250780324944"
              className="inline-flex items-center gap-1.5 h-11 px-4 rounded-button font-display text-xs font-bold uppercase tracking-button bg-stone-100 text-brown-950 hover:bg-stone-200 border border-stone-200 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber" />
              <span>+250 780 324 944</span>
            </a>
            <a
              href="https://wa.me/250780324944"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 h-11 px-4 rounded-button font-display text-xs font-bold uppercase tracking-button bg-amber text-brown-950 hover:bg-amber-400 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
