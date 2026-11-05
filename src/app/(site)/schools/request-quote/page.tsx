"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Phone, MessageSquare, Mail, ArrowLeft, Users, Package, Calendar } from "lucide-react";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { SectionHeading } from "@/components/atoms/SectionHeading";
import { SCHOOL_PACKAGES, estimateTotal, SCHOOLS_CONTACT_PHONE } from "@/data/schools";
import { siteConfig } from "@/content/site";
import { formatRwf } from "@/lib/utils";

function QuoteStubContent() {
  const searchParams = useSearchParams();
  const studentsParam = searchParams.get("students");
  const packageParam = searchParams.get("package");
  const typeParam = searchParams.get("type");

  const students = studentsParam ? parseInt(studentsParam, 10) : null;
  const selectedPkg = SCHOOL_PACKAGES.find((p) => p.id === packageParam);
  const estimate =
    selectedPkg && students && !isNaN(students) && students >= selectedPkg.minStudents
      ? estimateTotal(selectedPkg.id, students)
      : null;

  const isUniversity = typeParam === "university";

  const whatsappMessage = encodeURIComponent(
    isUniversity
      ? "Hello Jun Designs, I am inquiring about a custom University or higher education cultural programme."
      : selectedPkg && students
      ? `Hello Jun Designs, I would like to request a quote for our school group (${students} students, ${selectedPkg.name} package).`
      : "Hello Jun Designs, I would like to request a quote for a school or group cultural workshop."
  );

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Link
        href="/schools"
        className="inline-flex items-center gap-2 text-xs font-display uppercase tracking-button text-amber hover:text-amber-300 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Schools &amp; Groups</span>
      </Link>

      <div className="space-y-3">
        <Eyebrow>SCHOOLS &amp; GROUPS &bull; QUOTE INQUIRY</Eyebrow>
        <SectionHeading
          level="h1"
          title={isUniversity ? "University *Programme Quote*" : "Request a *School Group Quote*"}
        />
        <p className="font-sans text-sm sm:text-base text-sand-primary leading-relaxed">
          {isUniversity
            ? "We design bespoke Rwandan material culture and heritage studies for higher education faculties and research cohorts."
            : "Bring your students to Kigali Culture Village, Rebero for structured cultural workshops."}
        </p>
      </div>

      {/* Selected Parameters Badge (If arrived from Estimator or Package table) */}
      {(selectedPkg || students || isUniversity) && (
        <div className="rounded-card bg-brown-950 border border-amber-400/25 p-5 space-y-3 shadow-warm-low">
          <span className="font-display text-[11px] font-bold uppercase tracking-eyebrow text-amber block">
            Selected Details from Estimator:
          </span>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-sand-bright">
            {isUniversity ? (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-pill bg-brown-900 border border-amber-400/20">
                Custom University Programme
              </span>
            ) : (
              <>
                {selectedPkg && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-pill bg-brown-900 border border-amber-400/20">
                    <Package className="w-3.5 h-3.5 text-amber" />
                    <span>Package: {selectedPkg.name}</span>
                  </span>
                )}
                {students && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-pill bg-brown-900 border border-amber-400/20">
                    <Users className="w-3.5 h-3.5 text-amber" />
                    <span>{students} Students</span>
                  </span>
                )}
                {estimate && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-pill bg-amber/15 text-amber border border-amber/30 font-bold">
                    <span>Estimated Total: {formatRwf(estimate.total)}</span>
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Step Notice Card */}
      <div className="rounded-hero bg-brown-950 border border-amber-400/30 p-6 sm:p-8 space-y-6 shadow-warm-low">
        <div className="space-y-2">
          <div className="inline-block px-2.5 py-0.5 rounded-pill text-[10px] font-mono font-semibold bg-amber/20 text-amber border border-amber/30 uppercase tracking-wider">
            Quote Form Coming in Step S2
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-sand-bright">
            Connect Directly with Our School Coordinators
          </h2>
          <p className="font-sans text-sm text-sand-primary leading-relaxed">
            Our multi-step institutional quote request form is currently being finalized. In the meantime, you can reach our coordinators directly via WhatsApp or phone. We will confirm dates, artisan availability, and issue an official pro-forma invoice promptly.
          </p>
        </div>

        {/* Direct Contact Actions */}
        <div className="space-y-3 pt-2">
          <a
            href={`https://wa.me/250780324944?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 rounded-card bg-brown-900 border border-amber-400/25 hover:border-amber transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber/15 flex items-center justify-center text-amber">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="font-display font-bold text-xs uppercase tracking-button text-sand-bright group-hover:text-amber transition-colors block">
                  Message via WhatsApp
                </span>
                <span className="text-xs font-sans text-sand-muted block">
                  Fastest response for dates and group queries
                </span>
              </div>
            </div>
            <span className="text-xs font-display uppercase tracking-button text-amber font-bold">
              Chat now &rarr;
            </span>
          </a>

          <a
            href={`tel:${siteConfig.phoneRaw}`}
            className="flex items-center justify-between p-4 rounded-card bg-brown-900 border border-amber-400/25 hover:border-amber transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber/15 flex items-center justify-center text-amber">
                <Phone className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="font-display font-bold text-xs uppercase tracking-button text-sand-bright group-hover:text-amber transition-colors block">
                  Call Studio Coordinator
                </span>
                <span className="text-xs font-sans text-sand-muted block">
                  {SCHOOLS_CONTACT_PHONE} (Mon–Sun 8:00am–6:00pm)
                </span>
              </div>
            </div>
            <span className="text-xs font-display uppercase tracking-button text-amber font-bold">
              Call &rarr;
            </span>
          </a>

          <Link
            href="/contact"
            className="flex items-center justify-between p-4 rounded-card bg-brown-900 border border-amber-400/25 hover:border-amber transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber/15 flex items-center justify-center text-amber">
                <Mail className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="font-display font-bold text-xs uppercase tracking-button text-sand-bright group-hover:text-amber transition-colors block">
                  Send an Email Message
                </span>
                <span className="text-xs font-sans text-sand-muted block">
                  Use our general contact form or email info@jundesigns.rw
                </span>
              </div>
            </div>
            <span className="text-xs font-display uppercase tracking-button text-amber font-bold">
              Contact &rarr;
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RequestQuotePage() {
  return (
    <main className="bg-brown-900 text-sand-primary text-left min-h-screen px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <Suspense
        fallback={
          <div className="max-w-2xl mx-auto text-center py-20 text-sand-muted">
            Loading quote options...
          </div>
        }
      >
        <QuoteStubContent />
      </Suspense>
    </main>
  );
}
