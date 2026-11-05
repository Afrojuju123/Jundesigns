import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { SectionHeading } from "@/components/atoms/SectionHeading";

export const metadata: Metadata = {
  title: "Returns, Refunds & Rescheduling | Jun Designs Kigali",
  description:
    "Official policies regarding workshop cancellations, session rescheduling, artisan store returns, and defective handcrafted goods at Jun Designs in Kigali, Rwanda.",
  openGraph: {
    title: "Returns & Rescheduling Policies | Jun Designs",
    description: "Workshop rescheduling policy and artisan shop return guidelines.",
  },
};

export default function ReturnsExchangesPage() {
  return (
    <div className="bg-brown-900 text-sand-primary text-left min-h-screen">
      {/* 1. HERO HEADER */}
      <section className="px-4 sm:px-6 lg:px-8 pt-16 pb-12 md:pt-20 md:pb-16 border-b border-amber-400/20 max-w-content mx-auto">
        <div className="max-w-3xl space-y-4">
          <Eyebrow>POLICIES &bull; JUN DESIGNS LTD</Eyebrow>
          <SectionHeading
            level="h1"
            title="Returns &amp; *Rescheduling*"
          />
          <p className="font-sans text-sm sm:text-base text-sand-primary leading-relaxed pt-2">
            Clear guidelines on how workshop cancellations, date changes, and physical artisan product purchases are handled at Jun Designs.
          </p>
        </div>
      </section>

      {/* 2. MAIN POLICY SECTIONS */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-4xl mx-auto space-y-8">
        <article className="bg-brown-950 rounded-hero p-6 sm:p-10 border border-amber-400/25 space-y-8 shadow-warm-low">
          
          {/* Section 1: Workshop Cancellations & Rescheduling */}
          <div className="space-y-4">
            <span className="font-display text-xs font-bold uppercase tracking-eyebrow text-amber block">
              PART A &bull; CULTURAL WORKSHOPS
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-sand-bright">
              Workshop Cancellation &amp; Reschedule Policy
            </h2>
            <div className="p-5 rounded-card bg-brown-900 border border-amber-400/25 space-y-2">
              <p className="font-sans text-sm leading-relaxed text-sand-primary">
                Free cancellation and full reschedule up to 48 hours before your session starts. Cancellations within 48 hours are non-refundable, but we will happily reschedule to another available slot whenever possible. To cancel or change dates, call or WhatsApp +250 780 324 944.
              </p>
            </div>
            <ul className="list-disc pl-5 text-xs sm:text-sm text-sand-muted space-y-1.5 pt-1">
              <li><strong>More than 48 hours notice:</strong> 100% full refund or free transfer to any available date and time slot within 90 days.</li>
              <li><strong>Less than 48 hours notice:</strong> Non-refundable due to instructor reservation and prepared materials, but our team will make every reasonable effort to accommodate you in another open session during your stay in Kigali.</li>
              <li><strong>Inclement weather or studio emergencies:</strong> In the rare event an outdoor terrace session must be modified due to weather, an equivalent covered studio session will proceed or you will be offered a full refund/free reschedule.</li>
            </ul>
          </div>

          {/* Section 2: Physical Artisan Store Returns */}
          <div className="space-y-4 pt-6 border-t border-amber-400/15">
            <span className="font-display text-xs font-bold uppercase tracking-eyebrow text-amber block">
              PART B &bull; ARTISAN SHOP &amp; HANDCRAFTED ITEMS
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-sand-bright">
              Physical Handcrafted Goods &amp; Decor
            </h2>

            {/* Legal Placeholder */}
            <div className="space-y-3 p-6 rounded-card border border-dashed border-amber-400/35 bg-brown-900/60">
              <div className="flex items-center gap-2 text-amber font-mono text-xs font-bold uppercase tracking-wider">
                <span>[LEGAL TEXT NEEDED &mdash; PHYSICAL GOODS RETURN WINDOW]</span>
              </div>
              <h3 className="font-serif text-lg font-semibold text-sand-bright">
                Artisan Shop Return Window &amp; Condition of Goods
              </h3>
              <p className="font-sans text-xs sm:text-sm text-sand-muted leading-relaxed">
                [LEGAL TEXT NEEDED: Specific policies governing physical items purchased in the Kigali showroom or online shop: return timeframe (e.g. 14 days), proof of purchase requirements, non-refundable custom-made bespoke furniture or tailored decor items, and international shipping return fees.]
              </p>
            </div>

            {/* Damaged or Defective Handcrafted Goods */}
            <div className="space-y-3 p-6 rounded-card border border-dashed border-amber-400/35 bg-brown-900/60">
              <div className="flex items-center gap-2 text-amber font-mono text-xs font-bold uppercase tracking-wider">
                <span>[LEGAL TEXT NEEDED &mdash; DAMAGED / TRANSIT CLAIMS]</span>
              </div>
              <h3 className="font-serif text-lg font-semibold text-sand-bright">
                Transit Damage &amp; Defective Items
              </h3>
              <p className="font-sans text-xs sm:text-sm text-sand-muted leading-relaxed">
                [LEGAL TEXT NEEDED: Process for reporting items damaged during air transit or courier transport, time window for photographic evidence, and replacement/repair procedures.]
              </p>
            </div>
          </div>

          {/* Section 3: How to Request Assistance */}
          <div className="space-y-3 pt-6 border-t border-amber-400/15">
            <h3 className="font-serif text-lg font-bold text-sand-bright">
              How to Request a Cancellation or Return
            </h3>
            <p className="font-sans text-xs sm:text-sm text-sand-primary leading-relaxed">
              To initiate a reschedule, cancellation, or return inquiry:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
              <div className="p-4 rounded bg-brown-900 border border-amber-400/20">
                <span className="font-display uppercase tracking-wider font-bold text-amber block mb-1">
                  By Phone or WhatsApp
                </span>
                <p className="text-sand-bright font-mono">+250 780 324 944</p>
                <p className="text-sand-muted mt-0.5">Please quote your booking reference (JUN-2026-XXXX).</p>
              </div>

              <div className="p-4 rounded bg-brown-900 border border-amber-400/20">
                <span className="font-display uppercase tracking-wider font-bold text-amber block mb-1">
                  By Email
                </span>
                <p className="text-sand-bright font-mono">info@jundesigns.rw</p>
                <p className="text-sand-muted mt-0.5">Include your full name and order details.</p>
              </div>
            </div>
          </div>

        </article>
      </section>
    </div>
  );
}
