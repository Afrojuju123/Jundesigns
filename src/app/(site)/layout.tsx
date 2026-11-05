import React from "react";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { BookingDrawerProvider } from "@/context/BookingDrawerContext";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BookingDrawerProvider>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-amber focus:text-brown-950 focus:font-display focus:text-xs focus:font-bold focus:uppercase focus:tracking-button focus:shadow-lg focus:rounded-sm focus:outline-none"
      >
        Skip to content
      </a>
      <div className="flex flex-col min-h-screen bg-brown-900 text-sand selection:bg-amber selection:text-brown-900">
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </BookingDrawerProvider>
  );
}
