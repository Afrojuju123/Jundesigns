"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, GraduationCap, CheckCircle2 } from "lucide-react";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { SectionHeading } from "@/components/atoms/SectionHeading";
import { SchoolsHero } from "@/components/organisms/schools/SchoolsHero";
import { SchoolsActivities } from "@/components/organisms/schools/SchoolsActivities";
import { SchoolsPackagesMatrix } from "@/components/organisms/schools/SchoolsPackagesMatrix";
import { SchoolsEstimator } from "@/components/organisms/schools/SchoolsEstimator";
import { SchoolsFaq } from "@/components/organisms/schools/SchoolsFaq";

const howItWorksSteps = [
  {
    step: "01",
    title: "Select Package or Needs",
    description: "Choose from our Bronze, Silver, or Gold packages, or outline custom activities for your grade level or curriculum goals.",
  },
  {
    step: "02",
    title: "Request a Formal Quote",
    description: "Share your student count, preferred dates, and any special timetable requirements via our estimator or quote form.",
  },
  {
    step: "03",
    title: "Confirm & Receive Invoice",
    description: "We verify artisan station capacity, confirm your session date, and issue an official pro-forma invoice for school administration.",
  },
  {
    step: "04",
    title: "Visit Rebero Hill",
    description: "Bring your students to Kigali Culture Village. Our master artisans guide each station, and students take home their hand-painted Imigongo boards.",
  },
];

export const SchoolsPageClient: React.FC = () => {
  return (
    <div className="text-left">
      {/* 1. HERO SECTION */}
      <SchoolsHero />

      {/* 2. AUTHENTIC STUDENT PHOTOS PHOTO-BAND */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16 max-w-content mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative aspect-[16/10] rounded-hero overflow-hidden border border-amber-400/25 shadow-warm-low">
            <Image
              src="/images/schools/schools-painting-circle.jpg"
              alt="Students seated in a circle on woven mats learning geometric relief painting"
              fill
              sizes="(max-width: 768px) 100vw, 550px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brown-950/80 via-transparent to-transparent flex items-end p-6">
              <span className="font-display text-xs font-bold uppercase tracking-wider text-sand-bright">
                Tactile Imigongo Painting on Natural Earth Pigments
              </span>
            </div>
          </div>

          <div className="relative aspect-[16/10] rounded-hero overflow-hidden border border-amber-400/25 shadow-warm-low">
            <Image
              src="/images/schools/schools-dance-outdoors.jpg"
              alt="Outdoor traditional Rwandan dance session with students and instructors overlooking Kigali"
              fill
              sizes="(max-width: 768px) 100vw, 550px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brown-950/80 via-transparent to-transparent flex items-end p-6">
              <span className="font-display text-xs font-bold uppercase tracking-wider text-sand-bright">
                Group Dance &amp; Cultural Rhythm on Rebero Hill
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHAT STUDENTS DO (8 ACTIVITIES) */}
      <SchoolsActivities />

      {/* 4. PACKAGES COMPARISON MATRIX (Desktop Table / Mobile Accordion) */}
      <SchoolsPackagesMatrix />

      {/* 5. INTERACTIVE GROUP ESTIMATOR */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 max-w-content mx-auto">
        <SchoolsEstimator />
      </section>

      {/* 6. UNIVERSITIES & CUSTOM PROGRAMMES */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-content mx-auto">
        <div className="rounded-hero bg-brown-950 border border-amber-400/25 p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-warm-low">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-eyebrow text-amber">
              <GraduationCap className="w-4 h-4" />
              <span>Higher Education &bull; Bespoke Curricula</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-sand-bright">
              Universities &amp; Custom Field Study Programmes
            </h2>
            <p className="font-sans text-sm sm:text-base text-sand-primary leading-relaxed max-w-2xl">
              Primary and secondary schools use our standard tiered packages. For university faculties, academic study-abroad groups, and international research delegations, we design custom multi-day schedules combining master lectures on pre-colonial material culture, artisan apprenticeships, and specialized studio workshops.
            </p>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <Link
              href="/schools/request-quote?type=university"
              className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-pill bg-amber text-brown-950 font-display text-xs font-bold uppercase tracking-button hover:bg-amber-400 transition-colors"
            >
              <span>Request University Programme</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. HOW IT WORKS (4 NUMBERED STEPS) */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-brown-800 border-y border-amber-400/20 text-left">
        <div className="max-w-content mx-auto space-y-12">
          <div className="max-w-3xl space-y-3">
            <Eyebrow>HOW BOOKING WORKS</Eyebrow>
            <SectionHeading
              level="h2"
              title="Four Steps to *Your School Visit*"
            />
            <p className="font-sans text-base sm:text-lg text-sand-primary leading-relaxed">
              We make school booking straightforward and fully compliant with institutional accounting requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorksSteps.map((step) => (
              <div
                key={step.step}
                className="rounded-card bg-brown-850 border border-amber-400/20 p-6 space-y-3 shadow-warm-low"
              >
                <div className="font-mono text-3xl font-bold text-amber">
                  {step.step}
                </div>
                <h3 className="font-serif text-lg font-bold text-sand-bright">
                  {step.title}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-sand-primary leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. GOOD TO KNOW, FAQ & FINAL CTA */}
      <div className="pt-8">
        <SchoolsFaq />
      </div>
    </div>
  );
};
