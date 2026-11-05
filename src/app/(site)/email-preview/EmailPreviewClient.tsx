"use client";

import React, { useState } from "react";
import { Monitor, Smartphone, Mail, FileText, Check } from "lucide-react";

interface EmailData {
  subject: string;
  html: string;
  text: string;
}

interface EmailPreviewClientProps {
  guestEmail: EmailData;
  studioEmail: EmailData;
  reminderEmail: EmailData;
}

export const EmailPreviewClient: React.FC<EmailPreviewClientProps> = ({
  guestEmail,
  studioEmail,
  reminderEmail,
}) => {
  const [activeTab, setActiveTab] = useState<"guest" | "studio" | "reminder">("guest");
  const [format, setFormat] = useState<"html" | "text">("html");
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const [copied, setCopied] = useState(false);

  const activeEmail =
    activeTab === "guest"
      ? guestEmail
      : activeTab === "studio"
      ? studioEmail
      : reminderEmail;

  const handleCopyText = () => {
    navigator.clipboard.writeText(activeEmail.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-stone-100 text-brown-950 py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Control Bar */}
        <div className="bg-white rounded-card border border-stone-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="font-display text-[11px] font-bold uppercase tracking-eyebrow text-amber block">
                — TRANSACTIONAL EMAILS
              </span>
              <h1 className="font-serif text-2xl font-bold text-brown-950">
                Email Template Inspector
              </h1>
            </div>

            {/* Viewport & Format Controls */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <div className="bg-stone-100 p-1 rounded-sm border border-stone-200 flex items-center gap-1">
                <button
                  onClick={() => setFormat("html")}
                  className={`px-3 py-1.5 rounded-xs text-xs font-display uppercase tracking-button font-bold transition-colors ${
                    format === "html"
                      ? "bg-white text-brown-950 shadow-xs"
                      : "text-brown-600 hover:text-brown-950"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber" />
                    <span>HTML View</span>
                  </span>
                </button>
                <button
                  onClick={() => setFormat("text")}
                  className={`px-3 py-1.5 rounded-xs text-xs font-display uppercase tracking-button font-bold transition-colors ${
                    format === "text"
                      ? "bg-white text-brown-950 shadow-xs"
                      : "text-brown-600 hover:text-brown-950"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-brown-600" />
                    <span>Plain Text</span>
                  </span>
                </button>
              </div>

              {format === "html" && (
                <div className="bg-stone-100 p-1 rounded-sm border border-stone-200 flex items-center gap-1">
                  <button
                    onClick={() => setViewport("desktop")}
                    className={`p-1.5 rounded-xs transition-colors ${
                      viewport === "desktop"
                        ? "bg-white text-brown-950 shadow-xs"
                        : "text-brown-500 hover:text-brown-950"
                    }`}
                    title="Desktop width (640px)"
                    aria-label="Desktop viewport"
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewport("mobile")}
                    className={`p-1.5 rounded-xs transition-colors ${
                      viewport === "mobile"
                        ? "bg-white text-brown-950 shadow-xs"
                        : "text-brown-500 hover:text-brown-950"
                    }`}
                    title="Mobile width (375px)"
                    aria-label="Mobile viewport"
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Email Type Tabs */}
          <div className="flex border-b border-stone-200 gap-6 pt-2">
            <button
              onClick={() => setActiveTab("guest")}
              className={`pb-3 text-xs md:text-sm font-display uppercase tracking-button font-bold border-b-2 transition-colors ${
                activeTab === "guest"
                  ? "border-amber text-brown-950"
                  : "border-transparent text-brown-500 hover:text-brown-900"
              }`}
            >
              1. Guest Confirmation
            </button>
            <button
              onClick={() => setActiveTab("studio")}
              className={`pb-3 text-xs md:text-sm font-display uppercase tracking-button font-bold border-b-2 transition-colors ${
                activeTab === "studio"
                  ? "border-amber text-brown-950"
                  : "border-transparent text-brown-500 hover:text-brown-900"
              }`}
            >
              2. Studio New Booking Alert
            </button>
            <button
              onClick={() => setActiveTab("reminder")}
              className={`pb-3 text-xs md:text-sm font-display uppercase tracking-button font-bold border-b-2 transition-colors ${
                activeTab === "reminder"
                  ? "border-amber text-brown-950"
                  : "border-transparent text-brown-500 hover:text-brown-900"
              }`}
            >
              3. 24-Hour Reminder
            </button>
          </div>

          {/* Subject Line Pill */}
          <div className="flex items-center gap-3 bg-stone-50 p-3 rounded border border-stone-200/80">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-brown-600">
              Subject:
            </span>
            <span className="font-sans text-sm font-medium text-brown-950">
              {activeEmail.subject}
            </span>
          </div>
        </div>

        {/* Preview Frame */}
        <div className="flex justify-center pb-12">
          {format === "html" ? (
            <div
              className={`transition-all duration-300 rounded-card overflow-hidden shadow-md border border-stone-300 bg-white ${
                viewport === "desktop" ? "w-[640px]" : "w-[375px]"
              }`}
            >
              <div className="bg-stone-200 px-4 py-2 text-[11px] font-mono text-brown-700 flex items-center justify-between border-b border-stone-300">
                <span>{viewport === "desktop" ? "Desktop Email Client (640px)" : "Mobile Email Client (375px)"}</span>
                <span>UTF-8</span>
              </div>
              <iframe
                title="Email Preview"
                srcDoc={activeEmail.html}
                className="w-full h-[760px] border-none bg-white"
              />
            </div>
          ) : (
            <div className="w-full max-w-2xl bg-white rounded-card border border-stone-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-brown-600">text/plain format</span>
                <button
                  onClick={handleCopyText}
                  className="inline-flex items-center gap-1.5 text-xs font-display uppercase font-bold text-brown-700 hover:text-amber"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <span>Copy Text</span>
                  )}
                </button>
              </div>
              <pre className="font-mono text-xs leading-relaxed text-brown-900 bg-stone-50 p-4 rounded border border-stone-200 whitespace-pre-wrap overflow-x-auto">
                {activeEmail.text}
              </pre>
            </div>
          )}
        </div>

      </div>
    </main>
  );
};
