"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Copy,
  Check,
  Calendar,
  Clock,
  MapPin,
  Users,
  Compass,
  ArrowUpRight,
  Download,
  Printer,
  Phone,
} from "lucide-react";
import { Booking } from "@/lib/booking/types";
import { workshops } from "@/content/workshops";
import { formatRwf } from "@/lib/utils";
import { siteConfig } from "@/content/site";
import { Button } from "@/components/atoms/Button";

export interface Step4Props {
  booking: Booking;
  onClose: () => void;
}

export const Step4Confirmation: React.FC<Step4Props> = ({ booking, onClose }) => {
  const [copied, setCopied] = useState(false);

  const workshop =
    workshops.find((w) => w.slug === booking.workshopSlug) || workshops[0];

  const handleCopyRef = () => {
    navigator.clipboard.writeText(booking.reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Google Calendar URL construction (Kigali time CAT is UTC+2)
  const slotHour = booking.slot === "10:00" ? 10 : 16;
  const startHourStr = String(slotHour).padStart(2, "0");
  const endHourStr = String(slotHour + 2).padStart(2, "0");

  const [y, m, d] = booking.date.split("-");
  const startDateTime = `${y}${m}${d}T${startHourStr}0000Z`;
  const endDateTime = `${y}${m}${d}T${endHourStr}0000Z`;

  const gCalTitle = encodeURIComponent(`Jun Designs: ${booking.workshopName}`);
  const gCalDetails = encodeURIComponent(
    `Booking Ref: ${booking.reference}\nGuests: ${booking.guests}\nLocation: ${siteConfig.address.full}\nWhat to bring: ${workshop.whatToBring}`
  );
  const gCalLocation = encodeURIComponent(siteConfig.address.full);
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${gCalTitle}&dates=${startDateTime}/${endDateTime}&details=${gCalDetails}&location=${gCalLocation}`;

  // ICS file download generator
  const handleDownloadIcs = () => {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Jun Designs//Cultural Workshop//EN",
      "BEGIN:VEVENT",
      `UID:${booking.reference}@jundesigns.rw`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
      `DTSTART:${startDateTime}`,
      `DTEND:${endDateTime}`,
      `SUMMARY:Jun Designs: ${booking.workshopName}`,
      `DESCRIPTION:Booking Ref: ${booking.reference}\\nGuests: ${booking.guests}\\nWhat to bring: ${workshop.whatToBring}`,
      `LOCATION:${siteConfig.address.full}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `jun-designs-${booking.reference}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formattedDate = new Date(booking.date + "T10:00:00").toLocaleDateString(
    "en-GB",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <div className="space-y-6 text-left animate-reveal print:p-0">
      {/* 1. Success Hero Banner */}
      <div className="p-6 rounded-card bg-brown-950/90 border border-amber-400/40 text-center space-y-3 shadow-warm-low">
        <div className="w-12 h-12 rounded-full bg-amber/20 border border-amber text-amber flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6 stroke-[2]" />
        </div>

        <div>
          <span className="font-display text-[11px] font-bold uppercase tracking-eyebrow text-amber block">
            Booking Confirmed & Paid
          </span>
          <h3 className="font-serif font-bold text-2xl text-sand-bright">
            We Look Forward to Welcoming You
          </h3>
        </div>

        {/* Reference Box */}
        <div className="inline-flex items-center gap-2 bg-brown-900 border border-amber-400/30 px-3 py-1.5 rounded-sm">
          <span className="text-xs text-sand-muted">Reference:</span>
          <span className="font-mono font-bold text-sm text-sand-bright">
            {booking.reference}
          </span>
          <button
            type="button"
            onClick={handleCopyRef}
            className="p-1 text-amber hover:text-amber-300 transition-colors"
            aria-label="Copy booking reference"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-amber" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        <p className="text-xs text-sand-primary max-w-sm mx-auto">
          A receipt and booking summary have been dispatched to{" "}
          <strong className="text-sand-bright">{booking.customerEmail}</strong>.
        </p>
      </div>

      {/* 2. Full Reservation Details */}
      <div className="p-5 rounded-card bg-brown-950/70 border border-amber-400/20 space-y-4">
        <h4 className="font-display text-xs font-bold uppercase tracking-eyebrow text-amber border-b border-amber-400/15 pb-2">
          Session Details
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-sand-primary">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-amber shrink-0" />
            <div>
              <span className="text-[10px] text-sand-muted block uppercase">Date</span>
              <span className="text-sand-bright font-medium">{formattedDate}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-amber shrink-0" />
            <div>
              <span className="text-[10px] text-sand-muted block uppercase">Time Slot</span>
              <span className="text-sand-bright font-medium">
                {booking.slot === "10:00" ? "10:00am (Morning)" : "4:00pm (Afternoon)"} &middot; 2 Hours
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Users className="w-4 h-4 text-amber shrink-0" />
            <div>
              <span className="text-[10px] text-sand-muted block uppercase">Guests</span>
              <span className="text-sand-bright font-medium">
                {booking.guests} Person{booking.guests > 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded-full bg-amber/20 flex items-center justify-center text-[10px] font-bold text-amber">
              RF
            </div>
            <div>
              <span className="text-[10px] text-sand-muted block uppercase">Total Paid</span>
              <span className="text-amber font-bold">{formatRwf(booking.amountRwf)}</span>
            </div>
          </div>
        </div>

        {/* Location & Map Link */}
        <div className="pt-3 border-t border-amber-400/15 space-y-1.5">
          <span className="font-display text-[10px] font-bold uppercase tracking-eyebrow text-sand-muted block">
            Studio Location & Directions
          </span>
          <p className="text-xs text-sand-bright leading-relaxed">
            {siteConfig.address.full}
          </p>
          <a
            href="https://maps.google.com/?q=Kigali+Culture+Village+Rebero+Kicukiro"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-amber font-semibold hover:text-amber-300 underline"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Open in Google Maps</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* What to Bring */}
        <div className="pt-3 border-t border-amber-400/15 space-y-1">
          <span className="font-display text-[10px] font-bold uppercase tracking-eyebrow text-sand-muted block">
            What to Bring
          </span>
          <p className="text-xs text-sand-primary leading-relaxed">
            {workshop.whatToBring}
          </p>
        </div>
      </div>

      {/* 3. Add to Calendar Buttons */}
      <div className="space-y-2">
        <span className="font-display text-[10px] font-bold uppercase tracking-eyebrow text-amber block">
          Add to Your Calendar
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-card bg-brown-950 border border-amber-400/25 hover:border-amber text-xs font-semibold text-sand-bright flex items-center justify-center gap-2 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-amber" />
            <span>Google Calendar</span>
            <ArrowUpRight className="w-3 h-3 text-sand-muted" />
          </a>

          <button
            type="button"
            onClick={handleDownloadIcs}
            className="p-3 rounded-card bg-brown-950 border border-amber-400/25 hover:border-amber text-xs font-semibold text-sand-bright flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-amber" />
            <span>Download .ICS File</span>
          </button>
        </div>
      </div>

      {/* 4. Contact & Print */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-amber-400/15">
        <div className="flex items-center gap-2 text-xs text-sand-muted">
          <Phone className="w-3.5 h-3.5 text-amber" />
          <span>Need help? WhatsApp: {siteConfig.phone}</span>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 text-xs text-sand-primary hover:text-amber transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Receipt</span>
        </button>
      </div>

      {/* Action CTA */}
      <div className="pt-2 space-y-2">
        <a
          href={`/booking/${booking.reference}`}
          className="inline-flex items-center justify-center w-full h-11 rounded-button bg-stone-100 border border-stone-300 font-display text-xs font-bold uppercase tracking-button text-brown-950 hover:bg-stone-200 transition-colors"
        >
          <span>Open Full Confirmation Page</span>
          <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" />
        </a>

        <Button onClick={onClose} size="lg" className="w-full justify-center">
          Done
        </Button>
      </div>
    </div>
  );
};
