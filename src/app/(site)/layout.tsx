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
