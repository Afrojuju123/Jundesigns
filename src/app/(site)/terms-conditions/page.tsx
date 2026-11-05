import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { SectionHeading } from "@/components/atoms/SectionHeading";

export const metadata: Metadata = {
  title: "Terms & Conditions | Jun Designs Kigali",
  description:
    "Official terms and conditions, booking agreements, and studio policies for cultural workshops and artisan services at Jun Designs LTD in Kigali, Rwanda.",
  openGraph: {
    title: "Terms & Conditions | Jun Designs",
    description: "Terms of service and booking conditions for Jun Designs LTD.",
  },
};

export default function TermsConditionsPage() {
  return (
    <div className="bg-brown-900 text-sand-primary text-left min-h-screen">
      {/* 1. HERO HEADER */}
      <section className="px-4 sm:px-6 lg:px-8 pt-16 pb-12 md:pt-20 md:pb-16 border-b border-amber-400/20 max-w-content mx-auto">
        <div className="max-w-3xl space-y-4">
          <Eyebrow>LEGAL &bull; JUN DESIGNS LTD</Eyebrow>
          <SectionHeading
            level="h1"
            title="Terms &amp; *Conditions*"
          />
          <p className="font-sans text-sm sm:text-base text-sand-primary leading-relaxed pt-2">
            These terms govern bookings, workshop attendance, studio visits, and services provided by Jun Designs LTD in Kigali, Rwanda.
          </p>
          <p className="text-xs font-mono text-sand-muted">
            Last updated: November 2026 &bull; Effective immediately
          </p>
        </div>
      </section>

      {/* 2. TERMS CONTENT */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-4xl mx-auto space-y-12">
        <article className="bg-brown-950 rounded-hero p-6 sm:p-10 border border-amber-400/25 space-y-8 shadow-warm-low">
          
          {/* Section 1: Introduction & Company */}
          <div className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-sand-bright">
              1. General Information
            </h2>
            <p className="font-sans text-sm leading-relaxed text-sand-primary">
              Jun Designs LTD is a cultural workshop provider and artisan furniture design studio legally registered in the Republic of Rwanda. Our studio facilities and workshop sessions are hosted at the Kigali Culture Village (Agaseke Center building), Rebero, Kicukiro, Kigali.
            </p>
          </div>

          {/* Section 2: Workshop Reservations & Capacity */}
          <div className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-sand-bright">
              2. Workshop Reservations &amp; Payment
            </h2>
            <p className="font-sans text-sm leading-relaxed text-sand-primary">
              All workshop reservations must be booked and paid in advance through our authorized booking platform. A booking is confirmed only upon receipt of full payment and issuance of a unique booking reference (e.g., <code>JUN-2026-XXXX</code>). Session rates are 25,000 RWF per participant and include all necessary materials, equipment, and dedicated instructor guidance.
            </p>
          </div>

          {/* Section 3: Authentic Cancellation & Reschedule Policy */}
          <div className="space-y-3 p-5 rounded-card bg-brown-900 border border-amber-400/20">
            <h2 className="font-serif text-xl font-bold text-sand-bright">
              3. Cancellation &amp; Rescheduling Policy
            </h2>
            <p className="font-sans text-sm leading-relaxed text-sand-primary">
              Free cancellation and full reschedule up to 48 hours before your session starts. Cancellations within 48 hours are non-refundable, but we will happily reschedule to another available slot whenever possible. To cancel or change dates, call or WhatsApp +250 780 324 944.
            </p>
          </div>

          {/* Section 4: Arrival & Punctuality */}
          <div className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-sand-bright">
              4. Studio Arrival &amp; Conduct
            </h2>
            <p className="font-sans text-sm leading-relaxed text-sand-primary">
              Participants are kindly requested to arrive at the studio 10 minutes prior to session start time (morning sessions start promptly at 10:00am; afternoon sessions at 4:00pm). If you anticipate being delayed due to traffic or weather on Rebero hill, please notify our team via phone or WhatsApp.
            </p>
          </div>

          {/* Section 5: Legal Terms Needed Placeholder */}
          <div className="space-y-3 p-6 rounded-card border border-dashed border-amber-400/35 bg-brown-900/60">
            <div className="flex items-center gap-2 text-amber font-mono text-xs font-bold uppercase tracking-wider">
              <span>[LEGAL TEXT NEEDED &mdash; LIABILITY &amp; SAFETY]</span>
            </div>
            <h3 className="font-serif text-lg font-semibold text-sand-bright">
              5. Participant Liability &amp; Studio Safety
            </h3>
            <p className="font-sans text-xs sm:text-sm text-sand-muted leading-relaxed">
              [LEGAL TEXT NEEDED: Formal legal liability disclaimers regarding workshop tool usage, mineral pigment handling, outdoor terrace conditions on Rebero hill, personal property on premises, and visitor travel insurance requirements.]
            </p>
          </div>

          {/* Section 6: Intellectual Property Placeholder */}
          <div className="space-y-3 p-6 rounded-card border border-dashed border-amber-400/35 bg-brown-900/60">
            <div className="flex items-center gap-2 text-amber font-mono text-xs font-bold uppercase tracking-wider">
              <span>[LEGAL TEXT NEEDED &mdash; INTELLECTUAL PROPERTY &amp; PHOTOGRAPHY]</span>
            </div>
            <h3 className="font-serif text-lg font-semibold text-sand-bright">
              6. Traditional Patterns &amp; Photography Rights
            </h3>
            <p className="font-sans text-xs sm:text-sm text-sand-muted leading-relaxed">
              [LEGAL TEXT NEEDED: Terms concerning photography taken during public sessions, respect for traditional Rwandan geometric patterns, commercial licensing of completed works, and studio brand copyright.]
            </p>
          </div>

          {/* Section 7: Governing Law Placeholder */}
          <div className="space-y-3 p-6 rounded-card border border-dashed border-amber-400/35 bg-brown-900/60">
            <div className="flex items-center gap-2 text-amber font-mono text-xs font-bold uppercase tracking-wider">
              <span>[LEGAL TEXT NEEDED &mdash; GOVERNING LAW &amp; JURISDICTION]</span>
            </div>
            <h3 className="font-serif text-lg font-semibold text-sand-bright">
              7. Governing Law
            </h3>
            <p className="font-sans text-xs sm:text-sm text-sand-muted leading-relaxed">
              [LEGAL TEXT NEEDED: Jurisdiction clause specifying enforcement under the laws of the Republic of Rwanda and dispute resolution in Kigali courts.]
            </p>
          </div>

          {/* Contact note */}
          <div className="pt-4 border-t border-amber-400/15 text-xs text-sand-muted">
            For questions regarding legal terms or customized corporate agreements, contact{" "}
            <a href="mailto:info@jundesigns.rw" className="text-amber underline">
              info@jundesigns.rw
            </a>.
          </div>

        </article>
      </section>
    </div>
  );
}
