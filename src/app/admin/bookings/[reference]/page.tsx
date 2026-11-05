import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { isAuthenticated } from "@/lib/booking/admin-auth";
import { getBookingByReference } from "@/lib/booking/store";
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
            No booking record with reference <code>{reference}</code> was found in the database.
          </p>
          <div className="pt-2">
            <Link
              href="/admin"
              className="inline-flex items-center h-11 px-5 rounded bg-brown-950 text-white font-display text-xs font-bold uppercase tracking-button hover:bg-brown-800 transition-colors"
            >
              Return to Admin Dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return <AdminBookingDetailClient initialBooking={booking} />;
}
