"use client";

import React from "react";
import Link from "next/link";
import { Phone, MessageSquare, ArrowRight, ShieldCheck, Clock, MapPin, Users, FileText, Sparkles } from "lucide-react";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { SectionHeading } from "@/components/atoms/SectionHeading";
import { Accordion, AccordionItem } from "@/components/molecules/Accordion";
import { siteConfig } from "@/content/site";

const goodToKnowItems = [
  {
    icon: Clock,
    term: "Session Duration",
    description: "Typically 2 to 3.5 hours depending on the chosen package, activity stations, and group size.",
  },
  {
    icon: MapPin,
    term: "Venue & Setting",
    description: "Agaseke Center building at Kigali Culture Village, Rebero hill. Spacious covered verandas and open-air thatched pavilions.",
  },
  {
    icon: Sparkles,
    term: "All Materials Included",
    description: "Every student receives raw materials, natural earth pigments, tools, and takes home their finished Imigongo relief painting.",
  },
  {
    icon: Users,
    term: "Free Teacher Supervision",
    description: "Teachers, headmasters, and required adult chaperones attend completely free of charge to supervise their students.",
  },
  {
    icon: FileText,
    term: "Invoicing & Payment",
    description: "Official pro-forma invoices provided for school finance offices. Payment accepted via bank transfer, MTN MoMo, or Airtel Money.",
  },
  {
    icon: ShieldCheck,
    term: "Safety & Supervised Stations",
    description: "All craft tools are child-safe. Live forge and blacksmithing demonstrations maintain strict perimeter viewing safety zones.",
  },
];

const schoolsFaqItems: AccordionItem[] = [
  {
    id: "min-size",
    question: "What is the minimum group size?",
    answer:
      "Packages start at 25 students. Groups under 25 are very welcome — contact us directly and we will gladly quote a tailored small-group session or schedule your class into our daily workshop slots.",
  },
  {
    id: "off-site",
    question: "Can you come to our school campus in Kigali?",
    answer:
      "Yes, for select activities within Kigali (such as storytelling, traditional dance, and Imigongo painting). Transport and artisan setup fees apply. Contact us to discuss your campus logistics.",
  },
  {
    id: "teachers",
    question: "Do teachers and adult supervisors pay?",
    answer:
      "No. Accompanying teachers, curriculum coordinators, and adult supervisors attend free of charge to guide and oversee their students.",
  },
  {
    id: "invoicing",
    question: "How does payment and invoicing work for schools?",
    answer:
      "Upon confirming your group size and date, Jun Designs LTD issues an official pro-forma invoice. Payment can be settled via company bank transfer, MTN MoMo Pay, or cash with an official receipt. A deposit confirms your reserved slot.",
  },
  {
    id: "bring",
    question: "What should students bring and wear?",
    answer:
      "Students should wear comfortable school uniforms or sports clothes suitable for gentle movement and sitting on mats. We recommend bringing a personal water bottle. All art materials, paint aprons, and craft tools are provided.",
  },
  {
    id: "large-cohorts",
    question: "Can we split a large cohort (200+ students)?",
    answer:
      "Yes. For very large schools or entire year groups, we can arrange multi-day visits, staggered morning rotations, or simultaneous activity stations across the Agaseke Center facility.",
  },
];

export const SchoolsFaq: React.FC = () => {
  return (
    <div className="space-y-24">
      {/* 1. GOOD TO KNOW DEFINITION LIST */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-brown-800 border-y border-amber-400/20 text-left">
        <div className="max-w-content mx-auto space-y-12">
          <div className="max-w-3xl space-y-3">
            <Eyebrow>VISIT ESSENTIALS</Eyebrow>
            <SectionHeading
              level="h2"
              title="Good to Know Before *Your Visit*"
            />
            <p className="font-sans text-base sm:text-lg text-sand-primary leading-relaxed">
              Practical details to assist teachers and school administration when planning an excursion to Rebero hill.
            </p>
          </div>

          <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {goodToKnowItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.term}
                  className="rounded-card bg-brown-850 border border-amber-400/20 p-6 space-y-3 shadow-warm-low"
                >
                  <dt className="flex items-center gap-2.5 font-serif text-lg font-bold text-sand-bright">
                    <Icon className="w-5 h-5 text-amber shrink-0 stroke-[1.75]" />
                    <span>{item.term}</span>
                  </dt>
                  <dd className="font-sans text-sm text-sand-primary leading-relaxed">
                    {item.description}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </section>

      {/* 2. FREQUENTLY ASKED QUESTIONS */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-left">
        <div className="space-y-8">
          <div className="space-y-3">
            <Eyebrow>COMMONLY ASKED QUESTIONS</Eyebrow>
            <SectionHeading
              level="h2"
              title="Questions from *Teachers &amp; Organisers*"
            />
            <p className="font-sans text-base text-sand-primary leading-relaxed">
              Clear answers regarding bookings, supervision, invoices, and scheduling.
            </p>
          </div>

          <div className="bg-brown-950 rounded-hero p-6 sm:p-10 border border-amber-400/25 shadow-warm-low">
            <Accordion items={schoolsFaqItems} defaultOpenIndex={0} allowMultiple={true} />
          </div>
        </div>
      </section>

      {/* 3. FINAL CTA BAND */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20 max-w-content mx-auto text-left">
        <div className="rounded-hero bg-brown-950 border border-amber-400/30 p-8 sm:p-12 lg:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-warm-low relative overflow-hidden">
          <div className="space-y-3 max-w-2xl relative z-10">
            <span className="font-display text-xs font-bold uppercase tracking-eyebrow text-amber block">
              Plan Your Visit
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-sand-bright">
              Bring Living Rwandan Culture into Your Curriculum
            </h2>
            <p className="font-sans text-sm sm:text-base text-sand-primary leading-relaxed">
              Request a tailored quote for your class or message our coordinators directly on WhatsApp for dates and availability.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0 w-full md:w-auto relative z-10">
            <Link
              href="/schools/request-quote"
              className="inline-flex items-center justify-center gap-2 h-[52px] px-8 rounded-pill bg-amber text-brown-950 font-display text-xs font-bold uppercase tracking-button hover:bg-amber-400 active:bg-amber-500 shadow-sm transition-all"
            >
              <span>Request a Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={siteConfig.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 h-[52px] px-6 rounded-pill border border-amber-400/50 text-amber font-display text-xs font-bold uppercase tracking-button hover:bg-amber/10 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
