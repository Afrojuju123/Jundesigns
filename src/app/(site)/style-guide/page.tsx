"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { Button } from "@/components/atoms/Button";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { SectionHeading } from "@/components/atoms/SectionHeading";
import { ImageSlot } from "@/components/atoms/ImageSlot";
import { FormField } from "@/components/atoms/FormField";
import { Toast } from "@/components/atoms/Toast";
import { FactList } from "@/components/molecules/FactList";
import { Callout } from "@/components/molecules/Callout";
import { Testimonial } from "@/components/molecules/Testimonial";
import { StickyBookBar } from "@/components/molecules/StickyBookBar";
import { GalleryGrid } from "@/components/organisms/GalleryGrid";
import { workshops } from "@/content/workshops";
import { testimonials } from "@/content/testimonials";
import { ArrowRight, Sparkles, Check, Info } from "lucide-react";

export default function StyleGuidePage() {
  const [toastVisible, setToastVisible] = useState(false);
  const [loadingButtonActive, setLoadingButtonActive] = useState(false);

  const toggleLoading = () => {
    setLoadingButtonActive(true);
    setTimeout(() => setLoadingButtonActive(false), 2000);
  };

  const sampleGalleryItems = workshops[0].gallery.map(
    (item, index) => ({
      id: `gallery-${index}`,
      title: item.title,
      description: item.description,
      src: item.src,
      aspectRatio: item.aspectRatio,
    })
  );

  return (
    <div className="min-h-screen bg-brown-900 text-sand flex flex-col">
      <Header onBookClick={() => setToastVisible(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-content mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-20 text-left">
        {/* Style Guide Header */}
        <section className="space-y-4 pb-8 border-b border-amber-400/20">
          <Eyebrow>— DESIGN SYSTEM LABORATORY</Eyebrow>
          <SectionHeading level="h1" title="Jun Designs *Tokens & Components*" />
          <p className="font-sans text-base md:text-lg text-sand-primary max-w-2xl leading-relaxed">
            This living style guide verifies all typography clamps, WCAG AA color
            contrasts, border styles, and atomic components built for the Jun
            Designs cultural workshop platform.
          </p>
        </section>

        {/* 1. Color Palette & WCAG AA Tokens */}
        <section className="space-y-6">
          <div className="space-y-1">
            <Eyebrow>— 01. COLOR TOKENS & CONTRAST</Eyebrow>
            <SectionHeading level="h2" title="Warm Rwandan *Earth & Amber*" />
            <p className="text-sm text-sand-muted max-w-xl">
              Amber is the only saturated accent, reserved strictly for calls-to-action
              and italic typographic emphasis. One muted brick red is reserved for errors.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Deep Canvas */}
            <div className="rounded-card p-5 bg-brown-900 border border-amber-400/20 space-y-3">
              <div className="h-16 w-full rounded-input bg-brown-900 border border-amber-400/30 flex items-center justify-center">
                <span className="font-mono text-xs text-sand-bright">#1F1209</span>
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-sand-bright uppercase">
                  Base Canvas
                </h4>
                <p className="text-xs text-sand-muted">`--color-bg-deep`</p>
                <span className="inline-block mt-2 text-[11px] font-mono text-amber">
                  Root background
                </span>
              </div>
            </div>

            {/* Main Surface */}
            <div className="rounded-card p-5 bg-brown-800 border border-amber-400/20 space-y-3">
              <div className="h-16 w-full rounded-input bg-brown-800 border border-amber-400/30 flex items-center justify-center">
                <span className="font-mono text-xs text-sand-bright">#2D1A0D</span>
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-sand-bright uppercase">
                  Main Section
                </h4>
                <p className="text-xs text-sand-muted">`--color-bg-main`</p>
                <span className="inline-block mt-2 text-[11px] font-mono text-amber">
                  Section default
                </span>
              </div>
            </div>

            {/* Card Panel Surface */}
            <div className="rounded-card p-5 bg-brown-700 border border-amber-400/20 space-y-3">
              <div className="h-16 w-full rounded-input bg-brown-700 border border-amber-400/30 flex items-center justify-center">
                <span className="font-mono text-xs text-sand-bright">#3A2311</span>
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-sand-bright uppercase">
                  Panel Surface
                </h4>
                <p className="text-xs text-sand-muted">`--color-bg-panel`</p>
                <span className="inline-block mt-2 text-[11px] font-mono text-amber">
                  Cards & drawer
                </span>
              </div>
            </div>

            {/* Primary Amber */}
            <div className="rounded-card p-5 bg-brown-850 border border-amber-400/30 space-y-3">
              <div className="h-16 w-full rounded-input bg-amber text-brown-900 font-bold flex items-center justify-center">
                <span className="font-mono text-xs">#F29C1F</span>
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-sand-bright uppercase">
                  Primary Amber
                </h4>
                <p className="text-xs text-sand-muted">`--color-amber-primary`</p>
                <span className="inline-block mt-2 text-[11px] font-mono text-amber">
                  8.31:1 (WCAG AAA)
                </span>
              </div>
            </div>

            {/* Secondary Bronze */}
            <div className="rounded-card p-5 bg-brown-850 border border-amber-400/20 space-y-3">
              <div className="h-16 w-full rounded-input bg-[#B8956A] text-brown-900 font-bold flex items-center justify-center">
                <span className="font-mono text-xs">#B8956A</span>
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-sand-bright uppercase">
                  Secondary Bronze
                </h4>
                <p className="text-xs text-sand-muted">`--color-amber-bronze`</p>
                <span className="inline-block mt-2 text-[11px] font-mono text-amber">
                  6.54:1 (WCAG AA)
                </span>
              </div>
            </div>

            {/* Cream Heading Text */}
            <div className="rounded-card p-5 bg-brown-850 border border-amber-400/20 space-y-3">
              <div className="h-16 w-full rounded-input bg-[#FFF8F0] text-brown-900 font-bold flex items-center justify-center">
                <span className="font-mono text-xs">#FFF8F0</span>
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-sand-bright uppercase">
                  Cream Ivory
                </h4>
                <p className="text-xs text-sand-muted">`--color-text-bright`</p>
                <span className="inline-block mt-2 text-[11px] font-mono text-amber">
                  17.36:1 (WCAG AAA)
                </span>
              </div>
            </div>

            {/* Sand Body Text */}
            <div className="rounded-card p-5 bg-brown-850 border border-amber-400/20 space-y-3">
              <div className="h-16 w-full rounded-input bg-[#C9B8A4] text-brown-900 font-bold flex items-center justify-center">
                <span className="font-mono text-xs">#C9B8A4</span>
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-sand-bright uppercase">
                  Sand Body
                </h4>
                <p className="text-xs text-sand-muted">`--color-text-body`</p>
                <span className="inline-block mt-2 text-[11px] font-mono text-amber">
                  8.60:1 (WCAG AAA)
                </span>
              </div>
            </div>

            {/* Error Terracotta */}
            <div className="rounded-card p-5 bg-brown-850 border border-brick/40 space-y-3">
              <div className="h-16 w-full rounded-input bg-brick text-brown-900 font-bold flex items-center justify-center">
                <span className="font-mono text-xs">#E06D53</span>
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-brick uppercase">
                  Error Brick Red
                </h4>
                <p className="text-xs text-sand-muted">`--color-error`</p>
                <span className="inline-block mt-2 text-[11px] font-mono text-brick">
                  5.12:1 (WCAG AA)
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Typography Scale */}
        <section className="space-y-6">
          <div className="space-y-1">
            <Eyebrow>— 02. FLUID TYPOGRAPHY SCALE</Eyebrow>
            <SectionHeading level="h2" title="Cormorant Garamond & *Outfit*" />
            <p className="text-sm text-sand-muted max-w-xl">
              Signature typographic device: Bold serif headings with the emphasised
              word(s) in italic amber. Loaded via Google Fonts, display swap, Latin subset.
            </p>
          </div>

          <div className="rounded-card bg-brown-850 border border-amber-400/20 p-6 md:p-8 space-y-8">
            <div className="space-y-2 border-b border-amber-400/15 pb-6">
              <span className="font-mono text-xs text-amber block">
                H1 &bull; clamp(3.5rem, 6vw + 1rem, 6rem) [56px - 96px]
              </span>
              <SectionHeading level="h1" title="Moments from *Our Sessions*" />
            </div>

            <div className="space-y-2 border-b border-amber-400/15 pb-6">
              <span className="font-mono text-xs text-amber block">
                H2 &bull; clamp(2.25rem, 3.5vw + 0.5rem, 3.5rem) [36px - 56px]
              </span>
              <SectionHeading
                level="h2"
                title="Preserving Heritage Through *Hands-on Craft*"
              />
            </div>

            <div className="space-y-2 border-b border-amber-400/15 pb-6">
              <span className="font-mono text-xs text-amber block">
                H3 &bull; clamp(1.375rem, 1.5vw + 0.5rem, 1.75rem) [22px - 28px]
              </span>
              <SectionHeading
                level="h3"
                title="Daily Morning & *Afternoon Slots*"
              />
            </div>

            <div className="space-y-2 border-b border-amber-400/15 pb-6">
              <span className="font-mono text-xs text-amber block">
                Body &bull; 1.125rem (18px) / 1.65 line-height / max-w 62ch
              </span>
              <p className="font-sans text-sand text-lg leading-[1.65]">
                Traditional Imigongo art originated in the eastern Gisaka kingdom of
                Rwanda during the 18th century. Local craftswomen blend organic ash
                paste to shape raised geometric reliefs onto solid wooden boards,
                curing and finishing each piece with mineral soot, kaolin clay, and
                rich red earth pigments.
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-mono text-xs text-amber block">
                Eyebrows &bull; 13px uppercase / 0.2em tracking / leading rule
              </span>
              <div className="flex flex-wrap gap-6 items-center">
                <Eyebrow>— PLAN YOUR VISIT</Eyebrow>
                <Eyebrow>— KIGALI CULTURE VILLAGE</Eyebrow>
                <Eyebrow>— 2-HOUR CULTURAL WORKSHOP</Eyebrow>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Buttons & Interaction States */}
        <section className="space-y-6">
          <div className="space-y-1">
            <Eyebrow>— 03. BUTTONS & INTERACTION STATES</Eyebrow>
            <SectionHeading level="h2" title="Action *Hierarchy & States*" />
            <p className="text-sm text-sand-muted max-w-xl">
              Primary = amber fill, 52px tall, pill, dark brown uppercase text.
              Secondary = 1px amber outline. Tertiary = arrow text link.
            </p>
          </div>

          <div className="rounded-card bg-brown-850 border border-amber-400/20 p-6 md:p-8 space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <Button onClick={() => setToastVisible(true)}>
                Primary Button
              </Button>

              <Button variant="secondary" onClick={() => setToastVisible(true)}>
                Secondary Outline
              </Button>

              <Button
                variant="primary"
                isLoading={loadingButtonActive}
                loadingText="Reserving slot..."
                onClick={toggleLoading}
              >
                {loadingButtonActive ? "Reserving..." : "Click For Loading State"}
              </Button>

              <Button disabled variant="primary">
                Disabled Action
              </Button>

              <Button
                variant="tertiary"
                rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
              >
                View Workshop Details
              </Button>
            </div>

            <div className="pt-4 border-t border-amber-400/15">
              <span className="font-mono text-xs text-sand-muted">
                Toast feedback trigger: Click buttons above to trigger notification.
              </span>
            </div>
          </div>
        </section>

        {/* 4. Form Fields & Validation */}
        <section className="space-y-6">
          <div className="space-y-1">
            <Eyebrow>— 04. FORM FIELDS & ACCESSIBILITY</Eyebrow>
            <SectionHeading level="h2" title="Input Fields & *Validation*" />
            <p className="text-sm text-sand-muted max-w-xl">
              Dark surface inputs, 8px radius, 1px amber border on focus, with muted
              brick red (`#E06D53`) for validation alerts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 rounded-card bg-brown-850 border border-amber-400/20 p-6 md:p-8">
            <FormField
              label="Full Name"
              placeholder="e.g. Sarah Jenkins"
              helperText="As listed on your travel ID"
              required
            />

            <FormField
              label="WhatsApp Phone"
              placeholder="+250 780 000 000"
              helperText="Include country code for visit directions"
              required
            />

            <FormField
              label="Email Address"
              defaultValue="invalid-email"
              errorMessage="Please enter a valid email to receive booking voucher"
              required
            />
          </div>
        </section>

        {/* 5. Image Slot Component */}
        <section className="space-y-6">
          <div className="space-y-1">
            <Eyebrow>— 05. IMAGE SLOTS & RATIOS</Eyebrow>
            <SectionHeading level="h2" title="Fixed Ratio *Photo Placeholders*" />
            <p className="text-sm text-sand-muted max-w-xl">
              Clearly labelled flat brown placeholder blocks with explicit ratios,
              never generic stock imagery or blurred blobs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ImageSlot
              alt="Imigongo relief sculpting with ash paste"
              label="Imigongo Relief Sculpting"
              aspectRatio="4/3"
            />
            <ImageSlot
              alt="Traditional Intore warrior dance footwork"
              label="Intore Dance Footwork"
              aspectRatio="1/1"
            />
            <ImageSlot
              alt="Sisal fiber coiling around sweet grass"
              label="Sisal Agaseke Weaving"
              aspectRatio="3/4"
            />
            <ImageSlot
              alt="Carved 16-pit wooden Igisoro board game"
              label="16-Pit Igisoro Board"
              aspectRatio="16/9"
            />
          </div>
        </section>

        {/* 6. Fact List & Callouts */}
        <section className="space-y-6">
          <div className="space-y-1">
            <Eyebrow>— 06. FACT LISTS & CALLOUTS</Eyebrow>
            <SectionHeading level="h2" title="Structured *Visit Specifications*" />
            <p className="text-sm text-sand-muted max-w-xl">
              Clean tabular presentation for foreign visitors comparing workshop logistics.
            </p>
          </div>

          <div className="space-y-6">
            <FactList
              columns={3}
              items={[
                {
                  label: "Price per Guest",
                  value: "25,000 RWF (~$18 USD)",
                  hint: "Includes all materials, tools & take-home piece",
                },
                {
                  label: "Session Duration",
                  value: "2 Hours (120 min)",
                  hint: "Daily morning (10:00) & afternoon (16:00) slots",
                },
                {
                  label: "Studio Location",
                  value: "Rebero, Kigali",
                  hint: "Kigali Culture Village, Street KK 557 St",
                },
              ]}
            />

            <Callout title="STUDIO HYGIENE & APRONS">
              All natural pigments and organic pastes used during our Imigongo and
              weaving workshops are thoroughly cured, clean, and odorless.
              Complimentary cotton studio aprons are provided to protect your clothing.
            </Callout>
          </div>
        </section>

        {/* 7. Gallery Grid with Modal Lightbox */}
        <section className="space-y-6">
          <div className="space-y-1">
            <Eyebrow>— 07. INTERACTIVE GALLERY & LIGHTBOX</Eyebrow>
            <SectionHeading level="h2" title="Workshop *Documentation Archive*" />
            <p className="text-sm text-sand-muted max-w-xl">
              Click any slot to trigger the keyboard-accessible modal lightbox.
            </p>
          </div>

          <GalleryGrid items={sampleGalleryItems} />
        </section>

        {/* 8. Authentic Testimonial Cards */}
        <section className="space-y-6">
          <div className="space-y-1">
            <Eyebrow>— 08. VISITOR TESTIMONIALS</Eyebrow>
            <SectionHeading level="h2" title="Feedback from *Real Travelers*" />
            <p className="text-sm text-sand-muted max-w-xl">
              Authentic guest feedback with verified country of origin, no invented facts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.slice(0, 2).map((testimonial) => (
              <Testimonial key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </section>

        {/* 9. Mobile Sticky Booking Bar Preview */}
        <section className="space-y-4 pt-4 border-t border-amber-400/20">
          <div className="space-y-1">
            <Eyebrow>— 09. MOBILE STICKY BOOKING BAR</Eyebrow>
            <SectionHeading level="h3" title="Mobile Phone *Conversion Device*" />
            <p className="text-sm text-sand-muted max-w-xl">
              Fixed to the viewport bottom on mobile devices (`md:hidden`) with 44px
              touch target button.
            </p>
          </div>

          <div className="p-4 rounded-card bg-brown-850 border border-amber-400/20 max-w-md">
            <div className="flex items-center justify-between gap-3">
              <div className="text-left">
                <span className="font-display text-[11px] font-semibold uppercase tracking-eyebrow text-sand-muted block">
                  Imigongo Painting
                </span>
                <span className="font-sans font-bold text-base text-sand-bright">
                  25,000 RWF
                  <span className="text-xs font-normal text-sand-muted ml-1">
                    / person
                  </span>
                </span>
              </div>
              <Button size="sm" onClick={() => setToastVisible(true)}>
                Book Session
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Toast Notification */}
      {toastVisible && (
        <div className="fixed bottom-6 right-6 z-50 animate-reveal">
          <Toast
            type="success"
            title="Booking Drawer Triggered"
            message="The global booking drawer will open pre-selecting the session for the traveler."
            onClose={() => setToastVisible(false)}
          />
        </div>
      )}

      {/* Sticky Book Bar (visible on mobile viewports) */}
      <StickyBookBar
        workshopName="Imigongo Painting"
        priceRwf={25000}
        onBookClick={() => setToastVisible(true)}
      />

      <Footer />
    </div>
  );
}
