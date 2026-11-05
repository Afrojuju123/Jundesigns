"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  MapPin,
  Calendar,
  Sparkles,
  Compass,
} from "lucide-react";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { Button } from "@/components/atoms/Button";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { SectionHeading } from "@/components/atoms/SectionHeading";
import { Callout } from "@/components/molecules/Callout";
import { GalleryGrid } from "@/components/organisms/GalleryGrid";
import { BookingDrawer } from "@/components/organisms/BookingDrawer";
import { StickyBookBar } from "@/components/molecules/StickyBookBar";
import { Workshop } from "@/content/workshops";
import { Testimonial } from "@/types";
import { cn } from "@/lib/utils";
import { formatRwf } from "@/lib/utils";

export interface WorkshopViewProps {
  workshop: Workshop;
  testimonial: Testimonial | null;
  otherWorkshops: Workshop[];
}

export const WorkshopView: React.FC<WorkshopViewProps> = ({
  workshop,
  testimonial,
  otherWorkshops,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Event Structured Data (JSON-LD)
  const eventStructuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${workshop.name} Workshop`,
    description: workshop.intro,
    image: workshop.heroImages.large,
    startDate: "2026-11-05T10:00:00+02:00",
    endDate: "2026-11-05T12:00:00+02:00",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: "Kigali Culture Village (Agaseke Center building)",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Street KK 557 St",
        addressLocality: "Rebero, Kicukiro",
        addressRegion: "Kigali",
        addressCountry: "RW",
      },
    },
    offers: {
      "@type": "Offer",
      url: `https://jundesigns.rw/workshops/${workshop.slug}`,
      price: workshop.priceRwf,
      priceCurrency: "RWF",
      availability: "https://schema.org/InStock",
      validFrom: "2026-01-01",
    },
    organizer: {
      "@type": "Organization",
      name: "Jun Designs LTD",
      url: "https://jundesigns.rw",
    },
  };

  // Crop classes based on workshop.photoCrop (e.g. 4/3 clean grid for top-down board shots)
  const is43Crop = workshop.photoCrop === "4/3";
  const isSquareCrop = workshop.photoCrop === "square";

  const heroAspectClass = is43Crop
    ? "aspect-[4/3]"
    : isSquareCrop
    ? "aspect-square"
    : "aspect-[4/5]";

  const aboutBackAspectClass = is43Crop
    ? "aspect-[4/3]"
    : isSquareCrop
    ? "aspect-square"
    : "aspect-[4/5]";

  const aboutFrontAspectClass = is43Crop
    ? "aspect-[4/3]"
    : isSquareCrop
    ? "aspect-square"
    : "aspect-[4/5]";

  const detailsAspectClass = is43Crop
    ? "aspect-[4/3]"
    : isSquareCrop
    ? "aspect-square"
    : "aspect-[3/4]";

  return (
    <div className="min-h-screen bg-brown-900 text-sand flex flex-col">
      {/* Event Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventStructuredData) }}
      />

      <Header onBookClick={() => setDrawerOpen(true)} />

      <main className="flex-1">
        {/* ========================================================
            1. HERO: Workshop Hero with Overlapping Collage
           ======================================================== */}
        <section className="relative px-4 sm:px-6 lg:px-8 pt-12 md:pt-20 pb-16 lg:pb-24 max-w-content mx-auto text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <Eyebrow>JUN DESIGNS &middot; RWANDA</Eyebrow>

              <div>
                <h1 className="font-serif font-bold text-[clamp(2.75rem,5.5vw+1rem,5.25rem)] text-sand-bright leading-[1.08] tracking-[-0.02em]">
                  {workshop.name}
                </h1>
                <p className="font-serif italic text-amber text-xl sm:text-2xl mt-2 font-normal">
                  {workshop.subtitle}
                </p>
              </div>

              <p className="font-sans text-lg md:text-xl text-sand-primary max-w-xl leading-relaxed">
                {workshop.intro}
              </p>

              {/* Action Button */}
              <div className="pt-2">
                <Button onClick={() => setDrawerOpen(true)} size="lg">
                  Book now
                </Button>
              </div>

              {/* Fact Row (No Icon Tiles) */}
              <div className="pt-4 border-t border-amber-400/15 max-w-md">
                <p className="font-sans text-sm md:text-[15px] text-sand-primary font-medium tracking-wide">
                  2-hour sessions &middot; Every day &middot; Local guide
                </p>
              </div>
            </div>

            {/* Right Collage Column (5 cols) */}
            <div className="lg:col-span-5 relative">
              {/* Primary Large Image */}
              <div
                className={cn(
                  "relative w-full rounded-hero overflow-hidden border border-amber-400/25 shadow-warm-low bg-brown-850",
                  heroAspectClass
                )}
              >
                <Image
                  src={workshop.heroImages.large}
                  alt={`${workshop.name} main session view`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover"
                />
              </div>

              {/* Offset Image 1 (Bottom Left, 28px radius & warm shadow) */}
              <div
                className={cn(
                  "hidden sm:block absolute -bottom-8 -left-10 rounded-hero overflow-hidden border border-amber-400/35 shadow-warm-low bg-brown-850 transition-transform duration-quick hover:scale-105",
                  is43Crop ? "w-48 h-36" : "w-44 h-48"
                )}
              >
                <Image
                  src={workshop.heroImages.small1}
                  alt={`${workshop.name} detail view 1`}
                  fill
                  sizes="180px"
                  className="object-cover"
                />
              </div>

              {/* Offset Image 2 (Top Right, 28px radius & warm shadow) */}
              <div
                className={cn(
                  "hidden sm:block absolute -top-6 -right-6 rounded-hero overflow-hidden border border-amber-400/35 shadow-warm-low bg-brown-850 transition-transform duration-quick hover:scale-105",
                  is43Crop ? "w-44 h-33" : "w-40 h-40"
                )}
              >
                <Image
                  src={workshop.heroImages.small2}
                  alt={`${workshop.name} detail view 2`}
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            2. ABOUT THE EXPERIENCE: Body, Callout & Photo Pair
           ======================================================== */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-brown-800 border-y border-amber-400/20 text-left">
          <div className="max-w-content mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <Eyebrow>ABOUT THE EXPERIENCE</Eyebrow>

              <SectionHeading
                level="h2"
                title={workshop.aboutHeading || "An Ancient Art, A *Living Tradition*"}
              />

              <p className="font-sans text-base sm:text-lg text-sand-primary leading-relaxed">
                {workshop.about}
              </p>

              {/* Callout with amber left border */}
              <Callout>
                {workshop.callout}
              </Callout>
            </div>

            {/* Right Overlapping Photo Pair (5 cols) */}
            <div className="lg:col-span-5 relative pt-4 pb-12 sm:pb-16">
              {/* Back Photo */}
              <div
                className={cn(
                  "relative w-4/5 rounded-hero overflow-hidden border border-amber-400/25 shadow-warm-low bg-brown-850",
                  aboutBackAspectClass
                )}
              >
                <Image
                  src={workshop.aboutPhotos.photo1}
                  alt={`${workshop.name} hands-on studio step`}
                  fill
                  sizes="(max-width: 1024px) 80vw, 400px"
                  className="object-cover"
                />
              </div>

              {/* Overlapping Front Photo */}
              <div
                className={cn(
                  "absolute right-0 bottom-0 w-3/5 rounded-hero overflow-hidden border border-amber-400/35 shadow-warm-low bg-brown-850 transition-transform duration-quick hover:scale-105",
                  aboutFrontAspectClass
                )}
              >
                <Image
                  src={workshop.aboutPhotos.photo2}
                  alt={`${workshop.name} artisan technique close-up`}
                  fill
                  sizes="(max-width: 1024px) 60vw, 300px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            3. QUICK FACTS: Definition Strip with Booking Action
           ======================================================== */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-20 max-w-content mx-auto text-left">
          <div className="space-y-8">
            <div className="space-y-1">
              <Eyebrow>ESSENTIAL INFO</Eyebrow>
              <SectionHeading
                level="h2"
                title="Quick *Facts*"
              />
            </div>

            {/* Clean Definition Strip with Button Beside It */}
            <div className="p-6 sm:p-8 rounded-card bg-brown-850 border border-amber-400/20 shadow-warm-low flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 flex-1">
                <div className="space-y-1 border-l sm:border-l-0 lg:border-l-0 pl-3 sm:pl-0 border-amber-400/30">
                  <span className="font-display text-xs font-bold uppercase tracking-eyebrow text-sand-muted block">
                    Duration
                  </span>
                  <span className="font-sans text-base sm:text-lg font-bold text-sand-bright">
                    {workshop.duration}
                  </span>
                </div>

                <div className="space-y-1 border-l sm:border-l-0 lg:border-l-0 pl-3 sm:pl-0 border-amber-400/30">
                  <span className="font-display text-xs font-bold uppercase tracking-eyebrow text-sand-muted block">
                    Availability
                  </span>
                  <span className="font-sans text-base sm:text-lg font-bold text-sand-bright">
                    {workshop.availability}
                  </span>
                </div>

                <div className="space-y-1 border-l sm:border-l-0 lg:border-l-0 pl-3 sm:pl-0 border-amber-400/30">
                  <span className="font-display text-xs font-bold uppercase tracking-eyebrow text-sand-muted block">
                    Time slots
                  </span>
                  <span className="font-sans text-base sm:text-lg font-bold text-sand-bright">
                    {workshop.timeSlots}
                  </span>
                </div>

                <div className="space-y-1 border-l sm:border-l-0 lg:border-l-0 pl-3 sm:pl-0 border-amber-400/30">
                  <span className="font-display text-xs font-bold uppercase tracking-eyebrow text-sand-muted block">
                    Price
                  </span>
                  <span className="font-sans text-base sm:text-lg font-bold text-amber">
                    {formatRwf(workshop.priceRwf)}
                    <span className="text-xs font-normal text-sand-muted ml-1">
                      per person
                    </span>
                  </span>
                </div>
              </div>

              <div className="lg:pl-6 lg:border-l lg:border-amber-400/15 shrink-0">
                <Button
                  onClick={() => setDrawerOpen(true)}
                  size="default"
                  className="w-full sm:w-auto h-[48px]"
                >
                  Book this workshop
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            4. DETAILS & LOGISTICS: 3 Rows Left, Tall Photo Right
           ======================================================== */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-brown-800 border-y border-amber-400/20 text-left">
          <div className="max-w-content mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left 3 Rows (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-2">
                <Eyebrow>PLAN YOUR VISIT</Eyebrow>
                <SectionHeading
                  level="h2"
                  title="Details & *Logistics*"
                />
              </div>

              <div className="space-y-6 divide-y divide-amber-400/15 pt-2">
                {/* Row 1: Location */}
                <div className="pt-6 first:pt-0 space-y-2">
                  <h3 className="font-display font-bold text-xs uppercase tracking-eyebrow text-amber">
                    — Studio Location
                  </h3>
                  <p className="font-sans text-base sm:text-lg text-sand-bright leading-relaxed">
                    {workshop.locationText}
                  </p>
                  <div>
                    <a
                      href="https://maps.google.com/?q=Kigali+Culture+Village+Rebero+Kicukiro"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-display font-semibold text-xs uppercase tracking-button text-amber hover:text-amber-300 transition-colors"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Open in maps</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Row 2: What's Included */}
                <div className="pt-6 space-y-2">
                  <h3 className="font-display font-bold text-xs uppercase tracking-eyebrow text-amber">
                    — What&apos;s Included
                  </h3>
                  <p className="font-sans text-base sm:text-lg text-sand-bright leading-relaxed">
                    {workshop.included}
                  </p>
                </div>

                {/* Row 3: What to Bring */}
                <div className="pt-6 space-y-2">
                  <h3 className="font-display font-bold text-xs uppercase tracking-eyebrow text-amber">
                    — What to Bring
                  </h3>
                  <p className="font-sans text-base sm:text-lg text-sand-bright leading-relaxed">
                    {workshop.whatToBring}
                  </p>
                </div>

                {/* Row 4: Schools & Large Groups */}
                <div className="pt-6 space-y-2">
                  <h3 className="font-display font-bold text-xs uppercase tracking-eyebrow text-amber">
                    — Schools &amp; Groups (25+ Students)
                  </h3>
                  <p className="font-sans text-base sm:text-lg text-sand-bright leading-relaxed">
                    Organising an educational excursion or group of 25 or more? We offer structured multi-activity packages with dedicated artisan stations and tiered volume rates.
                  </p>
                  <div>
                    <Link
                      href="/schools"
                      className="inline-flex items-center gap-1.5 font-display font-semibold text-xs uppercase tracking-button text-amber hover:text-amber-300 transition-colors"
                    >
                      <span>Explore school packages &rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Tall Photo Column (5 cols) */}
            <div className="lg:col-span-5">
              <div
                className={cn(
                  "relative rounded-hero overflow-hidden border border-amber-400/25 shadow-warm-low bg-brown-850",
                  detailsAspectClass
                )}
              >
                <Image
                  src={workshop.detailsPhoto}
                  alt={`${workshop.name} workshop session setting`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 450px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            5. RESERVE: Single Clean CTA Band
           ======================================================== */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 max-w-content mx-auto text-left">
          <div className="p-8 sm:p-12 lg:p-16 rounded-hero bg-brown-850 border border-amber-400/30 shadow-warm-low flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <Eyebrow>RESERVE NOW</Eyebrow>
              <SectionHeading
                level="h2"
                title="Reserve Your *Spot*"
              />
              <p className="font-sans text-base sm:text-lg text-sand-primary leading-relaxed">
                Sessions have limited places. Choose a day and time and book online in
                a few minutes.
              </p>
            </div>

            <div className="shrink-0">
              <Button
                onClick={() => setDrawerOpen(true)}
                size="lg"
                className="w-full sm:w-auto"
              >
                Book your session
              </Button>
            </div>
          </div>
        </section>

        {/* ========================================================
            6. GALLERY: Moments from Our Sessions (For THIS workshop)
           ======================================================== */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-brown-800 border-t border-amber-400/20 text-left space-y-12">
          <div className="max-w-content mx-auto space-y-12">
            <div className="space-y-2">
              <Eyebrow>PHOTO ARCHIVE</Eyebrow>
              <SectionHeading
                level="h2"
                title="Moments from *Our Sessions*"
              />
              <p className="font-sans text-sm sm:text-base text-sand-muted max-w-lg">
                Real scenes from {workshop.name} sessions at our Rebero hillside studio.
              </p>
            </div>

            <GalleryGrid items={workshop.gallery} />
          </div>
        </section>

        {/* ========================================================
            7. TESTIMONIAL: Exclusive to this workshop only (if exists)
           ======================================================== */}
        {testimonial && (
          <section className="px-4 sm:px-6 lg:px-8 py-20 max-w-content mx-auto text-left">
            <div className="max-w-3xl mx-auto p-8 sm:p-12 rounded-hero bg-brown-850 border border-amber-400/25 shadow-warm-low space-y-6">
              <Eyebrow>GUEST REFLECTION</Eyebrow>

              <blockquote className="font-serif italic text-xl sm:text-2xl text-sand-bright leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              <div className="pt-4 border-t border-amber-400/15 flex items-center justify-between">
                <div>
                  <cite className="not-italic block font-display font-bold text-sm tracking-wide text-sand-bright uppercase">
                    {testimonial.author}
                  </cite>
                  <span className="block font-sans text-xs text-sand-muted">
                    {testimonial.origin}
                  </span>
                </div>
                <span className="font-mono text-xs text-amber">
                  Attended: {testimonial.dateAttended}
                </span>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================
            8. OTHER WORKSHOPS: Compact Row Linking to the Other Three
           ======================================================== */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-brown-950 border-t border-amber-400/20 text-left">
          <div className="max-w-content mx-auto space-y-8">
            <div className="space-y-1">
              <Eyebrow>EXPLORE MORE CRAFTS</Eyebrow>
              <SectionHeading
                level="h2"
                title="Other Cultural *Workshops*"
              />
            </div>

            {/* Compact 3-Column Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherWorkshops.map((other) => (
                <Link
                  key={other.slug}
                  href={`/workshops/${other.slug}`}
                  className="group rounded-card bg-brown-900 border border-amber-400/20 p-6 flex flex-col justify-between space-y-4 hover:border-amber-400/50 hover:shadow-warm-low transition-all"
                >
                  <div className="space-y-2">
                    <span className="font-mono text-xs text-amber block">
                      {other.duration} &middot; {formatRwf(other.priceRwf)}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-sand-bright group-hover:text-amber transition-colors">
                      {other.name}
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-sand-muted line-clamp-2">
                      {other.cardLine}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-amber-400/15 flex items-center justify-between text-xs font-display font-semibold uppercase tracking-button text-amber">
                    <span>View workshop</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Booking Drawer pre-selected to this workshop */}
      <BookingDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        initialWorkshopSlug={workshop.slug}
      />

      {/* Sticky Mobile Booking Bar */}
      <StickyBookBar
        workshopName={workshop.name}
        priceRwf={workshop.priceRwf}
        onBookClick={() => setDrawerOpen(true)}
      />

      <Footer />
    </div>
  );
};
