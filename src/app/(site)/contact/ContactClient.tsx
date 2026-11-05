"use client";

import React, { useState } from "react";
import {
  MapPin,
  Phone,
  MessageSquare,
  Clock,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { SectionHeading } from "@/components/atoms/SectionHeading";
import { siteConfig } from "@/content/site";

export const ContactClient: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    honeypot: "", // hidden spam trap
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Message delivery failed.");
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "", honeypot: "" });
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err?.message || "Something went wrong. Please try calling or messaging via WhatsApp.");
    }
  };

  return (
    <main className="bg-brown-900 text-sand-primary text-left min-h-screen">
      {/* 1. HERO HEADER */}
      <section className="px-4 sm:px-6 lg:px-8 pt-16 pb-12 md:pt-20 md:pb-16 border-b border-amber-400/20 max-w-content mx-auto">
        <div className="max-w-3xl space-y-4">
          <Eyebrow>GET IN TOUCH &bull; KIGALI, RWANDA</Eyebrow>
          <SectionHeading
            level="h1"
            title="Contact &amp; *Studio Location*"
          />
          <p className="font-sans text-base sm:text-lg text-sand-primary leading-relaxed pt-2">
            Have questions about workshops, group reservations, custom artisan orders or finding our studio on Rebero hill? Reach out anytime.
          </p>
        </div>
      </section>

      {/* 2. MAIN GRID: CONTACT DETAILS & FORM */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-content mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Studio Information */}
          <div className="lg:col-span-5 space-y-8">
            {/* Quick Contact Cards */}
            <div className="bg-brown-950 rounded-card border border-amber-400/25 p-6 sm:p-8 space-y-6 shadow-warm-low">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-sand-bright border-b border-amber-400/15 pb-3">
                Studio Information
              </h2>

              <div className="space-y-5 text-sm">
                {/* Location */}
                <div className="flex items-start gap-3.5">
                  <MapPin className="w-5 h-5 text-amber shrink-0 mt-0.5 stroke-[1.5]" />
                  <div className="space-y-1">
                    <strong className="block font-display text-xs uppercase tracking-wider text-sand-bright">
                      Studio Address
                    </strong>
                    <p className="font-sans text-xs sm:text-sm text-sand-primary leading-relaxed">
                      Kigali Culture Village (Agaseke Center building), Rebero, Kicukiro. Street KK 557 St, Kigali.
                    </p>
                    <a
                      href="https://maps.google.com/?q=Kigali+Culture+Village+Rebero+Rwanda"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-display text-xs font-bold uppercase tracking-wider text-amber hover:text-amber-300 pt-1 underline"
                    >
                      <span>Open in Google Maps</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Phone & WhatsApp */}
                <div className="flex items-start gap-3.5">
                  <Phone className="w-5 h-5 text-amber shrink-0 mt-0.5 stroke-[1.5]" />
                  <div className="space-y-1">
                    <strong className="block font-display text-xs uppercase tracking-wider text-sand-bright">
                      Phone &amp; WhatsApp
                    </strong>
                    <p className="font-sans text-sm text-sand-bright font-medium">
                      +250 780 324 944
                    </p>
                    <div className="pt-1">
                      <a
                        href={siteConfig.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-green-950 text-green-300 border border-green-700/50 text-xs font-display uppercase tracking-wider font-bold hover:bg-green-900 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Hours & Schedule */}
                <div className="flex items-start gap-3.5">
                  <Clock className="w-5 h-5 text-amber shrink-0 mt-0.5 stroke-[1.5]" />
                  <div className="space-y-1">
                    <strong className="block font-display text-xs uppercase tracking-wider text-sand-bright">
                      Hours &amp; Session Times
                    </strong>
                    <p className="font-sans text-xs sm:text-sm text-sand-primary leading-relaxed">
                      <strong>Workshop sessions:</strong> Run every day at 10:00am and 4:00pm.
                    </p>
                    <p className="font-sans text-xs text-sand-muted leading-relaxed">
                      Studio and showroom open daily from 8:00am to 7:00pm.
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3.5">
                  <Mail className="w-5 h-5 text-amber shrink-0 mt-0.5 stroke-[1.5]" />
                  <div className="space-y-1">
                    <strong className="block font-display text-xs uppercase tracking-wider text-sand-bright">
                      Email
                    </strong>
                    <a
                      href="mailto:info@jundesigns.rw"
                      className="font-sans text-sm text-sand-primary hover:text-amber transition-colors"
                    >
                      info@jundesigns.rw
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Directions Advice Box */}
            <div className="p-5 rounded-card bg-brown-850 border border-amber-400/20 text-xs space-y-2">
              <strong className="font-display font-bold uppercase tracking-wider text-amber block">
                Arriving by Taxi or Moto
              </strong>
              <p className="text-sand-primary leading-relaxed">
                Tell your driver &ldquo;Kigali Culture Village Rebero&rdquo; or &ldquo;near CANAL Olympia Rebero&rdquo;. When you reach the front entrance gate, head to the Agaseke Center building overlooking the city.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-brown-950 rounded-card border border-amber-400/25 p-6 sm:p-8 lg:p-10 shadow-warm-low space-y-6">
            <div>
              <span className="font-display text-[11px] font-bold uppercase tracking-eyebrow text-amber block">
                — SEND A MESSAGE
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-sand-bright">
                Direct Inquiry
              </h2>
              <p className="font-sans text-xs sm:text-sm text-sand-muted mt-1">
                We typically reply within a few hours. For urgent same-day bookings, please WhatsApp or call directly.
              </p>
            </div>

            {status === "success" && (
              <div className="p-4 rounded-sm bg-green-950 border border-green-700/60 text-green-200 text-xs sm:text-sm flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block text-green-300">Message Delivered!</strong>
                  <p className="mt-0.5 text-xs text-green-200/90 leading-relaxed">
                    Murakoze! Your message has been sent to our studio team. We will get back to you shortly.
                  </p>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="p-4 rounded-sm bg-red-950 border border-red-700/60 text-red-200 text-xs sm:text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block text-red-300">Submission Error</strong>
                  <p className="mt-0.5 text-xs text-red-200/90 leading-relaxed">{errorMessage}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Spam protection: hidden honeypot field */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="contact-name"
                  className="block font-display text-xs font-bold uppercase tracking-button text-sand-bright"
                >
                  Your Name <span className="text-amber">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Jeanine Mutamba"
                  className="w-full h-12 px-4 rounded-sm bg-brown-900 border border-amber-400/30 text-sand-bright placeholder-sand-muted/50 text-sm focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="contact-email"
                  className="block font-display text-xs font-bold uppercase tracking-button text-sand-bright"
                >
                  Email Address <span className="text-amber">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. name@example.com"
                  className="w-full h-12 px-4 rounded-sm bg-brown-900 border border-amber-400/30 text-sand-bright placeholder-sand-muted/50 text-sm focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="contact-message"
                  className="block font-display text-xs font-bold uppercase tracking-button text-sand-bright"
                >
                  Message <span className="text-amber">*</span>
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we help? Tell us about your group size, preferred workshop, dates or custom requests..."
                  className="w-full p-4 rounded-sm bg-brown-900 border border-amber-400/30 text-sand-bright placeholder-sand-muted/50 text-sm focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full h-12 rounded-button bg-amber text-brown-950 font-display text-xs font-bold uppercase tracking-button hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{status === "loading" ? "Sending Message..." : "Send Message"}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      </section>
    </main>
  );
};
