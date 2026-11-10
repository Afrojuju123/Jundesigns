"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  AlertCircle,
  Calendar as CalendarIcon,
  Info,
} from "lucide-react";
import { workshops } from "@/content/workshops";
import { TimeSlot, DayAvailability } from "@/lib/booking/types";
import { TIME_SLOTS, bookingConfig } from "@/lib/booking/config";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

export interface Step1Props {
  workshopSlug: string;
  onSelectWorkshop: (slug: string) => void;
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
  selectedSlot: TimeSlot;
  onSelectSlot: (slot: TimeSlot) => void;
  guestCount: number;
  onChangeGuests: (count: number) => void;
  onContinue: () => void;
}

export const Step1DateTime: React.FC<Step1Props> = ({
  workshopSlug,
  onSelectWorkshop,
  selectedDate,
  onSelectDate,
  selectedSlot,
  onSelectSlot,
  guestCount,
  onChangeGuests,
  onContinue,
}) => {
  // Calendar navigation state
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    return selectedDate ? new Date(selectedDate + "T10:00:00") : new Date();
  });

  const [dayAvailability, setDayAvailability] = useState<DayAvailability | null>(null);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState<boolean>(false);

  // Fetch slot availability whenever workshop or selectedDate changes
  useEffect(() => {
    if (!selectedDate || !workshopSlug) return;

    let isMounted = true;
    setIsLoadingAvailability(true);

    fetch(`/api/booking/availability?workshop=${workshopSlug}&date=${selectedDate}`)
      .then((res) => res.json())
      .then((data: DayAvailability) => {
        if (isMounted) {
          setDayAvailability(data);
          setIsLoadingAvailability(false);

          // If current selectedSlot is not available in new data, auto-switch to first available slot
          const currentSlotAvail = data.slots.find((s) => s.slot === selectedSlot);
          if (!currentSlotAvail || !currentSlotAvail.isAvailable) {
            const firstAvail = data.slots.find((s) => s.isAvailable);
            if (firstAvail) {
              onSelectSlot(firstAvail.slot);
            }
          }
        }
      })
      .catch((err) => {
        console.error("Availability fetch error:", err);
        if (isMounted) setIsLoadingAvailability(false);
      });

    return () => {
      isMounted = false;
    };
  }, [workshopSlug, selectedDate, onSelectSlot, selectedSlot]);

  // Calendar calculations
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + bookingConfig.maxDaysInAdvance);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const handlePrevMonth = () => {
    const prev = new Date(year, month - 1, 1);
    if (prev >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setCurrentMonth(prev);
    }
  };

  const handleNextMonth = () => {
    const next = new Date(year, month + 1, 1);
    if (next <= maxDate) {
      setCurrentMonth(next);
    }
  };

  const activeWorkshop =
    workshops.find((w) => w.slug === workshopSlug) || workshops[0];

  const currentSlotInfo = dayAvailability?.slots.find((s) => s.slot === selectedSlot);
  const maxPlacesForCurrentSlot = currentSlotInfo?.remainingPlaces || bookingConfig.capacityPerSlot;
  const canIncreaseGuests = guestCount < Math.min(bookingConfig.maxGuestsPerBooking, maxPlacesForCurrentSlot);

  return (
    <div className="space-y-6 text-left animate-reveal">
      {/* 1. Workshop Selector */}
      <div className="space-y-2">
        <label
          htmlFor="workshop-select"
          className="block font-display text-xs font-bold uppercase tracking-eyebrow text-amber"
        >
          Select Workshop
        </label>
        <select
          id="workshop-select"
          value={workshopSlug}
          onChange={(e) => onSelectWorkshop(e.target.value)}
          className="w-full bg-brown-950 border border-amber-400/30 rounded-card px-4 py-3 text-sm text-sand-bright font-sans focus:outline-none focus:ring-2 focus:ring-amber transition-all cursor-pointer"
        >
          {workshops.map((w) => (
            <option key={w.slug} value={w.slug} className="bg-brown-950 text-sand-bright">
              {w.name} — {w.priceRwf.toLocaleString()} RWF / person
            </option>
          ))}
        </select>
      </div>

      {/* 2. Month Calendar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block font-display text-xs font-bold uppercase tracking-eyebrow text-amber">
            Choose Date (Next 90 Days)
          </label>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              disabled={year === today.getFullYear() && month === today.getMonth()}
              aria-label="Previous month"
              className="p-1.5 rounded-sm hover:bg-brown-800 text-sand-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-display font-bold text-xs uppercase tracking-wider text-sand-bright min-w-[120px] text-center">
              {monthNames[month]} {year}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              disabled={new Date(year, month + 1, 1) > maxDate}
              aria-label="Next month"
              className="p-1.5 rounded-sm hover:bg-brown-800 text-sand-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-brown-950/70 border border-amber-400/20 rounded-card p-3 sm:p-4">
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <span key={d} className="font-display text-[10px] font-bold text-sand-muted uppercase">
                {d}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {/* Empty offset padding days */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="h-9 sm:h-10" />
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
              const isPast = dateStr < todayStr;
              const isBeyond = dateStr > maxDateStr;
              const isSelected = dateStr === selectedDate;
              const isDisabled = isPast || isBeyond;

              return (
                <button
                  key={dateStr}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => onSelectDate(dateStr)}
                  className={cn(
                    "h-9 sm:h-10 rounded-sm font-sans text-xs sm:text-sm font-medium flex flex-col items-center justify-center relative transition-all duration-quick",
                    isSelected
                      ? "bg-amber text-brown-950 font-bold shadow-button scale-105 z-10"
                      : isDisabled
                      ? "text-sand-muted/20 cursor-not-allowed"
                      : "text-sand-bright hover:bg-brown-800 hover:text-amber"
                  )}
                  aria-label={`${monthNames[month]} ${dayNum}, ${year}`}
                >
                  <span>{dayNum}</span>
                  {!isDisabled && !isSelected && (
                    <span className="w-1 h-1 rounded-full bg-amber/50 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Slot Chips */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block font-display text-xs font-bold uppercase tracking-eyebrow text-amber">
            Select Time Slot
          </label>
          <span className="font-mono text-[11px] text-sand-muted">
            All times Kigali (CAT, UTC+2)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TIME_SLOTS.map(({ slot, label }) => {
            const slotInfo = dayAvailability?.slots.find((s) => s.slot === slot);
            const isAvail = slotInfo ? slotInfo.isAvailable : true;
            const remaining = slotInfo?.remainingPlaces ?? bookingConfig.capacityPerSlot;
            const reason = slotInfo?.disabledReason;
            const isSelected = selectedSlot === slot;

            return (
              <button
                key={slot}
                type="button"
                disabled={!isAvail}
                onClick={() => onSelectSlot(slot)}
                className={cn(
                  "p-3.5 rounded-card border text-left transition-all duration-quick flex flex-col justify-between gap-2",
                  isSelected && isAvail
                    ? "bg-amber/15 border-amber ring-1 ring-amber text-sand-bright shadow-warm-low"
                    : isAvail
                    ? "bg-brown-950/60 border-amber-400/25 text-sand-primary hover:border-amber-400/50 hover:bg-brown-900"
                    : "bg-brown-950/20 border-white/5 opacity-40 cursor-not-allowed"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock
                      className={cn(
                        "w-4 h-4",
                        isSelected ? "text-amber" : "text-sand-muted"
                      )}
                    />
                    <span className="font-sans font-bold text-sm text-sand-bright">
                      {label}
                    </span>
                  </div>
                  {isSelected && isAvail && (
                    <span className="w-2 h-2 rounded-full bg-amber" />
                  )}
                </div>

                <div className="text-[11px]">
                  {isAvail ? (
                    remaining <= 5 ? (
                      <span className="font-semibold text-amber flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Only {remaining} place{remaining === 1 ? "" : "s"} left
                      </span>
                    ) : (
                      <span className="text-sand-muted">{remaining} places available</span>
                    )
                  ) : (
                    <span className="text-terracotta font-medium">{reason || "Unavailable"}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Guest Count Stepper */}
      <div className="p-4 rounded-card bg-brown-950/70 border border-amber-400/20 flex items-center justify-between">
        <div>
          <span className="font-display text-xs font-bold uppercase tracking-eyebrow text-sand-bright block">
            Number of Guests
          </span>
          <span className="font-sans text-xs text-sand-muted">
            {activeWorkshop.name} (Max {Math.min(bookingConfig.maxGuestsPerBooking, maxPlacesForCurrentSlot)})
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={guestCount <= 1}
            onClick={() => onChangeGuests(Math.max(1, guestCount - 1))}
            className="w-8 h-8 rounded-sm bg-brown-800 border border-amber-400/30 text-sand-bright hover:bg-brown-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold text-base transition-colors"
            aria-label="Decrease guest count"
          >
            -
          </button>
          <span className="font-sans font-bold text-base text-amber min-w-[24px] text-center">
            {guestCount}
          </span>
          <button
            type="button"
            disabled={!canIncreaseGuests}
            onClick={() => onChangeGuests(guestCount + 1)}
            className="w-8 h-8 rounded-sm bg-brown-800 border border-amber-400/30 text-sand-bright hover:bg-brown-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold text-base transition-colors"
            aria-label="Increase guest count"
          >
            +
          </button>
        </div>
      </div>

      {/* Large Group / School notice when hitting max standard booking capacity */}
      {guestCount >= bookingConfig.maxGuestsPerBooking && (
        <div className="p-3.5 bg-brown-950 border border-amber-400/30 rounded-card text-xs text-sand-primary flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-sand-bright block">
              Planning for a school, university, or large group of 25+?
            </span>
            <p className="text-sand-muted leading-relaxed">
              We offer structured group packages with multiple artisan stations, take-home materials, and volume pricing.{" "}
              <Link
                href="/schools"
                className="text-amber hover:underline font-semibold"
              >
                View our Schools &amp; Groups packages &rarr;
              </Link>
            </p>
          </div>
        </div>
      )}

      {/* Action CTA */}
      <div className="pt-2">
        <Button
          onClick={onContinue}
          size="lg"
          className="w-full justify-center"
          disabled={!currentSlotInfo?.isAvailable}
        >
          Review & continue
        </Button>
      </div>
    </div>
  );
};
