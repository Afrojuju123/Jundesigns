"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  MapPin,
  ArrowRight,
  ArrowUpRight,
  Check,
  Compass,
} from "lucide-react";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { Button } from "@/components/atoms/Button";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { SectionHeading } from "@/components/atoms/SectionHeading";
import { ImageSlot } from "@/components/atoms/ImageSlot";
import { GalleryGrid, GalleryItem } from "@/components/organisms/GalleryGrid";
import { BookingDrawer } from "@/components/organisms/BookingDrawer";
import { StickyBookBar } from "@/components/molecules/StickyBookBar";
import { siteConfig } from "@/content/site";
import { formatRwf } from "@/lib/utils";

// JSON-LD Structured Data for LocalBusiness
const structuredData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Jun Designs LTD",
  image: "https://jundesigns.rw/brand/logo.png",
  "@id": "https://jundesigns.rw",
  url: "https://jundesigns.rw",
  telephone: "+250780324944",
  priceRange: "25000 RWF",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Kigali Culture Village (Agaseke Center building), Rebero, Kicukiro. Street KK 557 St",
    addressLocality: "Kigali",
    addressRegion: "Kigali",
    addressCountry: "RW",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -1.9833,
    longitude: 30.0833,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "09:00",
      closes: "18:00",
    },
  ],
  sameAs: [
    "https://facebook.com/jundesignsrw",
    "https://instagram.com/jun_designs_rw",
    "https://pinterest.com/jundesignsrw",
  ],
};

// 6 Gallery Items mixing all four workshops
const galleryItems: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Imigongo Painting at the Easel",
    description: "Painting traditional geometric spiral relief overlooking the Kigali valley from Rebero hill.",
    src: "/images/imigongo-easel-kigali.jpg",
    aspectRatio: "16/9",
  },
  {
    id: "gal-2",
    title: "Traditional Dance & Royal Movement",
    description: "Mastering arm extensions and rhythmic footwork outdoors at Kigali Culture Village.",
    src: "/images/traditional-dance-outdoor.jpg",
    aspectRatio: "3/4",
  },
  {
    id: "gal-3",
    title: "Igisoro Mancala Board & Inyambutsi Seeds",
    description: "Hand-carved wooden 16-pit board set up for strategy and relay-sowing instruction.",
    src: "/images/igisoro-board-seeds.jpg",
    aspectRatio: "1/1",
  },
  {
    id: "gal-4",
    title: "Natural Pigment Detailing",
    description: "Precision line work using soot black, white kaolin, and local red ochre mineral colors.",
    src: "/images/imigongo-detail-painting.jpg",
    aspectRatio: "1/1",
  },
  {
    id: "gal-5",
    title: "Sisal Weaving at Agaseke Center",
    description: "Artisan extraction of agave leaves and coiling fine threads around sweet grass cores.",
    aspectRatio: "16/9",
  },
  {
    id: "gal-6",
    title: "Ingoma Drumming Cadences",
    description: "Learning royal court drum rhythms under the guidance of traditional percussionists.",
    aspectRatio: "16/9",
  },
];

export default function HomePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<string | null>(null);

  const openBooking = (slug?: string) => {
    setSelectedWorkshop(slug || "imigongo-painting");
    setDrawerOpen(true);
  };

  const scrollToWorkshops = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById("workshops");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-brown-900 text-sand flex flex-col">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Header onBookClick={() => openBooking()} />

      <main className="flex-1">
        {/* ========================================================
            1. HERO: Asymmetric Split Layout
           ======================================================== */}
        <section className="relative px-4 sm:px-6 lg:px-8 pt-12 md:pt-20 pb-16 lg:pb-24 max-w-content mx-auto text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <Eyebrow>KIGALI, RWANDA</Eyebrow>

              <SectionHeading
                level="h1"
                title="Discover *Rwandan* Heritage"
              />

              <p className="font-sans text-lg md:text-xl text-sand-primary max-w-xl leading-relaxed">
                Learn Imigongo painting, hand-weaving, traditional dance and
                Igisoro with local guides in Kigali. All materials are provided,
                and no experience is needed.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Button onClick={scrollToWorkshops} size="lg">
                  Explore workshops
                </Button>

                <a
                  href={siteConfig.externalLinks.shop}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="secondary" size="lg">
                    Artisan store
                  </Button>
                </a>
              </div>

              {/* Understated Line of Facts (No Icon Tiles) */}
              <div className="pt-4 border-t border-amber-400/15 max-w-md">
                <p className="font-sans text-sm md:text-[15px] text-sand-primary font-medium tracking-wide">
                  4 workshops &middot; Local guides &middot; All materials provided
                </p>
              </div>
            </div>

            {/* Right Collage Column (5 cols) */}
            <div className="lg:col-span-5 relative">
              {/* Primary Large Image */}
              <div className="relative w-full aspect-[4/5] sm:aspect-[4/5] rounded-hero overflow-hidden border border-amber-400/25 shadow-warm-low bg-brown-850">
                <Image
                  src="/images/imigongo-easel-kigali.jpg"
                  alt="Painter creating traditional Imigongo art at an easel overlooking Kigali hills"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover"
                />
              </div>

              {/* Offset Image 1 (Dancer, bottom-left overlap, hidden on mobile) */}
              <div className="hidden sm:block absolute -bottom-8 -left-10 w-44 h-48 rounded-hero overflow-hidden border border-amber-400/35 shadow-warm-low bg-brown-850 transition-transform duration-quick hover:scale-105">
                <Image
                  src="/images/traditional-dance-outdoor.jpg"
                  alt="Traditional Rwandan dancer instructor in rehearsal"
                  fill
                  sizes="180px"
                  className="object-cover"
                />
              </div>

              {/* Offset Image 2 (Detail painting, top-right overlap, hidden on mobile) */}
              <div className="hidden sm:block absolute -top-6 -right-6 w-40 h-40 rounded-hero overflow-hidden border border-amber-400/35 shadow-warm-low bg-brown-850 transition-transform duration-quick hover:scale-105">
                <Image
                  src="/images/imigongo-detail-painting.jpg"
                  alt="Close-up of artisan painting geometric Imigongo relief pattern"
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            2. THE FOUR WORKSHOPS: Asymmetric Staggered Layout
           ======================================================== */}
        <section
          id="workshops"
          className="px-4 sm:px-6 lg:px-8 py-20 bg-brown-800 border-y border-amber-400/20 text-left"
        >
          <div className="max-w-content mx-auto space-y-14">
            <div className="space-y-2 max-w-2xl">
              <Eyebrow>OUR ACTIVITIES</Eyebrow>
              <SectionHeading
                level="h2"
                title="Choose Your *Experience*"
              />
              <p className="font-sans text-base text-sand-primary pt-1">
                Each session is guided one-on-one by local Rwandan artisans in an open,
                relaxed studio setting at Kigali Culture Village.
              </p>
            </div>

            {/* Asymmetric Staggered Grid (Cards 2 & 4 offset vertically on desktop) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-start">
              {/* Workshop 1: Imigongo Painting */}
              <article className="rounded-card bg-brown-850 border border-amber-400/20 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-warm-low hover:border-amber-400/50 transition-all">
                <div className="space-y-4">
                  <div className="relative aspect-[16/10] rounded-card overflow-hidden border border-amber-400/20 bg-brown-900">
                    <Image
                      src="/images/imigongo-detail-painting.jpg"
                      alt="Artisan painting traditional Imigongo geometric relief"
                      fill
                      sizes="(max-width: 768px) 100vw, 550px"
                      className="object-cover transition-transform duration-smooth hover:scale-105"
                    />
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-sand-bright">
                    Imigongo Painting
                  </h3>

                  <p className="font-sans text-sm sm:text-base text-sand-primary leading-relaxed">
                    Learn the sacred 18th-century geometric art form.
                  </p>

                  <div className="font-mono text-xs sm:text-sm text-sand-muted">
                    25,000 RWF per person &middot; 2 hours
                  </div>
                </div>

                <div className="pt-4 border-t border-amber-400/15 flex items-center justify-between">
                  <Link
                    href="/workshops/imigongo-painting"
                    className="font-display font-semibold text-xs sm:text-sm text-amber hover:text-amber-300 inline-flex items-center gap-1 uppercase tracking-button"
                  >
                    <span>View details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Button
                    onClick={() => openBooking("imigongo-painting")}
                    size="sm"
                  >
                    Book
                  </Button>
                </div>
              </article>

              {/* Workshop 2: Traditional Dance (Staggered offset) */}
              <article className="rounded-card bg-brown-850 border border-amber-400/20 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-warm-low hover:border-amber-400/50 transition-all md:mt-12">
                <div className="space-y-4">
                  <div className="relative aspect-[16/10] rounded-card overflow-hidden border border-amber-400/20 bg-brown-900">
                    <Image
                      src="/images/traditional-dance-outdoor.jpg"
                      alt="Traditional dance instructor guiding visitor movement"
                      fill
                      sizes="(max-width: 768px) 100vw, 550px"
                      className="object-cover transition-transform duration-smooth hover:scale-105"
                    />
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-sand-bright">
                    Traditional Dance
                  </h3>

                  <p className="font-sans text-sm sm:text-base text-sand-primary leading-relaxed">
                    Experience energetic movements and royal history.
                  </p>

                  <div className="font-mono text-xs sm:text-sm text-sand-muted">
                    25,000 RWF per person &middot; 2 hours
                  </div>
                </div>

                <div className="pt-4 border-t border-amber-400/15 flex items-center justify-between">
                  <Link
                    href="/workshops/traditional-dance"
                    className="font-display font-semibold text-xs sm:text-sm text-amber hover:text-amber-300 inline-flex items-center gap-1 uppercase tracking-button"
                  >
                    <span>View details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Button
                    onClick={() => openBooking("traditional-dance")}
                    size="sm"
                  >
                    Book
                  </Button>
                </div>
              </article>

              {/* Workshop 3: Carpet Hand-Weaving */}
              <article className="rounded-card bg-brown-850 border border-amber-400/20 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-warm-low hover:border-amber-400/50 transition-all">
                <div className="space-y-4">
                  <div className="relative aspect-[16/10] rounded-card overflow-hidden border border-amber-400/20 bg-brown-900">
                    <Image
                      src="/images/weaving/weaving-hands-loom.jpg"
                      alt="Hands weaving natural sisal threads on a small frame loom"
                      fill
                      sizes="(max-width: 768px) 100vw, 550px"
                      className="object-cover transition-transform duration-smooth hover:scale-105"
                    />
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-sand-bright">
                    Carpet Hand-Weaving
                  </h3>

                  <p className="font-sans text-sm sm:text-base text-sand-primary leading-relaxed">
                    Master the ancient craft of sisal weaving.
                  </p>

                  <div className="font-mono text-xs sm:text-sm text-sand-muted">
                    25,000 RWF per person &middot; 2 hours
                  </div>
                </div>

                <div className="pt-4 border-t border-amber-400/15 flex items-center justify-between">
                  <Link
                    href="/workshops/hand-weaving"
                    className="font-display font-semibold text-xs sm:text-sm text-amber hover:text-amber-300 inline-flex items-center gap-1 uppercase tracking-button"
                  >
                    <span>View details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Button
                    onClick={() => openBooking("hand-weaving")}
                    size="sm"
                  >
                    Book
                  </Button>
                </div>
              </article>

              {/* Workshop 4: Igisoro Game (Staggered offset) */}
              <article className="rounded-card bg-brown-850 border border-amber-400/20 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-warm-low hover:border-amber-400/50 transition-all md:mt-12">
                <div className="space-y-4">
                  <div className="relative aspect-[16/10] rounded-card overflow-hidden border border-amber-400/20 bg-brown-900">
                    <Image
                      src="/images/igisoro-board-seeds.jpg"
                      alt="Carved 16-pit Mancala wooden board with polished inyambutsi seeds"
                      fill
                      sizes="(max-width: 768px) 100vw, 550px"
                      className="object-cover transition-transform duration-smooth hover:scale-105"
                    />
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-sand-bright">
                    Igisoro Game
                  </h3>

                  <p className="font-sans text-sm sm:text-base text-sand-primary leading-relaxed">
                    Challenge your mind with this historic tactical board game.
                  </p>

                  <div className="font-mono text-xs sm:text-sm text-sand-muted">
                    25,000 RWF per person &middot; 2 hours
                  </div>
                </div>

                <div className="pt-4 border-t border-amber-400/15 flex items-center justify-between">
                  <Link
                    href="/workshops/igisoro-game"
                    className="font-display font-semibold text-xs sm:text-sm text-amber hover:text-amber-300 inline-flex items-center gap-1 uppercase tracking-button"
                  >
                    <span>View details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Button
                    onClick={() => openBooking("igisoro-game")}
                    size="sm"
                  >
                    Book
                  </Button>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ========================================================
            2B. SCHOOLS & GROUPS CALLOUT BAND
           ======================================================== */}
        <section className="bg-brown-950 border-b border-amber-400/20 px-4 sm:px-6 lg:px-8 py-10 md:py-12 text-left">
          <div className="max-w-content mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="font-display text-xs font-bold uppercase tracking-eyebrow text-amber block">
                Educational Field Trips &bull; Groups 25+
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-sand-bright">
                Bringing a Class or Group?
              </h3>
              <p className="font-sans text-sm sm:text-base text-sand-primary leading-relaxed">
                Structured cultural workshops for primary schools, secondary schools, and universities. Hands-on Imigongo painting, dance, and craft demonstrations with volume pricing from 4,500 RWF per student.
              </p>
            </div>

            <div className="shrink-0 w-full md:w-auto">
              <Link
                href="/schools"
                className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-pill bg-amber text-brown-950 font-display text-xs font-bold uppercase tracking-button hover:bg-amber-400 active:bg-amber-500 shadow-sm transition-all w-full md:w-auto"
              >
                <span>Explore School Packages</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================
            3. HOW BOOKING WORKS: Simple Horizontal 4-Step Sequence
           ======================================================== */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-20 max-w-content mx-auto text-left">
          <div className="space-y-8">
            <div className="space-y-1">
              <Eyebrow>HOW BOOKING WORKS</Eyebrow>
              <SectionHeading
                level="h2"
                title="Four Simple Steps to *Your Session*"
              />
            </div>

            {/* Plain Text with Numbers (Not Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-4 border-t border-amber-400/20">
              <div className="space-y-2">
                <span className="font-serif font-bold text-3xl sm:text-4xl text-amber block">
                  1
                </span>
                <p className="font-sans text-base text-sand-bright leading-snug">
                  Pick a workshop, date and time.
                </p>
                <p className="font-sans text-xs text-sand-muted">
                  Daily morning (10:00) or afternoon (16:00) slots.
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-serif font-bold text-3xl sm:text-4xl text-amber block">
                  2
                </span>
                <p className="font-sans text-base text-sand-bright leading-snug">
                  Review the price.
                </p>
                <p className="font-sans text-xs text-sand-muted">
                  Fixed 25,000 RWF (~$18 USD) per person, all materials included.
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-serif font-bold text-3xl sm:text-4xl text-amber block">
                  3
                </span>
                <p className="font-sans text-base text-sand-bright leading-snug">
                  Pay securely.
                </p>
                <p className="font-sans text-xs text-sand-muted">
                  Card, Mobile Money, or upon arrival at the studio.
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-serif font-bold text-3xl sm:text-4xl text-amber block">
                  4
                </span>
                <p className="font-sans text-base text-sand-bright leading-snug">
                  Get your confirmation by email.
                </p>
                <p className="font-sans text-xs text-sand-muted">
                  Includes digital voucher, directions, and calendar sync.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            4. THE PROMISE: Split Layout (Photo Left, Text Right)
           ======================================================== */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-brown-800 border-t border-amber-400/20 text-left">
          <div className="max-w-content mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Tall Photo */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[3/4] rounded-hero overflow-hidden border border-amber-400/25 shadow-warm-low bg-brown-850">
                <Image
                  src="/images/imigongo-easel-kigali.jpg"
                  alt="Jun Designs artisan studio overlooking Kigali"
                  fill
                  sizes="(max-width: 1024px) 100vw, 450px"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Right Text Column */}
            <div className="lg:col-span-7 space-y-6">
              <Eyebrow>THE JUN DESIGNS PROMISE</Eyebrow>

              <SectionHeading
                level="h2"
                title="Preserving Heritage, *Inspiring the World.*"
              />

              <p className="font-sans text-base sm:text-lg text-sand-primary leading-relaxed">
                We are dedicated to safeguarding Rwanda&apos;s beautiful cultural
                practices. By joining our workshops or shopping our artisan
                collections, you directly support local craftsmen and keep these
                ancient traditions alive.
              </p>

              {/* Authentic Testimonial Box */}
              <div className="p-6 rounded-card bg-brown-850 border border-amber-400/20 space-y-3">
                <blockquote className="font-serif italic text-base sm:text-lg text-sand-bright leading-relaxed">
                  &ldquo;An absolutely mesmerizing experience. We didn&apos;t just
                  learn a craft, we connected with the soul of Rwanda. Highly
                  recommended for any visitor!&rdquo;
                </blockquote>
                <cite className="not-italic block font-display font-bold text-xs uppercase tracking-button text-amber">
                  &mdash; Sarah &amp; David, USA
                </cite>
              </div>

              <div className="pt-2">
                <a
                  href={siteConfig.externalLinks.shop}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-display font-bold text-sm uppercase tracking-button text-amber hover:text-amber-300 transition-colors"
                >
                  <span>Explore the artisan store</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            5. GALLERY: Moments from Our Sessions (6 Photo Slots)
           ======================================================== */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 max-w-content mx-auto text-left space-y-12">
          <div className="space-y-2">
            <Eyebrow>PHOTO DOCUMENTARY</Eyebrow>
            <SectionHeading
              level="h2"
              title="Moments from *Our Sessions*"
            />
            <p className="font-sans text-sm md:text-base text-sand-primary max-w-xl">
              Real scenes from our studio at Kigali Culture Village. Click any photo
              to view details and workshop context.
            </p>
          </div>

          <GalleryGrid items={galleryItems} />
        </section>

        {/* ========================================================
            6. PLAN YOUR VISIT: Location, Schedule & Final CTA
           ======================================================== */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-brown-850 border-t border-amber-400/20 text-left">
          <div className="max-w-content mx-auto space-y-10">
            <div className="space-y-2">
              <Eyebrow>LOCATION &amp; SCHEDULE</Eyebrow>
              <SectionHeading
                level="h2"
                title="Plan Your *Visit*"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Where and When Details */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-display font-bold text-xs uppercase tracking-eyebrow text-amber">
                    — Studio Address
                  </h3>
                  <p className="font-sans text-base sm:text-lg text-sand-bright leading-snug">
                    Kigali Culture Village (Agaseke Center building), Rebero,
                    Kicukiro, near CANAL Olympia.
                  </p>
                  <p className="font-sans text-xs text-sand-muted">
                    Street KK 557 St, Kigali, Rwanda. Free on-site parking available.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-display font-bold text-xs uppercase tracking-eyebrow text-amber">
                    — Daily Schedule
                  </h3>
                  <p className="font-sans text-base sm:text-lg text-sand-bright leading-snug">
                    Sessions at 10:00am and 4:00pm, every day.
                  </p>
                  <p className="font-sans text-xs text-sand-muted">
                    Open Monday through Sunday. Advance reservation recommended.
                  </p>
                </div>

                <div className="pt-2">
                  <a
                    href="https://maps.google.com/?q=Kigali+Culture+Village+Rebero+Kicukiro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-display font-bold text-xs sm:text-sm uppercase tracking-button text-amber hover:text-amber-300 transition-colors"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Open in Google Maps</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Final CTA Box */}
              <div className="p-8 rounded-card bg-brown-900 border border-amber-400/30 space-y-5 shadow-warm-low">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-sand-bright">
                  Ready to Book Your Session?
                </h3>
                <p className="font-sans text-sm sm:text-base text-sand-primary leading-relaxed">
                  Select your craft, preferred date, and morning or afternoon slot.
                  All tools, natural pigments, and guided instruction are included.
                </p>
                <div className="pt-2">
                  <Button
                    onClick={() => openBooking()}
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Book a workshop
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Global Booking Drawer (pre-selects chosen workshop) */}
      <BookingDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        initialWorkshopSlug={selectedWorkshop}
      />

      {/* Mobile Sticky Booking Bar */}
      <StickyBookBar
        workshopName="Cultural Workshops"
        priceRwf={25000}
        onBookClick={() => openBooking()}
      />

      <Footer />
    </div>
  );
}
