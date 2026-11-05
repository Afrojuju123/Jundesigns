"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { workshops } from "@/content/workshops";
import { TimeSlot } from "@/lib/booking/types";
import { COUNTRY_CODES, calculateEstimates } from "@/lib/booking/config";
import { formatRwf } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/atoms/FormField";

export interface Step2Props {
  workshopSlug: string;
  selectedDate: string;
  selectedSlot: TimeSlot;
  guestCount: number;
  customerName: string;
  onChangeName: (name: string) => void;
  customerEmail: string;
  onChangeEmail: (email: string) => void;
  customerPhone: string;
  onChangePhone: (phone: string) => void;
  customerCountry: string;
  onChangeCountry: (country: string) => void;
  customerNote: string;
  onChangeNote: (note: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  isHolding: boolean;
  holdError?: string;
}

export const Step2Review: React.FC<Step2Props> = ({
  workshopSlug,
  selectedDate,
  selectedSlot,
  guestCount,
  customerName,
  onChangeName,
  customerEmail,
  onChangeEmail,
  customerPhone,
  onChangePhone,
  customerCountry,
  onChangeCountry,
  customerNote,
  onChangeNote,
  onBack,
  onSubmit,
  isHolding,
  holdError,
}) => {
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    policy: false,
  });

  const workshop = workshops.find((w) => w.slug === workshopSlug) || workshops[0];
  const totalPriceRwf = workshop.priceRwf * guestCount;
  const { usd, eur } = calculateEstimates(totalPriceRwf);

  // Field validation
  const nameError =
    touched.name && !customerName.trim()
      ? "Please enter your full name."
      : undefined;

  const emailError =
    touched.email &&
    (!customerEmail.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail))
      ? "Please enter a valid email address."
      : undefined;

  const phoneError =
    touched.phone && !customerPhone.trim()
      ? "Please enter your WhatsApp or phone number."
      : undefined;

  const policyError =
    touched.policy && !agreedToPolicy
      ? "You must agree to the cancellation and booking policy."
      : undefined;

  const isFormValid =
    customerName.trim().length > 1 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail) &&
    customerPhone.trim().length > 4 &&
    agreedToPolicy;

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true, policy: true });
    if (isFormValid) {
      onSubmit();
    }
  };

  const formattedDate = new Date(selectedDate + "T10:00:00").toLocaleDateString(
    "en-GB",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <form onSubmit={handleContinue} className="space-y-6 text-left animate-reveal">
      {/* 1. Booking Summary Box */}
      <div className="p-4 sm:p-5 rounded-card bg-brown-950/80 border border-amber-400/25 space-y-4 shadow-warm-low">
        <div className="flex items-start justify-between border-b border-amber-400/15 pb-3">
          <div>
            <span className="font-display text-[10px] font-bold uppercase tracking-eyebrow text-amber block">
              Reservation Summary
            </span>
            <h3 className="font-serif font-bold text-lg text-sand-bright">
              {workshop.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="font-display font-semibold text-xs uppercase tracking-button text-amber hover:text-amber-300 underline"
          >
            Change
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-sand-primary">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-amber shrink-0" />
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-amber shrink-0" />
            <span>
              {selectedSlot === "10:00" ? "10:00am (Morning)" : "4:00pm (Afternoon)"} &middot; 2 hours
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-amber shrink-0" />
            <span>
              {guestCount} guest{guestCount > 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-amber shrink-0" />
            <span className="truncate">Kigali Culture Village, Rebero</span>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="pt-3 border-t border-amber-400/15 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
          <div>
            <span className="text-xs text-sand-muted block">
              {formatRwf(workshop.priceRwf)} &times; {guestCount} guest{guestCount > 1 ? "s" : ""}
            </span>
            <span className="text-[11px] text-sand-muted">
              Estimated ~${usd} USD / ~&euro;{eur} EUR (charged in RWF)
            </span>
          </div>
          <div className="text-left sm:text-right">
            <span className="font-display font-bold text-xl text-amber">
              {formatRwf(totalPriceRwf)}
            </span>
          </div>
        </div>
      </div>

      {/* Server Capacity Error Notice */}
      {holdError && (
        <div className="p-3.5 rounded-sm bg-terracotta/15 border border-terracotta text-sand-bright text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-terracotta">Hold reservation issue:</span>
            <span>{holdError}</span>
          </div>
        </div>
      )}

      {/* 2. Customer Form Fields */}
      <div className="space-y-4">
        <h4 className="font-display text-xs font-bold uppercase tracking-eyebrow text-amber">
          Guest Information
        </h4>

        <FormField
          id="guest-name"
          label="Full Name"
          type="text"
          value={customerName}
          onChange={(e) => {
            onChangeName(e.target.value);
            if (!touched.name) setTouched({ ...touched, name: true });
          }}
          placeholder="e.g. Marie Uwase or Sarah Jenkins"
          errorMessage={nameError}
          required
        />

        <FormField
          id="guest-email"
          label="Email Address (Confirmation & Calendar sent here)"
          type="email"
          value={customerEmail}
          onChange={(e) => {
            onChangeEmail(e.target.value);
            if (!touched.email) setTouched({ ...touched, email: true });
          }}
          placeholder="e.g. sarah@example.com"
          errorMessage={emailError}
          required
        />

        {/* Phone with Country Code */}
        <div className="space-y-1.5">
          <label
            htmlFor="phone-number"
            className="block font-display text-xs font-semibold uppercase tracking-wider text-sand-bright"
          >
            WhatsApp / Mobile Phone <span className="text-terracotta">*</span>
          </label>
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-5 sm:col-span-4">
              <select
                id="country-picker"
                value={customerCountry}
                onChange={(e) => onChangeCountry(e.target.value)}
                className="w-full h-11 bg-brown-950 border border-amber-400/30 rounded-card px-2.5 text-xs text-sand-bright focus:outline-none focus:ring-2 focus:ring-amber"
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code} className="bg-brown-950 text-sand-bright">
                    {c.flag} {c.code}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-7 sm:col-span-8">
              <input
                id="phone-number"
                type="tel"
                value={customerPhone}
                onChange={(e) => {
                  onChangePhone(e.target.value);
                  if (!touched.phone) setTouched({ ...touched, phone: true });
                }}
                placeholder="780 123 456"
                className="w-full h-11 bg-brown-950 border border-amber-400/30 rounded-card px-3 text-sm text-sand-bright focus:outline-none focus:ring-2 focus:ring-amber"
                required
              />
            </div>
          </div>
          {phoneError && (
            <p className="text-xs text-terracotta font-medium mt-1">{phoneError}</p>
          )}
        </div>

        {/* Optional Note */}
        <div className="space-y-1.5">
          <label
            htmlFor="guest-note"
            className="block font-display text-xs font-semibold uppercase tracking-wider text-sand-bright"
          >
            Special Requests & Notes (Optional)
          </label>
          <textarea
            id="guest-note"
            rows={2}
            value={customerNote}
            onChange={(e) => onChangeNote(e.target.value)}
            placeholder="Mobility considerations, dietary allergies, languages, or travelling with children..."
            className="w-full bg-brown-950 border border-amber-400/30 rounded-card p-3 text-xs sm:text-sm text-sand-bright focus:outline-none focus:ring-2 focus:ring-amber resize-none"
          />
        </div>
      </div>

      {/* 3. Cancellation & Weather Policy */}
      <div className="p-4 rounded-card bg-brown-950/60 border border-amber-400/20 space-y-3">
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-amber shrink-0 mt-0.5" />
          <p className="text-xs text-sand-primary leading-relaxed">
            <strong className="text-sand-bright">Booking Policy:</strong> Free cancellation or
            rescheduling up to 24 hours before your session. Within 24 hours, you can
            reschedule once, subject to availability, but we cannot refund. If weather
            stops a session from going ahead, we will offer you another time or a full
            refund.
          </p>
        </div>

        <div className="pt-2 border-t border-amber-400/15">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToPolicy}
              onChange={(e) => {
                setAgreedToPolicy(e.target.checked);
                if (!touched.policy) setTouched({ ...touched, policy: true });
              }}
              className="mt-1 w-4 h-4 rounded border-amber-400/40 bg-brown-900 text-amber focus:ring-amber"
            />
            <span className="text-xs text-sand-primary">
              I agree to the booking and cancellation policy and{" "}
              <Link
                href="/terms-conditions"
                target="_blank"
                className="text-amber underline hover:text-amber-300"
              >
                Terms & Conditions
              </Link>
              .
            </span>
          </label>
          {policyError && (
            <p className="text-xs text-terracotta font-medium mt-1">{policyError}</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onBack}
          size="default"
          className="flex-1 justify-center"
        >
          Back
        </Button>

        <Button
          type="submit"
          size="default"
          className="flex-[2] justify-center"
          isLoading={isHolding}
          disabled={isHolding}
        >
          Continue to payment
        </Button>
      </div>
    </form>
  );
};
