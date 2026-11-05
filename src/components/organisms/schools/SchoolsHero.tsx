import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Users, MapPin, Award, CheckCircle2, ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { SectionHeading } from "@/components/atoms/SectionHeading";

export const SchoolsHero: React.FC = () => {
  return (
    <section className="relative px-4 sm:px-6 lg:px-8 pt-12 md:pt-16 pb-16 lg:pb-24 max-w-content mx-auto text-left">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Eyebrow>SCHOOLS &amp; GROUPS &bull; KIGALI, RWANDA</Eyebrow>

          <SectionHeading
            level="h1"
            title="Hands-on Rwandan Culture for *School Groups*"
          />

          <p className="font-sans text-base sm:text-lg md:text-xl text-sand-primary max-w-2xl leading-relaxed">
            Structured cultural workshops for primary through secondary schools in Kigali. Guided by master Rwandan artisans at Kigali Culture Village, Rebero. Students practise Imigongo relief painting, traditional dance, pottery, and living heritage storytelling.
          </p>

          {/* Quick facts line */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-display uppercase tracking-wider text-sand-muted border-y border-amber-400/20 py-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-amber shrink-0" />
              <span>From 25 Students</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber shrink-0" />
              <span>From 4,500 RWF / Student</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber shrink-0" />
              <span>Rebero Hill, Kigali</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber shrink-0" />
              <span>Teachers Free</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              href="#estimator"
              className="inline-flex items-center justify-center gap-2 h-[52px] px-8 rounded-pill bg-amber text-brown-950 font-display text-xs font-bold uppercase tracking-button hover:bg-amber-400 active:bg-amber-500 shadow-sm transition-all"
            >
              <span>Calculate Group Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="#packages"
              className="inline-flex items-center justify-center h-[52px] px-7 rounded-pill border border-amber-400/60 text-amber font-display text-xs font-bold uppercase tracking-button hover:bg-amber/10 transition-all"
            >
              <span>Compare Packages</span>
            </Link>
          </div>
        </div>

        {/* Right Photo Collage (5 cols) */}
        <div className="lg:col-span-5 relative">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* Image 1: Students painting on veranda */}
            <div className="relative aspect-[4/3] rounded-hero overflow-hidden border border-amber-400/30 shadow-warm-low col-span-2">
              <Image
                src="/images/schools/schools-painting-veranda.jpg"
                alt="School students gathered on the veranda learning traditional Imigongo painting with artisan guides"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 550px"
                className="object-cover"
              />
            </div>

            {/* Image 2: Traditional dance in the thatched pavilion */}
            <div className="relative aspect-square rounded-card overflow-hidden border border-amber-400/25 shadow-warm-low">
              <Image
                src="/images/schools/schools-dance-pavilion.jpg"
                alt="School group practising traditional Rwandan dance steps in the thatched pavilion on Rebero hill"
                fill
                sizes="(max-width: 1024px) 50vw, 250px"
                className="object-cover"
              />
            </div>

            {/* Image 3: Students seated on woven mats */}
            <div className="relative aspect-square rounded-card overflow-hidden border border-amber-400/25 shadow-warm-low">
              <Image
                src="/images/schools/schools-painting-mat.jpg"
                alt="Students seated on traditional woven mats working with earth pigments and geometric relief boards"
                fill
                sizes="(max-width: 1024px) 50vw, 250px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
