import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { isAuthenticated } from "@/lib/booking/admin-auth";
import { getBookingByReference } from "@/lib/booking/store";
import { isBookingsEnabled } from "@/lib/flags";
import { AdminBookingDetailClient } from "./AdminBookingDetailClient";
import { AdminLoginView } from "../../AdminLoginView";

interface PageProps {
  params: Promise<{ reference: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { reference } = await params;
  return {
    title: `Admin: Booking ${reference} | Jun Designs`,
    robots: { index: false, follow: false },
  };
}

export default async function AdminBookingDetailPage({ params }: PageProps) {
  if (!isBookingsEnabled()) {
    return (
      <div className="min-h-screen bg-stone-900 text-stone-100 flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4 bg-stone-950 p-8 rounded-card border border-amber-400/20">
          <h1 className="font-serif text-2xl font-bold text-stone-100">
            Admin Maintenance
          </h1>
          <p className="font-sans text-sm text-stone-400">
            Booking management is offline while storage is upgraded to D1.
          </p>
        </div>
      </div>
    );
  }

  const authed = await isAuthenticated();
  if (!authed) {
    return <AdminLoginView />;
  }

  const { reference } = await params;
  const booking = getBookingByReference(reference);

  if (!booking) {
    return (
      <main className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-card border border-stone-200 p-8 max-w-md w-full text-center space-y-4 shadow-sm">
          <h1 className="font-serif text-2xl font-bold text-brown-950">Booking Not Found</h1>
          <p className="font-sans text-xs text-brown-600">
            No booking records match reference <code className="font-mono bg-stone-100 px-1">{reference}</code>.
          </p>
          <Link
            href="/admin"
            className="inline-block mt-2 font-display text-xs font-bold uppercase tracking-button text-amber hover:underline"
          >
            &larr; Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  return <AdminBookingDetailClient initialBooking={booking} />;
}
