import React from "react";
import { Metadata } from "next";
import { isAuthenticated } from "@/lib/booking/admin-auth";
import {
  getUpcomingBookingsGrouped,
  getAllBookings,
} from "@/lib/booking/store";
import { getEmailAuditLog } from "@/lib/booking/email";
import { bookingConfig } from "@/lib/booking/config";
import { AdminDashboardClient } from "./AdminDashboardClient";
import { AdminLoginView } from "./AdminLoginView";

export const metadata: Metadata = {
  title: "Studio Admin & Schedules | Jun Designs Kigali",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
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
