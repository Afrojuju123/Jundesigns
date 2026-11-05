import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { SectionHeading } from "@/components/atoms/SectionHeading";
import { Accordion, AccordionItem } from "@/components/molecules/Accordion";
import { siteConfig } from "@/content/site";
import { Phone, MessageSquare, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Cultural Workshops Kigali | Jun Designs",
  description:
    "Everything you need to know about Jun Designs workshops: session duration, schedules (10am & 4pm daily), pricing (25,000 RWF), what is included, location on Rebero hill, and cancellation policy.",
  openGraph: {
    title: "FAQ | Jun Designs Cultural Workshops",
    description:
      "Clear, plain answers about workshops, pricing, materials, directions to Rebero hill, and cancellation terms.",
  },
};

const faqItems: AccordionItem[] = [
  {
    id: "experience",
    question: "Do I need experience?",
    answer: "No. Every workshop is for beginners, and your guide helps you throughout.",
  },
  {
    id: "duration",
    question: "How long is a session?",
    answer: "Two hours.",
  },
  {
    id: "times",
    question: "What time do sessions start?",
    answer: "10:00am and 4:00pm, every day.",
  },
  {
    id: "cost",
    question: "How much does it cost?",
    answer: (
      <span>
        <strong>25,000 RWF per person</strong> (approx. $18.50 USD). All materials, equipment, and local guide instruction are included with zero hidden fees.
      </span>
    ),
  },
  {
    id: "included",
    question: "What is included?",
    answer: "All materials and a local guide. Each workshop includes a short introduction to Rwandan history and culture.",
  },
  {
    id: "bring",
    question: "What should I bring?",
    answer: "A bottle of water or snacks if you think you will need them, and warm clothes for cool weather.",
  },
  {
    id: "cancellation",
    question: "Can I cancel or reschedule?",
    answer: (
      <span>
        Free cancellation and full reschedule up to 48 hours before your session starts. Cancellations within 48 hours are non-refundable, but we will happily reschedule to another available slot whenever possible. To cancel or change dates, call or WhatsApp <a href="tel:+250780324944" className="text-amber underline font-medium">+250 780 324 944</a>.
      </span>
    ),
  },
  {
    id: "location",
    question: "Where are you?",
    answer: (
      <span>
        Kigali Culture Village (Agaseke Center building), Rebero, Kicukiro. Street KK 557 St, Kigali. Located on Rebero hill overlooking the capital. Drivers readily recognize &ldquo;Kigali Culture Village Rebero&rdquo; or CANAL Olympia nearby.{" "}
        <a
          href="https://maps.google.com/?q=Kigali+Culture+Village+Rebero+Rwanda"
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber underline font-medium inline-flex items-center gap-1"
        >
          Open location in Google Maps &rarr;
        </a>
      </span>
    ),
  },
  {
    id: "groups",
    question: "Can I book for a group?",
    answer: (
      <span>
        Yes. Choose the number of guests when you book. Our standard online booking system accepts up to 8 guests per session. For school groups, university cohorts, or delegations of 25 or more, visit our dedicated{" "}
        <Link href="/schools" className="text-amber underline font-medium">
          Schools &amp; Groups page
        </Link>{" "}
        to explore multi-station cultural packages with tiered volume pricing.
      </span>
    ),
  },
  {
    id: "schools",
    question: "Do you offer workshops for schools and universities?",
    answer: (
      <span>
        Yes. We host primary, secondary, and higher education groups at Kigali Culture Village, Rebero. We offer three structured packages (Bronze, Silver, Gold) covering Imigongo painting, traditional dance, pottery, and blacksmithing, with volume pricing from 4,500 RWF per student. Teachers attend free.{" "}
        <Link href="/schools" className="text-amber underline font-medium">
          See school packages &amp; calculate a quote &rarr;
        </Link>
      </span>
    ),
  },
  {
    id: "payment",
    question: "How do I pay?",
    answer: "Securely online at the time of booking. We accept international credit and debit cards (Visa, Mastercard, American Express) and local mobile money (MTN MoMo, Airtel Money). All online transactions are processed in Rwandan Francs (RWF).",
  },
];

export default function FAQPage() {
  return (
    <div className="bg-brown-900 text-sand-primary text-left min-h-screen">
      {/* 1. HERO HEADER */}
      <section className="px-4 sm:px-6 lg:px-8 pt-16 pb-12 md:pt-20 md:pb-16 border-b border-amber-400/20 max-w-content mx-auto">
        <div className="max-w-3xl space-y-4">
          <Eyebrow>FREQUENTLY ASKED QUESTIONS &bull; KIGALI, RWANDA</Eyebrow>
          <SectionHeading
            level="h1"
            title="Common *Questions*"
          />
          <p className="font-sans text-base sm:text-lg text-sand-primary leading-relaxed pt-2">
            Plain, direct answers about session times, beginner readiness, pricing, materials, directions to Rebero hill, and cancellation terms.
          </p>
        </div>
      </section>

      {/* 2. ACCORDION LIST */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-4xl mx-auto">
        <div className="bg-brown-950 rounded-hero p-6 sm:p-10 border border-amber-400/25 shadow-warm-low">
          <Accordion items={faqItems} defaultOpenIndex={0} allowMultiple={true} />
        </div>
      </section>

      {/* 3. STILL HAVE QUESTIONS CARD */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20 max-w-4xl mx-auto">
        <div className="p-8 rounded-card bg-brown-850 border border-amber-400/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="font-serif text-xl font-bold text-sand-bright">
              Have a question not listed here?
            </h3>
            <p className="font-sans text-xs sm:text-sm text-sand-muted">
              Call or message our studio team directly. We are happy to help you plan your visit.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:+250780324944"
              className="inline-flex items-center gap-1.5 h-11 px-4 rounded-button font-display text-xs font-bold uppercase tracking-button bg-brown-900 text-sand-bright hover:text-amber border border-amber-400/20 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber" />
              <span>+250 780 324 944</span>
            </a>

            <a
              href={siteConfig.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 h-11 px-4 rounded-button font-display text-xs font-bold uppercase tracking-button bg-amber text-brown-950 hover:bg-amber-400 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
