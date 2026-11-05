import React from "react";
import { Metadata } from "next";
import { isAuthenticated } from "@/lib/booking/admin-auth";
import {
  getUpcomingBookingsGrouped,
  getAllBookings,
} from "@/lib/booking/store";
import { getEmailAuditLog } from "@/lib/booking/email";
import { bookingConfig } from "@/lib/booking/config";
import { isBookingsEnabled } from "@/lib/flags";
import { AdminDashboardClient } from "./AdminDashboardClient";
import { AdminLoginView } from "./AdminLoginView";

export const metadata: Metadata = {
  title: "Studio Admin & Schedules | Jun Designs Kigali",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!isBookingsEnabled()) {
    return (
      <div className="min-h-screen bg-stone-900 text-stone-100 flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4 bg-stone-950 p-8 rounded-card border border-amber-400/20">
          <span className="font-display text-xs font-bold uppercase tracking-eyebrow text-amber block">
            — STUDIO ADMINISTRATION
          </span>
          <h1 className="font-serif text-2xl font-bold text-stone-100">
            Admin Portal Maintenance
          </h1>
          <p className="font-sans text-sm text-stone-400 leading-relaxed">
            The studio administrative portal is temporarily offline while backend storage is being upgraded to Cloudflare D1.
          </p>
        </div>
      </div>
    );
  }

  const authed = await isAuthenticated();

  if (!authed) {
    return <AdminLoginView />;
  }

  const upcomingGrouped = getUpcomingBookingsGrouped();
  const allBookings = getAllBookings();
  const emailLogs = getEmailAuditLog();

  const currentConfig = {
    capacityPerSlot: bookingConfig.capacityPerSlot,
    blockedDates: bookingConfig.blockedDates,
    cancellationPolicyText: bookingConfig.cancellationPolicyText,
  };

  return (
    <AdminDashboardClient
      upcomingGrouped={upcomingGrouped}
      allBookings={allBookings}
      emailLogs={emailLogs}
      initialConfig={currentConfig}
    />
  );
}
