import React from "react";
import Link from "next/link";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { BookingDrawerProvider } from "@/context/BookingDrawerContext";
import { Button } from "@/components/atoms/Button";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { SectionHeading } from "@/components/atoms/SectionHeading";

export default function NotFound() {
  return (
    <BookingDrawerProvider>
      <div className="flex flex-col min-h-screen bg-brown-900 text-sand-primary">
        <Header />
        <main id="main-content" className="flex-1 flex items-center">
          <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-left space-y-6 w-full">
            <Eyebrow>PAGE NOT FOUND &bull; 404</Eyebrow>
            <SectionHeading level="h1" title="This Path Leads *Into The Hills*" />
            <p className="font-sans text-base sm:text-lg text-sand-primary max-w-xl leading-relaxed">
              We could not find the page you were looking for. Return to our cultural workshops or get in touch with our team in Kigali.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link href="/">
                <Button size="default">Back to Home</Button>
              </Link>
              <Link href="/workshops">
                <Button variant="secondary" size="default">All Workshops</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </BookingDrawerProvider>
  );
}
