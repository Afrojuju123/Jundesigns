import React from "react";
import { Metadata } from "next";
import {
  renderGuestConfirmationEmail,
  renderStudioBookingAlertEmail,
  renderReminderEmail,
} from "@/lib/booking/email";
import { Booking } from "@/lib/booking/types";
import { EmailPreviewClient } from "./EmailPreviewClient";

export const metadata: Metadata = {
  title: "Transactional Email Previews | Jun Designs",
  robots: { index: false, follow: false },
};

const sampleBooking: Booking = {
  id: "bk-preview-1",
  reference: "JUN-2026-M8K2",
  workshopSlug: "imigongo-painting",
  workshopName: "Imigongo Painting",
  date: "2026-11-12",
  slot: "10:00",
  guests: 2,
  amountRwf: 50000,
  amountUsdEstimate: 37.04,
  currency: "RWF",
  status: "paid",
  customerName: "Elena Rostova",
  customerEmail: "elena.r@example.com",
  customerPhone: "788 123 456",
  customerCountry: "+250",
  note: "Two adults. First time in Kigali, very excited for traditional art!",
  holdExpiresAt: "2026-11-12T10:10:00.000Z",
  paymentReference: "PAY-RW-982141",
  paymentProvider: "card",
  createdAt: "2026-11-04T12:00:00.000Z",
  updatedAt: "2026-11-04T12:05:00.000Z",
};

export default function EmailPreviewPage() {
  const guestEmail = renderGuestConfirmationEmail(sampleBooking);
  const studioEmail = renderStudioBookingAlertEmail(sampleBooking);
  const reminderEmail = renderReminderEmail(sampleBooking);

  return (
    <EmailPreviewClient
      guestEmail={guestEmail}
      studioEmail={studioEmail}
      reminderEmail={reminderEmail}
    />
  );
}
