"use client";

import React, { useState, useId } from "react";
import Link from "next/link";
import { Users, Calculator, ArrowRight, CheckCircle2, HelpCircle, Phone, Clock, MapPin, Sparkles } from "lucide-react";
import {
  SCHOOL_PACKAGES,
  SchoolPackageId,
  getPackagesForGroupSize,
  estimateTotal,
  SCHOOLS_CONTACT_PHONE,
  DURATION_NOTE,
  TEACHER_POLICY_NOTE,
  LOCATION_NOTE,
  CUSTOM_GROUP_NOTE,
  getTeacherAllowance,
} from "@/data/schools";
import { formatRwf } from "@/lib/utils";

export const SchoolsEstimator: React.FC = () => {
  const [studentCount, setStudentCount] = useState<number>(60);
  const [selectedPackageId, setSelectedPackageId] = useState<SchoolPackageId>("bronze");
  const inputId = useId();

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val)) {
      setStudentCount(0);
    } else {
      setStudentCount(Math.max(0, Math.min(1000, val)));
    }
  };

  const eligiblePackages = getPackagesForGroupSize(studentCount);
  const activePackage = eligiblePackages.find((p) => p.id === selectedPackageId) || eligiblePackages[0];
  const estimate = activePackage ? estimateTotal(activePackage.id, studentCount) : null;

  return (
    <div
      id="estimator"
      className="rounded-hero bg-brown-950 border border-amber-400/25 p-6 sm:p-10 lg:p-12 shadow-warm-low"
    >
      <div className="max-w-3xl space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-eyebrow text-amber">
          <Calculator className="w-4 h-4" />
          <span>Interactive Group Estimator</span>
        </div>
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-sand-bright">
          Calculate Your Group&apos;s Estimated Cost
        </h3>
        <p className="font-sans text-sm sm:text-base text-sand-primary leading-relaxed">
          Enter your estimated number of students. Our tiered pricing automatically applies volume discounts based on your total class or cohort size.
        </p>
      </div>

      {/* Input Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end pb-8 border-b border-amber-400/15">
        <div className="md:col-span-6 space-y-2">
          <label
            htmlFor={inputId}
            className="block font-display text-xs font-bold uppercase tracking-eyebrow text-sand-bright"
          >
            Total Number of Students
          </label>
          <div className="relative">
            <Users className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-sand-muted" />
            <input
              id={inputId}
              type="number"
              min={1}
              max={1000}
              value={studentCount === 0 ? "" : studentCount}
              onChange={handleCountChange}
              placeholder="e.g. 60"
              className="w-full h-14 pl-12 pr-4 bg-brown-900 border border-amber-400/30 rounded-card font-mono text-lg font-bold text-sand-bright placeholder-sand-muted/50 focus:outline-none focus:ring-2 focus:ring-amber focus:border-amber transition-all"
            />
          </div>
          <div className="space-y-1 text-[11px] text-sand-muted">
            {studentCount >= 25 ? (
              <span className="text-amber font-medium block">
                Teacher entry: {getTeacherAllowance(studentCount)}.{" "}
                <span className="text-sand-muted italic font-normal">({TEACHER_POLICY_NOTE})</span>
              </span>
            ) : (
              <span>Packages start from 25 students. Groups under 25 are welcome to reach out to book a tailored experience.</span>
            )}
          </div>
        </div>

        {/* Quick Stepper Presets */}
        <div className="md:col-span-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-display uppercase tracking-wider text-sand-muted mr-1">
            Common sizes:
          </span>
          {[30, 50, 80, 120, 200].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                setStudentCount(preset);
                if (preset < 35 && selectedPackageId !== "bronze") {
                  setSelectedPackageId("bronze");
                }
              }}
              className={`h-9 px-3.5 rounded-pill text-xs font-mono font-semibold transition-all cursor-pointer ${
                studentCount === preset
                  ? "bg-amber text-brown-950 font-bold"
                  : "bg-brown-900 border border-amber-400/20 text-sand-primary hover:border-amber-400/60"
              }`}
            >
              {preset} students
            </button>
          ))}
        </div>
      </div>

      {/* Results Area */}
      <div className="pt-8">
        {studentCount < 25 ? (
          /* Under 25 notice */
          <div className="rounded-card bg-brown-900/80 border border-amber-400/30 p-6 sm:p-8 space-y-4">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-6 h-6 text-amber shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h4 className="font-serif text-lg font-bold text-sand-bright">
                  Group sizes under 25 students
                </h4>
                <p className="font-sans text-sm text-sand-primary leading-relaxed max-w-2xl">
                  Our structured school packages start at a minimum of 25 students. If you are organising for a smaller school club, homeschool cohort, or specialised student group, please contact our team directly. We are happy to tailor a custom cultural programme or recommend our regular 2-hour workshops.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link
                    href={`/schools/request-quote?students=${studentCount}&custom=true`}
                    className="inline-flex items-center gap-2 h-11 px-5 rounded-pill bg-amber text-brown-950 font-display text-xs font-bold uppercase tracking-button hover:bg-amber-400 transition-colors"
                  >
                    <span>Request a custom small-group quote</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <a
                    href={`tel:${SCHOOLS_CONTACT_PHONE.replace(/\s+/g, "")}`}
                    className="inline-flex items-center gap-2 text-xs font-display uppercase tracking-button text-sand-muted hover:text-amber transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber" />
                    <span>Call {SCHOOLS_CONTACT_PHONE}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Eligible packages tab / selector & breakdown */
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="font-display text-xs font-bold uppercase tracking-eyebrow text-sand-muted block">
                Available Packages for {studentCount} Students:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {SCHOOL_PACKAGES.map((pkg) => {
                  const isEligible = studentCount >= pkg.minStudents;
                  const isSelected = activePackage?.id === pkg.id;
                  const pkgEstimate = isEligible ? estimateTotal(pkg.id, studentCount) : null;

                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      disabled={!isEligible}
                      onClick={() => setSelectedPackageId(pkg.id)}
                      className={`text-left p-4 rounded-card border transition-all cursor-pointer ${
                        !isEligible
                          ? "bg-brown-900/40 border-brown-800/60 opacity-50 cursor-not-allowed"
                          : isSelected
                          ? "bg-brown-900 border-amber shadow-warm-low"
                          : "bg-brown-900/70 border-amber-400/20 hover:border-amber-400/50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-serif text-lg font-bold text-sand-bright">
                          {pkg.name}
                        </span>
                        {isSelected && (
                          <span className="w-2.5 h-2.5 rounded-full bg-amber" />
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs font-sans text-sand-muted">
                        <span>{pkg.activities.length} activities</span>
                        <span className="text-amber font-mono text-[11px]">{pkg.duration}</span>
                      </div>
                      <div className="mt-2 text-sm font-mono font-bold text-amber">
                        {isEligible && pkgEstimate ? (
                          `${formatRwf(pkgEstimate.perStudent)} / student`
                        ) : (
                          <span className="text-xs text-sand-muted/70 font-sans font-normal">
                            Min {pkg.minStudents} students
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Estimate Breakdown Box */}
            {estimate && activePackage && (
              <div className="rounded-card bg-brown-900 border border-amber-400/30 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 space-y-3">
                  <div className="inline-flex items-center gap-2 text-xs font-display font-semibold uppercase tracking-wider text-amber">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{estimate.tierLabel} Applied</span>
                  </div>
                  <h4 className="font-serif text-xl sm:text-2xl font-bold text-sand-bright">
                    {activePackage.name} Package for {studentCount} Students
                  </h4>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-sand-muted">
                    <span className="inline-flex items-center gap-1 text-amber font-mono font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Duration: {activePackage.duration}</span>
                    </span>
                    <span>&bull;</span>
                    <span className="italic">{DURATION_NOTE}</span>
                  </div>
                  <p className="font-sans text-xs sm:text-sm text-sand-primary leading-relaxed">
                    Includes {activePackage.activities.length} guided cultural activities, artisan instructors, all workshop materials, and student take-home creations.
                  </p>
                  <div className="p-3 rounded-sm bg-brown-950/70 border border-amber-400/15 space-y-1 text-xs">
                    <div className="text-sand-bright font-medium">
                      Teacher Entry: <span className="text-amber font-semibold">{getTeacherAllowance(studentCount)}</span>
                    </div>
                    <div className="text-[11px] text-sand-muted italic">
                      {TEACHER_POLICY_NOTE}
                    </div>
                  </div>
                  <div className="font-mono text-xs text-sand-muted">
                    Calculation: {studentCount} students &times; {formatRwf(estimate.perStudent)} = {formatRwf(estimate.total)}
                  </div>
                </div>

                <div className="lg:col-span-5 lg:border-l lg:border-amber-400/20 lg:pl-8 space-y-4 text-left lg:text-right">
                  <div>
                    <span className="text-xs font-display uppercase tracking-eyebrow text-sand-muted block">
                      Estimated Group Total
                    </span>
                    <span className="font-serif text-3xl sm:text-4xl font-bold text-amber block mt-1">
                      {formatRwf(estimate.total)}
                    </span>
                    <span className="text-xs font-mono text-sand-muted">
                      ({formatRwf(estimate.perStudent)} per student)
                    </span>
                  </div>

                  <div>
                    <Link
                      href={`/schools/request-quote?students=${studentCount}&package=${activePackage.id}`}
                      className="inline-flex items-center justify-center gap-2 w-full sm:w-auto h-12 px-7 rounded-pill bg-amber text-brown-950 font-display text-xs font-bold uppercase tracking-button hover:bg-amber-400 active:bg-amber-500 shadow-sm transition-all"
                    >
                      <span>Request Quote for {studentCount} Students</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
