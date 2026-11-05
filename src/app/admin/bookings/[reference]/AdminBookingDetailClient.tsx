"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Mail,
  Phone,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { Booking, TimeSlot } from "@/lib/booking/types";

interface AdminBookingDetailClientProps {
  initialBooking: Booking;
}

export const AdminBookingDetailClient: React.FC<AdminBookingDetailClientProps> = ({
  initialBooking,
}) => {
  const [booking, setBooking] = useState(initialBooking);
  const [rescheduleDate, setRescheduleDate] = useState(initialBooking.date);
  const [rescheduleSlot, setRescheduleSlot] = useState<TimeSlot>(initialBooking.slot);
  const [cancelReason, setCancelReason] = useState("");
  const [refundRemarks, setRefundRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  const handleRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !window.confirm(
        `Submit Pesapal refund request for ${booking.reference} (${booking.amountRwf.toLocaleString()} RWF)?`
      )
    ) {
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/admin/bookings/${booking.reference}/refund`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          remarks: refundRemarks || "Admin initiated refund via Pesapal",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Refund request failed");
      }

      setBooking(data.booking);
      setFeedback({
        type: "success",
        message: `Refund request submitted to Pesapal API 3.0. Final disbursement requires approval in your Pesapal Merchant Dashboard.`,
      });
    } catch (err: any) {
      setFeedback({ type: "error", message: err?.message || "Refund request failed." });
    } finally {
      setLoading(false);
    }
  };

  const handleReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/admin/bookings/${booking.reference}/reschedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newDate: rescheduleDate,
          newSlot: rescheduleSlot,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Reschedule failed");
      }

      setBooking(data.booking);
      setFeedback({
        type: "success",
        message: `Session successfully moved to ${data.booking.date} at ${data.booking.slot}.`,
      });
    } catch (err: any) {
      setFeedback({ type: "error", message: err?.message || "Reschedule failed." });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (
      !window.confirm(
        `Are you sure you want to cancel booking ${booking.reference} for ${booking.customerName}?`
      )
    ) {
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/admin/bookings/${booking.reference}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: cancelReason || "Cancelled by admin" }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Cancellation failed");
      }

      setBooking(data.booking);
      setFeedback({
        type: "success",
        message: `Booking ${booking.reference} has been cancelled.`,
      });
    } catch (err: any) {
      setFeedback({ type: "error", message: err?.message || "Cancellation failed." });
    } finally {
      setLoading(false);
    }
  };

  const cleanPhone = (booking.customerCountry + booking.customerPhone).replace(/\D/g, "");

  return (
    <main className="min-h-screen bg-stone-100 text-brown-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-button text-brown-700 hover:text-amber"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Upcoming Schedules</span>
          </Link>

          <Link
            href={`/booking/${booking.reference}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs font-display uppercase tracking-button font-bold text-brown-700 hover:text-amber"
          >
            <span>Customer Confirmation View</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Status Header */}
        <div className="bg-white rounded-card border border-stone-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-brown-500 uppercase">Booking:</span>
              <h1 className="font-mono text-2xl font-bold tracking-wider text-brown-950">
                {booking.reference}
              </h1>
            </div>
            <p className="font-sans text-xs text-brown-600">
              Created on {new Date(booking.createdAt).toLocaleString()} &bull; Last updated {new Date(booking.updatedAt).toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded text-xs font-mono font-bold uppercase ${
                booking.status === "paid"
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : booking.status === "held"
                  ? "bg-amber-100 text-amber-800 border border-amber-200"
                  : "bg-stone-100 text-stone-700 border border-stone-300"
              }`}
            >
              Status: {booking.status}
            </span>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {feedback && (
          <div
            className={`p-4 rounded border text-xs font-medium flex items-center gap-2.5 ${
              feedback.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Guest Profile Card */}
          <div className="bg-white rounded-card border border-stone-200 p-6 space-y-4 shadow-sm">
            <h2 className="font-serif text-lg font-bold text-brown-950 border-b border-stone-200 pb-2">
              Guest Information
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-display font-bold uppercase tracking-wider text-brown-500 block mb-0.5">
                  Full Name
                </span>
                <p className="font-sans text-sm font-semibold text-brown-950">
                  {booking.customerName}
                </p>
              </div>

              <div>
                <span className="font-display font-bold uppercase tracking-wider text-brown-500 block mb-0.5">
                  Email Address
                </span>
                <a
                  href={`mailto:${booking.customerEmail}`}
                  className="font-sans text-xs text-brown-900 hover:text-amber underline"
                >
                  {booking.customerEmail}
                </a>
              </div>

              <div>
                <span className="font-display font-bold uppercase tracking-wider text-brown-500 block mb-0.5">
                  Phone / WhatsApp
                </span>
                <div className="flex items-center gap-3 pt-0.5">
                  <span className="font-sans text-xs text-brown-900 font-medium">
                    {booking.customerCountry} {booking.customerPhone}
                  </span>
                  <a
                    href={`https://wa.me/${cleanPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-display uppercase font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200 hover:bg-green-100"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              {booking.note && (
                <div className="pt-2 border-t border-stone-100">
                  <span className="font-display font-bold uppercase tracking-wider text-brown-500 block mb-1">
                    Special Requests & Notes
                  </span>
                  <p className="font-sans text-xs text-brown-800 bg-stone-50 p-2.5 rounded border border-stone-200">
                    &ldquo;{booking.note}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Session & Payment Specs */}
          <div className="bg-white rounded-card border border-stone-200 p-6 space-y-4 shadow-sm">
            <h2 className="font-serif text-lg font-bold text-brown-950 border-b border-stone-200 pb-2">
              Workshop & Payment
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-display font-bold uppercase tracking-wider text-brown-500 block mb-0.5">
                  Workshop
                </span>
                <p className="font-sans text-sm font-semibold text-brown-950">
                  {booking.workshopName}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-display font-bold uppercase tracking-wider text-brown-500 block mb-0.5">
                    Date
                  </span>
                  <p className="font-sans text-xs font-medium text-brown-900">
                    {booking.date}
                  </p>
                </div>
                <div>
                  <span className="font-display font-bold uppercase tracking-wider text-brown-500 block mb-0.5">
                    Slot
                  </span>
                  <p className="font-sans text-xs font-medium text-brown-900">
                    {booking.slot === "10:00" ? "10:00am (Morning)" : "4:00pm (Afternoon)"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-display font-bold uppercase tracking-wider text-brown-500 block mb-0.5">
                    Total Guests
                  </span>
                  <p className="font-sans text-xs font-bold text-brown-950">
                    {booking.guests} {booking.guests === 1 ? "Person" : "People"}
                  </p>
                </div>
                <div>
                  <span className="font-display font-bold uppercase tracking-wider text-brown-500 block mb-0.5">
                    Amount Paid
                  </span>
                  <p className="font-mono text-xs font-bold text-brown-950">
                    {booking.amountRwf.toLocaleString()} RWF
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 font-mono text-[11px] text-brown-600 space-y-1">
                <div>Payment Ref: {booking.paymentReference || "N/A"}</div>
                {booking.pesapalConfirmationCode && (
                  <div>Pesapal Conf: {booking.pesapalConfirmationCode}</div>
                )}
                {booking.pesapalOrderTrackingId && (
                  <div className="truncate">Tracking ID: {booking.pesapalOrderTrackingId}</div>
                )}
                <div>Provider: {booking.pesapalPaymentMethod || booking.paymentProvider || "Pesapal"}</div>
                {booking.refundStatus && booking.refundStatus !== "none" && (
                  <div className="text-amber-800 font-bold">Refund: {booking.refundStatus.toUpperCase()}</div>
                )}
              </div>
            </div>
          </div>

          {/* Email Notification History */}
          <div className="md:col-span-2 bg-white rounded-card border border-stone-200 p-6 space-y-3 shadow-sm">
            <h2 className="font-serif text-lg font-bold text-brown-950 border-b border-stone-200 pb-2">
              Automated Notification Audit
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded border border-stone-200 bg-stone-50">
                <span className="font-display font-bold uppercase text-brown-600 block mb-1">
                  1. Guest Confirmation
                </span>
                {booking.confirmationEmailSentAt ? (
                  <span className="text-green-700 font-medium">
                    &bull; Sent ({new Date(booking.confirmationEmailSentAt).toLocaleTimeString()})
                  </span>
                ) : (
                  <span className="text-stone-500 italic">Not sent yet</span>
                )}
              </div>

              <div className="p-3 rounded border border-stone-200 bg-stone-50">
                <span className="font-display font-bold uppercase text-brown-600 block mb-1">
                  2. Studio Alert
                </span>
                {booking.studioEmailSentAt ? (
                  <span className="text-green-700 font-medium">
                    &bull; Sent ({new Date(booking.studioEmailSentAt).toLocaleTimeString()})
                  </span>
                ) : (
                  <span className="text-stone-500 italic">Not sent yet</span>
                )}
              </div>

              <div className="p-3 rounded border border-stone-200 bg-stone-50">
                <span className="font-display font-bold uppercase text-brown-600 block mb-1">
                  3. 24-Hour Reminder
                </span>
                {booking.reminderEmailSentAt ? (
                  <span className="text-green-700 font-medium">
                    &bull; Sent ({new Date(booking.reminderEmailSentAt).toLocaleTimeString()})
                  </span>
                ) : (
                  <span className="text-amber-700 font-medium">
                    &bull; Scheduled (Auto 24h cron)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action 1: Reschedule Booking */}
          <div className="bg-white rounded-card border border-stone-200 p-6 space-y-4 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-brown-950 border-b border-stone-200 pb-2">
              Reschedule Session
            </h3>
            <p className="font-sans text-xs text-brown-600">
              Move this guest to another date and time slot. Capacity will be verified before confirming.
            </p>

            <form onSubmit={handleReschedule} className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-display uppercase tracking-wider font-bold text-brown-700 mb-1">
                  New Date
                </label>
                <input
                  type="date"
                  required
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full h-11 px-3 border border-stone-300 rounded text-xs font-sans focus:outline-none focus:border-amber"
                />
              </div>

              <div>
                <label className="block text-xs font-display uppercase tracking-wider font-bold text-brown-700 mb-1">
                  New Time Slot
                </label>
                <select
                  value={rescheduleSlot}
                  onChange={(e) => setRescheduleSlot(e.target.value as TimeSlot)}
                  className="w-full h-11 px-3 border border-stone-300 rounded text-xs font-sans focus:outline-none focus:border-amber bg-white"
                >
                  <option value="10:00">Morning 10:00am</option>
                  <option value="16:00">Afternoon 4:00pm</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading || booking.status === "cancelled"}
                className="w-full h-11 rounded bg-brown-950 text-white font-display text-xs font-bold uppercase tracking-button hover:bg-brown-800 transition-colors disabled:opacity-50"
              >
                {loading ? "Updating..." : "Confirm Reschedule"}
              </button>
            </form>
          </div>

          {/* Action 2: Cancel Booking */}
          <div className="bg-white rounded-card border border-stone-200 p-6 space-y-4 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-brown-950 border-b border-stone-200 pb-2">
              Cancel Booking
            </h3>
            <p className="font-sans text-xs text-brown-600">
              Cancel this booking and immediately release the held capacity back to public availability.
            </p>

            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-display uppercase tracking-wider font-bold text-brown-700 mb-1">
                  Cancellation Reason (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Guest flight delayed, medical emergency..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full h-11 px-3 border border-stone-300 rounded text-xs font-sans focus:outline-none focus:border-amber"
                />
              </div>

              <button
                type="button"
                onClick={handleCancel}
                disabled={loading || booking.status === "cancelled"}
                className="w-full h-11 rounded bg-red-700 text-white font-display text-xs font-bold uppercase tracking-button hover:bg-red-800 transition-colors disabled:opacity-50"
              >
                {booking.status === "cancelled" ? "Booking Already Cancelled" : "Cancel This Booking"}
              </button>
            </div>
          </div>

          {/* Action 3: Pesapal API 3.0 Refund */}
          {booking.status === "paid" && (
            <div className="md:col-span-2 bg-white rounded-card border border-amber-300 p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <h3 className="font-serif text-lg font-bold text-brown-950">
                  Pesapal API 3.0 Refund Request
                </h3>
                {booking.refundStatus === "requested" ? (
                  <span className="text-xs bg-amber-100 text-amber-900 px-2.5 py-1 rounded font-bold uppercase">
                    Refund Pending Dashboard Approval
                  </span>
                ) : booking.refundStatus === "refunded" ? (
                  <span className="text-xs bg-stone-200 text-stone-800 px-2.5 py-1 rounded font-bold uppercase">
                    Refund Completed
                  </span>
                ) : null}
              </div>

              <p className="font-sans text-xs text-brown-600 leading-relaxed">
                Initiate a formal refund request to Pesapal for{" "}
                <strong className="text-brown-950 font-bold">
                  {booking.amountRwf.toLocaleString()} RWF
                </strong>
                . Per Pesapal security compliance, the API records the request, and the merchant must approve the final disbursement inside the Pesapal Merchant Portal.
              </p>

              {booking.refundStatus === "requested" ? (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 space-y-1">
                  <div className="font-bold">Refund request submitted:</div>
                  <div>Remarks: &ldquo;{booking.refundRemarks || "Admin refund"}&rdquo;</div>
                  <div className="text-[11px] text-amber-800">
                    Log in to your Pesapal Merchant Dashboard under &ldquo;Transactions &rarr; Refund Requests&rdquo; to complete disbursement.
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRefund} className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-display uppercase tracking-wider font-bold text-brown-700 mb-1">
                      Reason for Refund (Passed to Pesapal &amp; Guest Audit)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Guest requested cancellation 48+ hours in advance."
                      value={refundRemarks}
                      onChange={(e) => setRefundRemarks(e.target.value)}
                      className="w-full h-11 px-3 border border-stone-300 rounded text-xs font-sans focus:outline-none focus:border-amber"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="h-11 px-5 rounded bg-amber-600 text-white font-display text-xs font-bold uppercase tracking-button hover:bg-amber-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Submitting Request..." : `Request Refund of ${booking.amountRwf.toLocaleString()} RWF`}
                  </button>
                </form>
              )}
            </div>
          )}

        </div>

      </div>
    </main>
  );
};
