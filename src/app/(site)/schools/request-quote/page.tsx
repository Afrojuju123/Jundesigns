"use client";

import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Phone,
  MessageSquare,
  Mail,
  ArrowLeft,
  Users,
  Package,
  CheckCircle2,
  AlertCircle,
  Send,
} from "lucide-react";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { SectionHeading } from "@/components/atoms/SectionHeading";
import { Button } from "@/components/atoms/Button";
import {
  SCHOOL_PACKAGES,
  estimateTotal,
  SCHOOLS_CONTACT_PHONE,
} from "@/data/schools";
import { siteConfig } from "@/content/site";
import { formatRwf } from "@/lib/utils";

function QuoteFormContent() {
  const searchParams = useSearchParams();
  const studentsParam = searchParams.get("students");
  const packageParam = searchParams.get("package");
  const typeParam = searchParams.get("type");

  const isUniversity = typeParam === "university";
  const initialStudents = studentsParam ? parseInt(studentsParam, 10) : 50;
  const initialPackage =
    SCHOOL_PACKAGES.find((p) => p.id === packageParam)?.id || "silver";

  const [institutionName, setInstitutionName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [studentsCount, setStudentsCount] = useState<number>(
    isNaN(initialStudents) ? 50 : initialStudents
  );
  const [selectedPackage, setSelectedPackage] = useState<string>(
    isUniversity ? "university" : initialPackage
  );
  const [preferredDate, setPreferredDate] = useState("");
  const [notes, setNotes] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [formStatus, setFormStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Update when search params load/change
  useEffect(() => {
    if (studentsParam && !isNaN(parseInt(studentsParam, 10))) {
      setStudentsCount(parseInt(studentsParam, 10));
    }
    if (packageParam && SCHOOL_PACKAGES.some((p) => p.id === packageParam)) {
      setSelectedPackage(packageParam);
    }
    if (typeParam === "university") {
      setSelectedPackage("university");
    }
  }, [studentsParam, packageParam, typeParam]);

  const currentPkg = SCHOOL_PACKAGES.find((p) => p.id === selectedPackage);
  const liveEstimate =
    currentPkg && studentsCount >= currentPkg.minStudents
      ? estimateTotal(currentPkg.id, studentsCount)
      : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("loading");
    setErrorMessage("");

    // Basic client validation
    if (!institutionName.trim() || !contactName.trim() || !email.trim() || !phone.trim()) {
      setFormStatus("error");
      setErrorMessage("Please complete all required fields (school name, contact person, email, and phone).");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    try {
      const messageBody = [
        `=== SCHOOL / GROUP QUOTE REQUEST ===`,
        `Institution: ${institutionName}`,
        `Contact Person: ${contactName}`,
        `Phone: ${phone}`,
        `Email: ${email}`,
        `Package: ${selectedPackage === "university" ? "Custom University Programme" : currentPkg?.name || selectedPackage}`,
        `Estimated Students: ${studentsCount}`,
        `Preferred Date: ${preferredDate || "Not specified"}`,
        liveEstimate ? `Calculated Estimate: ${formatRwf(liveEstimate.total)} (${formatRwf(liveEstimate.perStudent)}/student)` : `Estimate: Custom Quote Required`,
        `Notes / Curriculum Goals: ${notes || "None"}`,
      ].join("\n");

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${contactName} (${institutionName})`,
          email,
          message: messageBody,
          honeypot,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit quote request.");
      }

      setFormStatus("success");
    } catch (err: any) {
      setFormStatus("error");
      setErrorMessage(
        err?.message || "Failed to submit. Please contact us directly via WhatsApp or phone."
      );
    }
  };

  const whatsappMessage = encodeURIComponent(
    isUniversity
      ? "Hello Jun Designs, I am inquiring about a custom University cultural programme."
      : currentPkg && studentsCount
      ? `Hello Jun Designs, I would like to request a quote for our school group (${studentsCount} students, ${currentPkg.name} package).`
      : "Hello Jun Designs, I would like to request a quote for a school or group cultural workshop."
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Link
        href="/schools"
        className="inline-flex items-center gap-2 text-xs font-display uppercase tracking-button text-amber hover:text-amber-300 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Schools &amp; Groups</span>
      </Link>

      <div className="space-y-3">
        <Eyebrow>SCHOOLS &amp; GROUPS &bull; QUOTE REQUEST</Eyebrow>
        <SectionHeading
          level="h1"
          title={isUniversity ? "University *Programme Quote*" : "Request a *School Group Quote*"}
        />
        <p className="font-sans text-sm sm:text-base text-sand-primary leading-relaxed">
          {isUniversity
            ? "We design bespoke Rwandan material culture and heritage studies for higher education faculties and research cohorts."
            : "Bring your students to Kigali Culture Village, Rebero for structured cultural workshops with certified master artisans."}
        </p>
      </div>

      {/* Selected Parameters Banner */}
      {(currentPkg || isUniversity) && (
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
                {currentPkg && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-pill bg-brown-900 border border-amber-400/20">
                    <Package className="w-3.5 h-3.5 text-amber" />
                    <span>Package: {currentPkg.name}</span>
                  </span>
                )}
                {studentsCount > 0 && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-pill bg-brown-900 border border-amber-400/20">
                    <Users className="w-3.5 h-3.5 text-amber" />
                    <span>{studentsCount} Students</span>
                  </span>
                )}
                {liveEstimate && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-pill bg-amber/15 text-amber border border-amber/30 font-bold">
                    <span>Estimated Total: {formatRwf(liveEstimate.total)}</span>
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Quote Form or Thank-You Card */}
      {formStatus === "success" ? (
        <div className="rounded-hero bg-brown-950 border border-amber-400/40 p-8 sm:p-10 space-y-6 shadow-warm-low text-center animate-reveal">
          <div className="w-16 h-16 rounded-full bg-amber/20 border border-amber flex items-center justify-center text-amber mx-auto">
            <CheckCircle2 className="w-8 h-8 stroke-[2]" />
          </div>

          <div className="space-y-2">
            <span className="font-display text-xs font-bold uppercase tracking-eyebrow text-amber">
              Quote Request Sent
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-sand-bright">
              Murakoze! We Have Received Your Request
            </h2>
            <p className="font-sans text-sm sm:text-base text-sand-primary max-w-lg mx-auto leading-relaxed">
              Our school programme coordinator will review your group size ({studentsCount} students) and schedule availability, and deliver an official pro-forma quote to <strong>{email}</strong> within 24 hours.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/schools">
              <Button variant="secondary" size="default">
                Back to Schools Overview
              </Button>
            </Link>
            <a
              href={`https://wa.me/250780324944?text=${encodeURIComponent(
                `Hello Jun Designs, I just submitted a quote request for ${institutionName} (${studentsCount} students).`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-[46px] px-6 rounded-button font-display text-xs font-bold uppercase tracking-button bg-amber text-brown-950 hover:bg-amber-400 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Urgent? Ping on WhatsApp</span>
            </a>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="rounded-hero bg-brown-950 border border-amber-400/30 p-6 sm:p-10 space-y-6 shadow-warm-low"
        >
          <div className="space-y-2 border-b border-amber-400/20 pb-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-sand-bright">
              School / Institution Details
            </h2>
            <p className="font-sans text-xs sm:text-sm text-sand-muted">
              Fill in your institution details and we will issue an official pro-forma invoice.
            </p>
          </div>

          {formStatus === "error" && (
            <div className="p-4 rounded-card bg-terracotta/20 border border-terracotta/40 text-sand-bright flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm">{errorMessage}</div>
            </div>
          )}

          {/* Hidden honeypot field for anti-spam */}
          <div style={{ display: "none" }} aria-hidden="true">
            <label htmlFor="school-quote-fax">Do not fill this</label>
            <input
              id="school-quote-fax"
              type="text"
              name="honeypot"
              tabIndex={-1}
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* School / Institution Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="institution-name"
                className="block font-display text-xs uppercase tracking-button text-sand-bright font-semibold"
              >
                School / Institution Name <span className="text-amber">*</span>
              </label>
              <input
                id="institution-name"
                type="text"
                required
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                placeholder="e.g. Green Hills Academy"
                className="w-full h-11 px-3.5 rounded-sm bg-brown-900 border border-amber-400/30 text-sand-bright text-sm focus:border-amber focus:ring-1 focus:ring-amber focus:outline-none transition-colors"
              />
            </div>

            {/* Coordinator / Teacher Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="contact-name"
                className="block font-display text-xs uppercase tracking-button text-sand-bright font-semibold"
              >
                Coordinator / Teacher Name <span className="text-amber">*</span>
              </label>
              <input
                id="contact-name"
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="e.g. Marie Claire Uwase"
                className="w-full h-11 px-3.5 rounded-sm bg-brown-900 border border-amber-400/30 text-sand-bright text-sm focus:border-amber focus:ring-1 focus:ring-amber focus:outline-none transition-colors"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="school-email"
                className="block font-display text-xs uppercase tracking-button text-sand-bright font-semibold"
              >
                Official Email Address <span className="text-amber">*</span>
              </label>
              <input
                id="school-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="coordinator@school.rw"
                className="w-full h-11 px-3.5 rounded-sm bg-brown-900 border border-amber-400/30 text-sand-bright text-sm focus:border-amber focus:ring-1 focus:ring-amber focus:outline-none transition-colors"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label
                htmlFor="school-phone"
                className="block font-display text-xs uppercase tracking-button text-sand-bright font-semibold"
              >
                Phone / WhatsApp Number <span className="text-amber">*</span>
              </label>
              <input
                id="school-phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+250 780 000 000"
                className="w-full h-11 px-3.5 rounded-sm bg-brown-900 border border-amber-400/30 text-sand-bright text-sm focus:border-amber focus:ring-1 focus:ring-amber focus:outline-none transition-colors"
              />
            </div>

            {/* Package Selection */}
            <div className="space-y-1.5">
              <label
                htmlFor="package-select"
                className="block font-display text-xs uppercase tracking-button text-sand-bright font-semibold"
              >
                Package Selected
              </label>
              <select
                id="package-select"
                value={selectedPackage}
                onChange={(e) => setSelectedPackage(e.target.value)}
                className="w-full h-11 px-3.5 rounded-sm bg-brown-900 border border-amber-400/30 text-sand-bright text-sm focus:border-amber focus:ring-1 focus:ring-amber focus:outline-none transition-colors"
              >
                <option value="bronze">Bronze Package (5 Activities, from 4,500 RWF)</option>
                <option value="silver">Silver Package (6 Activities, from 6,000 RWF)</option>
                <option value="gold">Gold Package (8 Activities, from 7,000 RWF)</option>
                <option value="university">University / Higher Education (Custom)</option>
              </select>
            </div>

            {/* Student Count */}
            <div className="space-y-1.5">
              <label
                htmlFor="students-count"
                className="block font-display text-xs uppercase tracking-button text-sand-bright font-semibold"
              >
                Estimated Student Count
              </label>
              <input
                id="students-count"
                type="number"
                min={10}
                max={500}
                value={studentsCount}
                onChange={(e) => setStudentsCount(parseInt(e.target.value, 10) || 0)}
                className="w-full h-11 px-3.5 rounded-sm bg-brown-900 border border-amber-400/30 text-sand-bright text-sm focus:border-amber focus:ring-1 focus:ring-amber focus:outline-none transition-colors"
              />
            </div>

            {/* Preferred Date */}
            <div className="space-y-1.5 sm:col-span-2">
              <label
                htmlFor="preferred-date"
                className="block font-display text-xs uppercase tracking-button text-sand-bright font-semibold"
              >
                Preferred Visit Date(s) or Term
              </label>
              <input
                id="preferred-date"
                type="text"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                placeholder="e.g. May 15, 2026 or Term 2 morning session"
                className="w-full h-11 px-3.5 rounded-sm bg-brown-900 border border-amber-400/30 text-sand-bright text-sm focus:border-amber focus:ring-1 focus:ring-amber focus:outline-none transition-colors"
              />
            </div>

            {/* Notes / Curriculum Goals */}
            <div className="space-y-1.5 sm:col-span-2">
              <label
                htmlFor="school-notes"
                className="block font-display text-xs uppercase tracking-button text-sand-bright font-semibold"
              >
                Special Requirements / Curriculum Focus (Optional)
              </label>
              <textarea
                id="school-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Grade 5 social studies curriculum, dietary requirements, or transport coordination"
                className="w-full p-3.5 rounded-sm bg-brown-900 border border-amber-400/30 text-sand-bright text-sm focus:border-amber focus:ring-1 focus:ring-amber focus:outline-none transition-colors resize-y"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-amber-400/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-sand-muted">
              Teachers attend free. Formal quotation sent within 24 business hours.
            </p>

            <Button
              type="submit"
              disabled={formStatus === "loading"}
              className="w-full sm:w-auto h-[46px] px-8 text-xs shrink-0 flex items-center justify-center gap-2"
            >
              {formStatus === "loading" ? (
                <span>Sending Request...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Quote Request</span>
                </>
              )}
            </Button>
          </div>
        </form>
      )}

      {/* Direct Contact Actions */}
      <div className="rounded-hero bg-brown-950 border border-amber-400/30 p-6 sm:p-8 space-y-6 shadow-warm-low">
        <div className="space-y-2">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-sand-bright">
            Prefer Direct Communication?
          </h2>
          <p className="font-sans text-sm text-sand-primary leading-relaxed">
            Reach our school coordinators directly via WhatsApp or phone to confirm dates and station availability in real time.
          </p>
        </div>

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
    <div className="bg-brown-900 text-sand-primary text-left min-h-screen px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <Suspense
        fallback={
          <div className="max-w-2xl mx-auto text-center py-20 text-sand-muted">
            Loading quote options...
          </div>
        }
      >
        <QuoteFormContent />
      </Suspense>
    </div>
  );
}
