"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { X, ArrowLeft } from "lucide-react";
import { workshops } from "@/content/workshops";
import { TimeSlot, Booking } from "@/lib/booking/types";
import { Step1DateTime } from "./booking/Step1DateTime";
import { Step2Review } from "./booking/Step2Review";
import { Step3Payment } from "./booking/Step3Payment";
import { Step4Confirmation } from "./booking/Step4Confirmation";
import { cn } from "@/lib/utils";

export interface BookingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialWorkshopSlug?: string | null;
}

const BookingDrawerContent: React.FC<BookingDrawerProps> = ({
  isOpen,
  onClose,
  initialWorkshopSlug,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Core State
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [workshopSlug, setWorkshopSlug] = useState<string>(
    initialWorkshopSlug || workshops[0].slug
  );

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    // Tomorrow as default
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });

  const [selectedSlot, setSelectedSlot] = useState<TimeSlot>("10:00");
  const [guestCount, setGuestCount] = useState<number>(1);

  // Step 2 Form fields
  const [customerName, setCustomerName] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [customerCountry, setCustomerCountry] = useState<string>("+250");
  const [customerNote, setCustomerNote] = useState<string>("");

  // Step 3 / 4 Hold & Payment state
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const [holdError, setHoldError] = useState<string | undefined>(undefined);

  const isUrlOpen = searchParams.get("book") === "open";
  const effectivelyOpen = isOpen || isUrlOpen;

  // Sync state with URL query parameters on initial open or URL changes
  useEffect(() => {
    if (!effectivelyOpen) return;

    const stepParam = searchParams.get("bookingStep");
    const wsParam = searchParams.get("bookingWorkshop");
    const dateParam = searchParams.get("bookingDate");
    const slotParam = searchParams.get("bookingSlot");
    const guestsParam = searchParams.get("bookingGuests");
    const refParam = searchParams.get("bookingRef");

    if (stepParam) {
      const stepNum = parseInt(stepParam, 10);
      if (stepNum >= 1 && stepNum <= 4) {
        setCurrentStep(stepNum as any);
      }
    }

    if (wsParam && workshops.some((w) => w.slug === wsParam)) {
      setWorkshopSlug(wsParam);
    } else if (initialWorkshopSlug) {
      setWorkshopSlug(initialWorkshopSlug);
    }

    if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
      setSelectedDate(dateParam);
    }

    if (slotParam === "10:00" || slotParam === "16:00") {
      setSelectedSlot(slotParam);
    }

    if (guestsParam) {
      const g = parseInt(guestsParam, 10);
      if (g >= 1 && g <= 8) setGuestCount(g);
    }

    // Restore booking from reference on page refresh
    if (refParam && !activeBooking) {
      fetch(`/api/booking/${refParam}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.reference) {
            setActiveBooking(data);
          }
        })
        .catch(() => {});
    }
  }, [effectivelyOpen, searchParams, initialWorkshopSlug, activeBooking]);

  // Update URL parameters when step or parameters change
  const updateUrlParams = useCallback(
    (step: number, ws: string, dt: string, sl: string, gc: number, ref?: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("book", "open");
      params.set("bookingStep", step.toString());
      params.set("bookingWorkshop", ws);
      params.set("bookingDate", dt);
      params.set("bookingSlot", sl);
      params.set("bookingGuests", gc.toString());
      if (ref) {
        params.set("bookingRef", ref);
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  // Clean URL when drawer closes
  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("book");
    params.delete("bookingStep");
    params.delete("bookingWorkshop");
    params.delete("bookingDate");
    params.delete("bookingSlot");
    params.delete("bookingGuests");
    params.delete("bookingRef");

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    onClose();
  };

  // Keyboard navigation: Escape key closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Step 1 -> Step 2
  const handleStep1Continue = () => {
    setCurrentStep(2);
    updateUrlParams(2, workshopSlug, selectedDate, selectedSlot, guestCount);
  };

  // Step 2 -> Step 1
  const handleStep2Back = () => {
    setCurrentStep(1);
    updateUrlParams(1, workshopSlug, selectedDate, selectedSlot, guestCount);
  };

  // Step 2 Submit -> Create 10-Minute Hold -> Step 3
  const handleCreateHold = async () => {
    setIsHolding(true);
    setHoldError(undefined);

    try {
      const fullPhone = `${customerCountry} ${customerPhone}`.trim();
      const res = await fetch("/api/booking/hold", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workshopSlug,
          date: selectedDate,
          slot: selectedSlot,
          guests: guestCount,
          customerName,
          customerEmail,
          customerPhone: fullPhone,
          customerCountry,
          note: customerNote,
          idempotencyKey: `hold-${workshopSlug}-${selectedDate}-${selectedSlot}-${customerEmail}`,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setHoldError(data.error || "Unable to hold places. Please check availability.");
        setIsHolding(false);
        return;
      }

      setActiveBooking(data.booking);
      setIsHolding(false);
      setCurrentStep(3);
      updateUrlParams(3, workshopSlug, selectedDate, selectedSlot, guestCount, data.booking.reference);
    } catch (err: any) {
      setHoldError("Network communication error. Please check your connection and retry.");
      setIsHolding(false);
    }
  };

  // Step 3 -> Step 2 Back
  const handleStep3Back = () => {
    setCurrentStep(2);
    updateUrlParams(2, workshopSlug, selectedDate, selectedSlot, guestCount);
  };

  // Step 3 Hold Expired -> return to Step 1 with notice
  const handleHoldExpired = () => {
    setHoldError("Your 10-minute hold has expired. Please choose your slot again.");
    setCurrentStep(1);
    updateUrlParams(1, workshopSlug, selectedDate, selectedSlot, guestCount);
  };

  // Step 3 Payment Success -> Step 4
  const handlePaymentSuccess = (confirmedBooking: Booking) => {
    setActiveBooking(confirmedBooking);
    setCurrentStep(4);
    updateUrlParams(4, workshopSlug, selectedDate, selectedSlot, guestCount, confirmedBooking.reference);
  };

  if (!effectivelyOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-flow-title"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-brown-950/80 backdrop-blur-sm transition-opacity animate-reveal"
      />

      {/* Drawer / Mobile Full-Screen Sheet Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <aside
          className={cn(
            "w-screen max-w-xl bg-brown-900 border-l border-amber-400/30 p-5 sm:p-8 flex flex-col justify-between shadow-drawer animate-reveal overflow-y-auto text-left",
            // Mobile full-screen sheet styling:
            "h-full sm:h-auto"
          )}
        >
          {/* Top Bar: Progress Indicator & Navigation */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-amber-400/20 pb-4">
              <div className="flex items-center gap-3">
                {currentStep > 1 && currentStep < 4 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (currentStep === 2) handleStep2Back();
                      if (currentStep === 3) handleStep3Back();
                    }}
                    className="p-1 rounded-sm text-sand-primary hover:text-amber transition-colors"
                    aria-label="Back to previous step"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
                <div>
                  <span className="font-display text-[11px] font-bold uppercase tracking-eyebrow text-amber block">
                    — STEP {currentStep} OF 4
                  </span>
                  <h2
                    id="booking-flow-title"
                    className="font-serif font-bold text-xl sm:text-2xl text-sand-bright"
                  >
                    {currentStep === 1 && "Choose Date & Time"}
                    {currentStep === 2 && "Review & Your Details"}
                    {currentStep === 3 && "Secure Payment"}
                    {currentStep === 4 && "Booking Confirmed"}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="p-2 rounded-sm text-sand-muted hover:text-sand-bright hover:bg-brown-800 transition-colors"
                aria-label="Close booking sheet"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step Progress Line */}
            <div className="w-full bg-brown-950 h-1 rounded-full overflow-hidden">
              <div
                className="bg-amber h-full transition-all duration-300 ease-out"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Views */}
          <div className="my-6 flex-1">
            {currentStep === 1 && (
              <Step1DateTime
                workshopSlug={workshopSlug}
                onSelectWorkshop={(slug) => {
                  setWorkshopSlug(slug);
                  updateUrlParams(1, slug, selectedDate, selectedSlot, guestCount);
                }}
                selectedDate={selectedDate}
                onSelectDate={(date) => {
                  setSelectedDate(date);
                  updateUrlParams(1, workshopSlug, date, selectedSlot, guestCount);
                }}
                selectedSlot={selectedSlot}
                onSelectSlot={(slot) => {
                  setSelectedSlot(slot);
                  updateUrlParams(1, workshopSlug, selectedDate, slot, guestCount);
                }}
                guestCount={guestCount}
                onChangeGuests={(count) => {
                  setGuestCount(count);
                  updateUrlParams(1, workshopSlug, selectedDate, selectedSlot, count);
                }}
                onContinue={handleStep1Continue}
              />
            )}

            {currentStep === 2 && (
              <Step2Review
                workshopSlug={workshopSlug}
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                guestCount={guestCount}
                customerName={customerName}
                onChangeName={setCustomerName}
                customerEmail={customerEmail}
                onChangeEmail={setCustomerEmail}
                customerPhone={customerPhone}
                onChangePhone={setCustomerPhone}
                customerCountry={customerCountry}
                onChangeCountry={setCustomerCountry}
                customerNote={customerNote}
                onChangeNote={setCustomerNote}
                onBack={handleStep2Back}
                onSubmit={handleCreateHold}
                isHolding={isHolding}
                holdError={holdError}
              />
            )}

            {currentStep === 3 && activeBooking && (
              <Step3Payment
                booking={activeBooking}
                onPaymentSuccess={handlePaymentSuccess}
                onHoldExpired={handleHoldExpired}
                onBack={handleStep3Back}
              />
            )}

            {currentStep === 4 && activeBooking && (
              <Step4Confirmation
                booking={activeBooking}
                onClose={handleClose}
              />
            )}
          </div>

          {/* Footer note for assurance (No fake badges) */}
          <div className="pt-4 border-t border-amber-400/15 text-center">
            <span className="font-sans text-[11px] text-sand-muted block">
              Jun Designs LTD &middot; Kigali Culture Village, Rebero &middot; +250 780 324 944
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
};

export const BookingDrawer: React.FC<BookingDrawerProps> = (props) => {
  return (
    <Suspense fallback={null}>
      <BookingDrawerContent {...props} />
    </Suspense>
  );
};
