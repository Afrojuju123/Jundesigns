"use client";

import React from "react";
import { Clock, Calendar, CheckCircle2 } from "lucide-react";
import { workshops } from "@/content/workshops";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { SectionHeading } from "@/components/atoms/SectionHeading";
import { CardGrid } from "@/components/molecules/CardGrid";
import { WorkshopCard } from "@/components/molecules/WorkshopCard";
import { useBookingDrawer } from "@/context/BookingDrawerContext";

export const WorkshopsIndexClient: React.FC = () => {
  const { openBooking } = useBookingDrawer();

  return (
    <div className="text-left">
      {/* 1. HERO INTRO SECTION */}
      <section className="px-4 sm:px-6 lg:px-8 pt-16 pb-12 md:pt-20 md:pb-16 border-b border-amber-400/20 max-w-content mx-auto">
        <div className="max-w-3xl space-y-4">
          <Eyebrow>OUR ACTIVITIES &bull; KIGALI, RWANDA</Eyebrow>
          <SectionHeading
            level="h1"
            title="Cultural Workshops *in Kigali*"
          />
          <p className="font-sans text-base sm:text-lg text-sand-primary leading-relaxed pt-2">
            Four hands-on experiences in Kigali. Each lasts two hours, runs every day at 10:00am and 4:00pm, and includes all materials and a local guide.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-sand-muted font-display uppercase tracking-wider">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber" />
              <span>Two Hours Per Session</span>
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber" />
              <span>Every Day &bull; 10:00am &amp; 4:00pm</span>
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber" />
              <span>All Materials Included</span>
            </span>
          </div>
        </div>
      </section>

      {/* 2. THE FOUR WORKSHOPS: EQUAL ALIGNED CARDS */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-20 max-w-content mx-auto">
        <CardGrid columns={2}>
          {workshops.map((workshop) => (
            <WorkshopCard
              key={workshop.slug}
              workshop={workshop}
              onBook={(slug) => openBooking(slug)}
              priority={true}
            />
          ))}
        </CardGrid>
      </section>
    </div>
  );
};
