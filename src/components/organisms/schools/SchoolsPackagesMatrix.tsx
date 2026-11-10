"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Minus, ArrowRight, ChevronDown, Clock, MapPin, Users, Sparkles, Info } from "lucide-react";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { SectionHeading } from "@/components/atoms/SectionHeading";
import {
  SCHOOL_PACKAGES,
  SCHOOL_ACTIVITIES,
  SchoolPackage,
  DURATION_NOTE,
  TEACHER_ALLOWANCE_TIERS,
  TEACHER_POLICY_NOTE,
  LOCATION_NOTE,
  CUSTOM_GROUP_NOTE,
} from "@/data/schools";
import { formatRwf } from "@/lib/utils";

export const SchoolsPackagesMatrix: React.FC = () => {
  const [mobileExpanded, setMobileExpanded] = useState<string>("bronze");
  const activitiesList = Object.values(SCHOOL_ACTIVITIES);

  return (
    <section id="packages" className="px-4 sm:px-6 lg:px-8 py-20 max-w-content mx-auto text-left">
      <div className="space-y-12">
        <div className="max-w-3xl space-y-3">
          <Eyebrow>PACKAGE COMPARISON</Eyebrow>
          <SectionHeading
            level="h2"
            title="Three Packages for *Every Group Size*"
          />
          <p className="font-sans text-base sm:text-lg text-sand-primary leading-relaxed">
            Choose the package that aligns with your school&apos;s visit duration and learning objectives. Each package includes dedicated artisan instructors, student craft materials, and guided group rotations.
          </p>
        </div>

        {/* 1. DESKTOP VIEW: FULL COMPARISON MATRIX TABLE (Hidden on mobile) */}
        <div className="hidden md:block overflow-x-auto rounded-hero border border-amber-400/25 bg-brown-950 shadow-warm-low">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-amber-400/20 bg-brown-900/80">
                <th scope="col" className="p-6 text-sm font-display font-bold uppercase tracking-eyebrow text-sand-muted w-1/3">
                  Cultural Activity / Feature
                </th>
                {SCHOOL_PACKAGES.map((pkg) => (
                  <th
                    key={pkg.id}
                    scope="col"
                    className="p-6 text-center border-l border-amber-400/15"
                  >
                    <span className="font-serif text-2xl font-bold text-sand-bright block">
                      {pkg.name}
                    </span>
                    <span className="text-xs font-mono text-sand-muted block mt-1">
                      Min {pkg.minStudents} students
                    </span>
                    <span className="inline-flex items-center gap-1 mt-1 text-xs font-sans text-amber font-medium">
                      <Clock className="w-3 h-3 text-amber shrink-0" />
                      <span>{pkg.duration}</span>
                    </span>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-pill text-[10px] font-mono font-semibold bg-amber/15 text-amber border border-amber/30">
                      {pkg.activities.length} activities
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-400/15 text-sm">
              {activitiesList.map((act) => (
                <tr key={act.id} className="hover:bg-brown-900/40 transition-colors">
                  <th scope="row" className="p-5 font-sans font-medium text-sand-bright">
                    <div className="space-y-0.5">
                      <div className="font-sans font-semibold text-sand-bright">
                        {act.name}
                      </div>
                      <div className="text-xs text-sand-muted capitalize">
                        {act.type.replace("-", " ")}
                      </div>
                    </div>
                  </th>
                  {SCHOOL_PACKAGES.map((pkg) => {
                    const isIncluded = pkg.activities.includes(act.id);
                    return (
                      <td
                        key={`${pkg.id}-${act.id}`}
                        className="p-5 text-center border-l border-amber-400/15"
                      >
                        {isIncluded ? (
                          <span
                            className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber/20 text-amber mx-auto"
                            aria-label={`Included in ${pkg.name}`}
                          >
                            <Check className="w-4 h-4 stroke-[2.5]" />
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center justify-center w-7 h-7 text-sand-muted/40 mx-auto"
                            aria-label={`Not included in ${pkg.name}`}
                          >
                            <Minus className="w-4 h-4" />
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Pricing Tiers Summary Row */}
              <tr className="bg-brown-900/90 font-mono text-xs border-t-2 border-amber-400/30">
                <th scope="row" className="p-6 font-display font-bold uppercase tracking-eyebrow text-sand-bright align-top">
                  Volume Price Tiers
                  <span className="block font-sans font-normal text-xs text-sand-muted normal-case mt-1">
                    Automatic per-student rate based on total group size
                  </span>
                </th>
                {SCHOOL_PACKAGES.map((pkg) => (
                  <td key={`pricing-${pkg.id}`} className="p-6 border-l border-amber-400/15 align-top">
                    <div className="space-y-2">
                      {pkg.tiers.map((tier) => (
                        <div
                          key={tier.label}
                          className="flex items-center justify-between gap-4 p-2 rounded-sm bg-brown-950/70 border border-amber-400/15"
                        >
                          <span className="text-sand-muted text-[11px] font-sans">
                            {tier.label}:
                          </span>
                          <span className="font-bold text-amber text-xs">
                            {formatRwf(tier.pricePerStudent)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* CTA Action Row */}
              <tr className="bg-brown-950">
                <td className="p-6"></td>
                {SCHOOL_PACKAGES.map((pkg) => (
                  <td key={`cta-${pkg.id}`} className="p-6 text-center border-l border-amber-400/15">
                    <Link
                      href={`/schools/request-quote?package=${pkg.id}`}
                      className="inline-flex items-center justify-center gap-1.5 h-11 px-5 rounded-pill bg-amber text-brown-950 font-display text-xs font-bold uppercase tracking-button hover:bg-amber-400 transition-colors w-full"
                    >
                      <span>Request {pkg.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* 2. MOBILE VIEW: CLEAN ACCORDION STACK (Under 768px) */}
        {/* Guardrail: No generic 3-column cards, no 'Most Popular' badge */}
        <div className="block md:hidden space-y-4">
          {SCHOOL_PACKAGES.map((pkg) => {
            const isExpanded = mobileExpanded === pkg.id;

            return (
              <div
                key={pkg.id}
                className="rounded-card border border-amber-400/25 bg-brown-950 overflow-hidden shadow-warm-low"
              >
                {/* Header Trigger */}
                <button
                  type="button"
                  onClick={() => setMobileExpanded(isExpanded ? "" : pkg.id)}
                  aria-expanded={isExpanded}
                  className="w-full p-5 flex items-center justify-between text-left bg-brown-900/60 hover:bg-brown-900 transition-colors cursor-pointer"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-serif text-xl font-bold text-sand-bright">
                        {pkg.name} Package
                      </h3>
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-pill bg-amber/15 text-amber border border-amber/30">
                        {pkg.activities.length} activities
                      </span>
                    </div>
                    <p className="text-xs font-mono text-sand-muted">
                      Minimum {pkg.minStudents} students &bull; {pkg.duration} &bull; From {formatRwf(pkg.tiers[pkg.tiers.length - 1].pricePerStudent)}/student
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-amber transition-transform duration-quick shrink-0 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Collapsible Content */}
                {isExpanded && (
                  <div className="p-5 border-t border-amber-400/15 space-y-5 bg-brown-950 text-left">
                    {/* Included Activities */}
                    <div className="space-y-2">
                      <span className="font-display text-xs font-bold uppercase tracking-eyebrow text-amber block">
                        Included Activities ({pkg.activities.length}):
                      </span>
                      <ul className="space-y-2 text-sm text-sand-primary">
                        {pkg.activities.map((actId) => {
                          const act = SCHOOL_ACTIVITIES[actId];
                          return (
                            <li key={actId} className="flex items-start gap-2.5">
                              <Check className="w-4 h-4 text-amber shrink-0 mt-0.5 stroke-[2.5]" />
                              <div>
                                <span className="font-semibold text-sand-bright">
                                  {act?.name || actId}
                                </span>
                                <span className="text-xs text-sand-muted block capitalize">
                                  {act?.type.replace("-", " ")}
                                </span>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    {/* Tiered Price Table */}
                    <div className="space-y-2 pt-2 border-t border-amber-400/15">
                      <span className="font-display text-xs font-bold uppercase tracking-eyebrow text-sand-muted block">
                        Volume Pricing:
                      </span>
                      <div className="space-y-1.5 font-mono text-xs">
                        {pkg.tiers.map((tier) => (
                          <div
                            key={tier.label}
                            className="flex items-center justify-between p-2 rounded-sm bg-brown-900 border border-amber-400/15"
                          >
                            <span className="text-sand-muted">{tier.label}</span>
                            <span className="font-bold text-amber">
                              {formatRwf(tier.pricePerStudent)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action CTA */}
                    <div className="pt-2">
                      <Link
                        href={`/schools/request-quote?package=${pkg.id}`}
                        className="inline-flex items-center justify-center gap-2 w-full h-11 px-5 rounded-pill bg-amber text-brown-950 font-display text-xs font-bold uppercase tracking-button hover:bg-amber-400 transition-colors"
                      >
                        <span>Request {pkg.name} Quote</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Duration Note */}
        <div className="flex items-center gap-3 p-4 rounded-card bg-brown-900/60 border border-amber-400/20 text-xs sm:text-sm text-sand-primary">
          <Clock className="w-4 h-4 text-amber shrink-0" />
          <span>
            <strong className="text-sand-bright">Package Duration:</strong> Bronze is 2 to 3 hours; Silver and Gold are 4 to 5 hours. <span className="text-amber font-medium">{DURATION_NOTE}</span>
          </span>
        </div>

        {/* Teacher Allowances & Workshop Policies (Informational UI) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-amber-400/20">
          {/* 1. Teacher Allowance Policy */}
          <div className="rounded-card bg-brown-950 border border-amber-400/25 p-6 space-y-3">
            <div className="flex items-center gap-2 text-amber font-display text-xs font-bold uppercase tracking-eyebrow">
              <Users className="w-4 h-4" />
              <span>Teacher Allowances</span>
            </div>
            <h4 className="font-serif text-lg font-bold text-sand-bright">
              Complimentary Staff Entry
            </h4>
            <ul className="space-y-2 text-xs font-sans text-sand-primary">
              {TEACHER_ALLOWANCE_TIERS.map((tier) => (
                <li key={tier.label} className="flex justify-between items-center py-1 border-b border-amber-400/10">
                  <span className="font-mono text-sand-muted">{tier.label}:</span>
                  <span className="font-semibold text-amber">{tier.freeTeachers}</span>
                </li>
              ))}
            </ul>
            <p className="text-[11px] text-sand-muted italic leading-relaxed pt-1">
              &ldquo;{TEACHER_POLICY_NOTE}&rdquo;
            </p>
          </div>

          {/* 2. Workshop Location & Off-Site Hosting */}
          <div className="rounded-card bg-brown-950 border border-amber-400/25 p-6 space-y-3">
            <div className="flex items-center gap-2 text-amber font-display text-xs font-bold uppercase tracking-eyebrow">
              <MapPin className="w-4 h-4" />
              <span>Workshop Location</span>
            </div>
            <h4 className="font-serif text-lg font-bold text-sand-bright">
              Studio or On-Campus
            </h4>
            <p className="text-xs font-sans text-sand-primary leading-relaxed">
              {LOCATION_NOTE}
            </p>
            <p className="text-[11px] text-sand-muted pt-1">
              Our master artisans bring all authentic tools, easels, pigments, and materials directly to your campus hall or courtyard.
            </p>
          </div>

          {/* 3. Custom & Tailored Groups */}
          <div className="rounded-card bg-brown-950 border border-amber-400/25 p-6 space-y-3">
            <div className="flex items-center gap-2 text-amber font-display text-xs font-bold uppercase tracking-eyebrow">
              <Sparkles className="w-4 h-4" />
              <span>Custom Group Sizes</span>
            </div>
            <h4 className="font-serif text-lg font-bold text-sand-bright">
              Tailored Cultural Formats
            </h4>
            <p className="text-xs font-sans text-sand-primary leading-relaxed">
              {CUSTOM_GROUP_NOTE}
            </p>
            <div className="pt-2">
              <Link
                href="/schools/request-quote?custom=true"
                className="inline-flex items-center gap-1.5 text-xs font-display uppercase tracking-button text-amber hover:text-amber-300 transition-colors font-bold"
              >
                <span>Request Custom Format</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
