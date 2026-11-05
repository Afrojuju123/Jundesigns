"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Timer,
  AlertTriangle,
  ExternalLink,
  Loader2,
  RefreshCw,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { Booking } from "@/lib/booking/types";
import { formatRwf } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

export interface Step3Props {
  booking: Booking;
  onPaymentSuccess: (confirmedBooking: Booking) => void;
  onHoldExpired: () => void;
  onBack: () => void;
}

export const Step3Payment: React.FC<Step3Props> = ({
  booking,
  onPaymentSuccess,
  onHoldExpired,
  onBack,
}) => {
  const [iframeLoading, setIframeLoading] = useState(true);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // 10-Minute Hold Countdown Timer
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(() => {
    const expires = new Date(booking.holdExpiresAt).getTime();
    const now = Date.now();
    return Math.max(0, Math.floor((expires - now) / 1000));
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const expires = new Date(booking.holdExpiresAt).getTime();
      const diff = Math.max(0, Math.floor((expires - Date.now()) / 1000));
      setTimeLeftSeconds(diff);

      if (diff <= 0) {
        clearInterval(interval);
        setIsExpired(true);
        onHoldExpired();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [booking.holdExpiresAt, onHoldExpired]);

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // Poll status endpoint every 3 seconds to catch payment completion automatically
  useEffect(() => {
    if (isExpired) return;

    let isMounted = true;
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/booking/${booking.reference}/status`);
        if (!res.ok) return;
        const data = await res.json();

        if (!isMounted) return;

        if (data.status === "paid" && data.booking) {
          clearInterval(pollInterval);
          onPaymentSuccess(data.booking);
        } else if (data.status === "expired") {
          clearInterval(pollInterval);
          setIsExpired(true);
          onHoldExpired();
        } else if (data.status === "failed") {
          setPaymentError(data.error || "Payment was declined or cancelled. Please try again.");
        }
      } catch {
        // Polling errors are non-fatal; will retry next interval
      }
    }, 3000);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [booking.reference, isExpired, onPaymentSuccess, onHoldExpired]);

  // Manual Check Payment Status button
  const handleManualCheck = async () => {
    setIsVerifying(true);
    setPaymentError(null);
    try {
      const res = await fetch(`/api/booking/${booking.reference}/status`);
      const data = await res.json();
      if (data.status === "paid" && data.booking) {
        onPaymentSuccess(data.booking);
      } else if (data.status === "failed") {
        setPaymentError(data.error || "Payment was declined or cancelled. Please try again.");
      } else {
        setPaymentError("Payment has not been confirmed yet. If you completed payment, please wait a moment.");
      }
    } catch {
      setPaymentError("Could not reach verification service. Please retry in a few seconds.");
    } finally {
      setIsVerifying(false);
    }
  };

  const redirectUrl = booking.redirectUrl;

  return (
    <div className="space-y-5 text-left animate-reveal">
      {/* 1. Header Information */}
      <div>
        <h2 className="font-display font-bold text-lg text-sand-bright">
          Pay for your booking
        </h2>
        <p className="text-xs text-sand-muted mt-1 leading-relaxed">
          You will pay on Pesapal&apos;s secure portal using credit card, debit card, or mobile money (MTN / Airtel).
        </p>
      </div>

      {/* 2. Persistent 10-Minute Hold Banner */}
      <div
        className={cn(
          "p-3.5 rounded-card border flex items-center justify-between gap-3 transition-colors",
          timeLeftSeconds < 120
            ? "bg-terracotta/20 border-terracotta text-sand-bright"
            : "bg-amber-400/10 border-amber-400/30 text-sand-bright"
        )}
      >
        <div className="flex items-center gap-2.5">
          <Timer
            className={cn(
              "w-4 h-4 shrink-0",
              timeLeftSeconds < 120 ? "text-terracotta animate-pulse" : "text-amber"
            )}
          />
          <div>
            <span className="font-display text-[11px] font-bold uppercase tracking-wider block">
              10-Minute Place Hold Active
            </span>
            <span className="text-[11px] text-sand-muted">
              {booking.guests} place{booking.guests > 1 ? "s" : ""} reserved for you
            </span>
          </div>
        </div>

        <div className="text-right">
          <span
            className={cn(
              "font-mono font-bold text-base",
              timeLeftSeconds < 120 ? "text-terracotta" : "text-amber"
            )}
          >
            {formattedTime}
          </span>
        </div>
      </div>

      {/* 3. Order Summary Strip */}
      <div className="p-3.5 rounded-card bg-brown-950/70 border border-amber-400/15 space-y-1.5 text-xs">
        <div className="flex justify-between text-sand-muted">
          <span>Booking Reference:</span>
          <span className="font-mono text-sand-bright font-bold">{booking.reference}</span>
        </div>
        <div className="flex justify-between text-sand-muted">
          <span>Workshop:</span>
          <span className="text-sand-bright font-medium">{booking.workshopName}</span>
        </div>
        <div className="flex justify-between text-sand-muted">
          <span>Session:</span>
          <span className="text-sand-bright">
            {booking.date} at {booking.slot === "10:00" ? "10:00am" : "4:00pm"} ({booking.guests} guest{booking.guests > 1 ? "s" : ""})
          </span>
        </div>
        <div className="pt-2 border-t border-amber-400/15 flex justify-between items-baseline">
          <span className="font-display font-bold text-[11px] uppercase tracking-eyebrow text-sand-muted">
            Total Charge
          </span>
          <div className="text-right">
            <span className="font-display font-bold text-lg text-amber block">
              {formatRwf(booking.amountRwf)}
            </span>
            <span className="text-[10px] text-sand-muted">
              ~${booking.amountUsdEstimate} USD estimate
            </span>
          </div>
        </div>
      </div>

      {/* 4. Payment Error Banner */}
      {paymentError && (
        <div className="p-3.5 rounded-sm bg-terracotta/20 border border-terracotta text-sand-bright text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-terracotta block">Payment Notice:</span>
            <span>{paymentError}</span>
          </div>
        </div>
      )}

      {/* 5. Expired State */}
      {isExpired ? (
        <div className="p-6 rounded-card bg-brown-950/90 border border-terracotta text-center space-y-4">
          <AlertTriangle className="w-8 h-8 text-terracotta mx-auto" />
          <h3 className="font-display font-bold text-base text-sand-bright">
            Your 10-minute hold has expired
          </h3>
          <p className="text-xs text-sand-primary max-w-sm mx-auto leading-relaxed">
            To prevent overbooking, reserved places are released if payment is not completed within 10 minutes.
          </p>
          <Button
            type="button"
            onClick={onBack}
            size="default"
            className="justify-center mx-auto"
          >
            Select session again
          </Button>
        </div>
      ) : redirectUrl ? (
        /* 6. Pesapal Iframe Checkout */
        <div className="space-y-3">
          <div className="relative rounded-card border border-amber-400/20 bg-brown-950 overflow-hidden min-h-[540px]">
            {iframeLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-brown-950/90 z-10 gap-3">
                <Loader2 className="w-6 h-6 text-amber animate-spin" />
                <span className="text-xs text-sand-muted">Loading payment portal...</span>
              </div>
            )}
            <iframe
              src={redirectUrl}
              title="Pesapal Checkout"
              className="w-full h-[540px] border-0"
              onLoad={() => setIframeLoading(false)}
              allow="payment"
            />
          </div>

          {/* Fallback button & link */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-1 text-xs">
            <a
              href={redirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-amber hover:underline text-[11px]"
            >
              <span>Having trouble with the embedded frame? Open in a new tab</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              type="button"
              onClick={handleManualCheck}
              disabled={isVerifying}
              className="inline-flex items-center gap-1.5 text-sand-muted hover:text-sand-bright transition-colors text-[11px]"
            >
              <RefreshCw className={cn("w-3 h-3", isVerifying && "animate-spin")} />
              <span>{isVerifying ? "Verifying..." : "I've completed payment"}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Fallback if no redirectUrl */
        <div className="p-6 rounded-card bg-brown-950/80 border border-amber-400/20 text-center space-y-4">
          <Loader2 className="w-6 h-6 text-amber animate-spin mx-auto" />
          <p className="text-xs text-sand-primary">Initializing payment session with Pesapal...</p>
        </div>
      )}

      {/* 7. Footer Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-amber-400/15">
        <Button
          type="button"
          variant="secondary"
          onClick={onBack}
          size="default"
          className="justify-center"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          Back
        </Button>

        <span className="text-[11px] text-sand-muted">
          All charges processed in Rwandan Francs (RWF)
        </span>
      </div>
    </div>
  );
};
