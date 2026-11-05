import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { SectionHeading } from "@/components/atoms/SectionHeading";
import { siteConfig } from "@/content/site";
import { Users, HeartHandshake, ShieldCheck, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About Jun Designs | Rwandan Craft & Cultural Preservation | Kigali",
  description:
    "Jun Designs preserves and shares Rwandan craft. Our workshops are led by local artisans, and what you pay supports them directly. Located at Kigali Culture Village on Rebero hill.",
  openGraph: {
    title: "About Jun Designs | Rwandan Craft & Culture",
    description:
      "Jun Designs preserves and shares Rwandan craft. Our workshops are led by local artisans, and what you pay supports them directly.",
  },
};

export default function CompanyPage() {
  return (
    <main className="bg-brown-900 text-sand-primary text-left min-h-screen">
      {/* 1. HERO HEADER */}
      <section className="px-4 sm:px-6 lg:px-8 pt-16 pb-12 md:pt-20 md:pb-16 border-b border-amber-400/20 max-w-content mx-auto">
        <div className="max-w-3xl space-y-4">
          <Eyebrow>ABOUT JUN DESIGNS &bull; KIGALI, RWANDA</Eyebrow>
          <SectionHeading
            level="h1"
            title="Preserving Craft, *Supporting Artisans.*"
          />
          <p className="font-sans text-lg sm:text-xl text-sand-bright leading-relaxed pt-2">
            Jun Designs preserves and shares Rwandan craft. Our workshops are led by local artisans, and what you pay supports them directly.
          </p>
        </div>
      </section>

      {/* 2. THE STORY & PROMISE */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-content mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <Eyebrow>OUR MISSION</Eyebrow>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-sand-bright">
              Living Heritage, Not a Museum Piece
            </h2>
            <p className="font-sans text-base sm:text-lg text-sand-primary leading-relaxed">
              Jun Designs preserves and shares Rwandan craft. Our workshops are led by local artisans, and what you pay supports them directly.
            </p>
            <p className="font-sans text-base text-sand-primary leading-relaxed">
              We are dedicated to safeguarding Rwanda&apos;s beautiful cultural practices. By joining our workshops or shopping our artisan collections, you directly support local craftsmen and keep these ancient traditions alive.
            </p>

            <div className="pt-2 border-t border-amber-400/15 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-card bg-brown-950 border border-amber-400/20 space-y-1">
                <HeartHandshake className="w-5 h-5 text-amber mb-2 stroke-[1.5]" />
                <h4 className="font-serif text-sm font-bold text-sand-bright">Direct Support</h4>
                <p className="text-xs text-sand-muted">Session fees go directly to our resident guides and master artisans.</p>
              </div>

              <div className="p-4 rounded-card bg-brown-950 border border-amber-400/20 space-y-1">
                <ShieldCheck className="w-5 h-5 text-amber mb-2 stroke-[1.5]" />
                <h4 className="font-serif text-sm font-bold text-sand-bright">Authentic Materials</h4>
                <p className="text-xs text-sand-muted">Natural volcanic minerals, sisal fiber, and timber sourced in Rwanda.</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] rounded-hero overflow-hidden border border-amber-400/30 shadow-warm-low">
              <Image
                src="/images/imigongo-easel-kigali.jpg"
                alt="Jun Designs studio overlooking Kigali"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUNDER'S STORY PLACEHOLDER (CLEARLY MARKED) */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 max-w-content mx-auto">
        <div className="border border-dashed border-amber-400/40 bg-brown-950/70 rounded-hero p-8 sm:p-12 text-center space-y-4">
          <span className="font-mono text-xs uppercase tracking-wider text-amber font-bold block">
            [SLOT FOR FOUNDER&apos;S STORY &mdash; CONTENT PLACEHOLDER]
          </span>
          <h3 className="font-serif text-2xl font-semibold text-sand-bright">
            Founder Background &amp; Founding Story
          </h3>
          <p className="font-sans text-sm sm:text-base text-sand-muted max-w-2xl mx-auto leading-relaxed">
            This space is reserved for the founder&apos;s personal narrative detailing the origins of Jun Designs in Kigali, the inspiration behind our studio on Rebero hill, and our commitment to preserving Rwandan artistic heritage.
          </p>
          <div className="pt-2">
            <span className="inline-block text-xs font-mono text-sand-muted/70 bg-brown-900 px-3 py-1 rounded border border-amber-400/15">
              Target word count: 180&ndash;250 words
            </span>
          </div>
        </div>
      </section>

      {/* 4. TEAM PHOTO PLACEHOLDER (CLEARLY MARKED) */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 max-w-content mx-auto">
        <div className="border border-dashed border-amber-400/40 bg-brown-950/70 rounded-hero p-8 sm:p-14 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-amber/15 border border-amber text-amber flex items-center justify-center mx-auto mb-2">
            <Users className="w-6 h-6 stroke-[1.5]" />
          </div>
          <span className="font-mono text-xs uppercase tracking-wider text-amber font-bold block">
            [SLOT FOR TEAM PHOTO &mdash; VISUAL PLACEHOLDER]
          </span>
          <h3 className="font-serif text-2xl font-semibold text-sand-bright">
            Our Artisans &amp; Studio Guides
          </h3>
          <p className="font-sans text-sm text-sand-muted max-w-xl mx-auto leading-relaxed">
            A high-resolution landscape portrait of our master painters, sisal weavers, dancers, and cultural guides gathered at the Kigali Culture Village studio overlooking the hills.
          </p>
          <div className="pt-2">
            <span className="inline-block text-xs font-mono text-sand-muted/70 bg-brown-900 px-3 py-1 rounded border border-amber-400/15">
              Recommended dimensions: 1600 &times; 900 (16:9 ratio)
            </span>
          </div>
        </div>
      </section>

      {/* 5. VISIT CTA STRIP */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 border-t border-amber-400/20 max-w-content mx-auto">
        <div className="bg-brown-950 p-8 sm:p-10 rounded-hero border border-amber-400/25 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="font-serif text-2xl font-bold text-sand-bright">
              Experience the Crafts Yourself
            </h3>
            <p className="font-sans text-sm text-sand-primary">
              Sessions run every day at 10:00am and 4:00pm. All materials and guides provided.
            </p>
          </div>
          <Link
            href="/workshops"
            className="inline-flex items-center gap-2 h-12 px-6 rounded-button font-display text-xs font-bold uppercase tracking-button bg-amber text-brown-950 hover:bg-amber-400 transition-colors shrink-0"
          >
            <span>Explore All Workshops</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
