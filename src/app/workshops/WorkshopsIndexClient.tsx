"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Calendar, ArrowRight, CheckCircle2 } from "lucide-react";
import { workshops, Workshop } from "@/content/workshops";
import { Button } from "@/components/atoms/Button";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { SectionHeading } from "@/components/atoms/SectionHeading";
import { BookingDrawer } from "@/components/organisms/BookingDrawer";

export const WorkshopsIndexClient: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<string>("imigongo-painting");

  const handleBook = (slug: string) => {
    setSelectedWorkshop(slug);
    setDrawerOpen(true);
  };

  return (
    <main className="bg-brown-900 text-sand-primary text-left min-h-screen">
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

      {/* 2. THE FOUR WORKSHOPS: ASYMMETRIC STAGGERED LAYOUT */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-20 max-w-content mx-auto space-y-16 md:space-y-24">
        {workshops.map((workshop, idx) => {
          const isEven = idx % 2 === 1;

          return (
            <article
              key={workshop.slug}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center bg-brown-950 rounded-hero p-6 sm:p-8 lg:p-10 border border-amber-400/25 shadow-warm-low ${
                isEven ? "lg:grid-flow-dense" : ""
              }`}
            >
              {/* Image Side */}
              <div
                className={`lg:col-span-7 ${
                  isEven ? "lg:col-start-6" : ""
                }`}
              >
                <Link
                  href={`/workshops/${workshop.slug}`}
                  className="block relative aspect-[4/3] sm:aspect-[16/10] rounded-card overflow-hidden group border border-amber-400/30"
                >
                  <Image
                    src={workshop.heroImages.large}
                    alt={workshop.name}
                    fill
                    loading="eager"
                    sizes="(max-width: 768px) 100vw, 60vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-slow"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brown-950/80 via-transparent to-transparent opacity-60" />
                  <div className="absolute top-4 left-4 bg-brown-950/90 backdrop-blur-sm border border-amber-400/40 px-3 py-1.5 rounded-sm">
                    <span className="font-serif italic text-xs text-amber font-semibold">
                      {workshop.subtitle}
                    </span>
                  </div>
                </Link>
              </div>

              {/* Text Side */}
              <div
                className={`lg:col-span-5 space-y-5 ${
                  isEven ? "lg:col-start-1" : ""
                }`}
              >
                <div className="space-y-2">
                  <span className="font-display text-[11px] font-bold uppercase tracking-eyebrow text-amber block">
                    0{idx + 1} &bull; WORKSHOP
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-sand-bright">
                    <Link
                      href={`/workshops/${workshop.slug}`}
                      className="hover:text-amber transition-colors"
                    >
                      {workshop.name}
                    </Link>
                  </h2>
                  <p className="font-serif italic text-amber text-sm sm:text-base">
                    {workshop.subtitle}
                  </p>
                </div>

                <p className="font-sans text-sm sm:text-base text-sand-primary leading-relaxed">
                  {workshop.cardLine || workshop.intro}
                </p>

                {/* Facts Strip */}
                <div className="pt-2 pb-2 border-y border-amber-400/15 space-y-1.5 text-xs">
                  <div className="flex justify-between text-sand-bright">
                    <span className="text-sand-muted">Price:</span>
                    <strong className="font-bold font-mono text-amber">
                      25,000 RWF per person
                    </strong>
                  </div>
                  <div className="flex justify-between text-sand-bright">
                    <span className="text-sand-muted">Duration:</span>
                    <span>Two hours</span>
                  </div>
                  <div className="flex justify-between text-sand-bright">
                    <span className="text-sand-muted">Daily Schedule:</span>
                    <span>10:00am &amp; 4:00pm</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Button
                    onClick={() => handleBook(workshop.slug)}
                    size="default"
                    className="h-11 px-6 text-xs uppercase"
                  >
                    Book now
                  </Button>

                  <Link
                    href={`/workshops/${workshop.slug}`}
                    className="inline-flex items-center justify-center gap-1.5 h-11 px-4 font-display text-xs font-bold uppercase tracking-button text-sand-bright hover:text-amber border border-amber-400/20 hover:border-amber rounded-button transition-colors"
                  >
                    <span>View details &amp; logistics</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* Global Booking Drawer */}
      <BookingDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        initialWorkshopSlug={selectedWorkshop}
      />
    </main>
  );
};
