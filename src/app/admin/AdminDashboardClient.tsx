"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Users,
  Settings,
  Mail,
  LogOut,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { Booking, TimeSlot } from "@/lib/booking/types";
import { EmailDispatchRecord } from "@/lib/booking/email";

interface UpcomingDateGroup {
  date: string;
  dateFormatted: string;
  slots: {
    slot: TimeSlot;
    label: string;
    totalGuests: number;
    bookings: Booking[];
  }[];
}

interface AdminDashboardClientProps {
  upcomingGrouped: UpcomingDateGroup[];
  allBookings: Booking[];
  emailLogs: EmailDispatchRecord[];
  initialConfig: {
    capacityPerSlot: number;
    blockedDates: string[];
    cancellationPolicyText: string;
  };
}

export const AdminDashboardClient: React.FC<AdminDashboardClientProps> = ({
  upcomingGrouped,
  allBookings,
  emailLogs,
  initialConfig,
}) => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "all" | "settings" | "logs">("upcoming");
  const [config, setConfig] = useState(initialConfig);
  const [capacityInput, setCapacityInput] = useState(initialConfig.capacityPerSlot);
  const [newBlockedDate, setNewBlockedDate] = useState("");
  const [policyInput, setPolicyInput] = useState(initialConfig.cancellationPolicyText);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  };

  const showNotification = (msg: string) => {
    setSaveSuccess(msg);
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const handleSaveCapacity = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ capacityPerSlot: Number(capacityInput) }),
      });
      if (res.ok) {
        setConfig((prev) => ({ ...prev, capacityPerSlot: Number(capacityInput) }));
        showNotification("Capacity updated successfully.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleAddBlockedDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockedDate) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toggleBlockedDate: { date: newBlockedDate, blocked: true },
        }),
      });
      if (res.ok) {
        setConfig((prev) => ({
          ...prev,
          blockedDates: [...prev.blockedDates, newBlockedDate].sort(),
        }));
        setNewBlockedDate("");
        showNotification(`Date ${newBlockedDate} blocked successfully.`);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveBlockedDate = async (dateStr: string) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toggleBlockedDate: { date: dateStr, blocked: false },
        }),
      });
      if (res.ok) {
        setConfig((prev) => ({
          ...prev,
          blockedDates: prev.blockedDates.filter((d) => d !== dateStr),
        }));
        showNotification(`Date ${dateStr} unblocked.`);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSavePolicy = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cancellationPolicyText: policyInput }),
      });
      if (res.ok) {
        setConfig((prev) => ({ ...prev, cancellationPolicyText: policyInput }));
        showNotification("Cancellation policy updated.");
      }
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "paid":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-green-50 text-green-700 border border-green-200">
            <CheckCircle2 className="w-3 h-3" /> Paid
          </span>
        );
      case "held":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3" /> Held
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-stone-100 text-stone-700 border border-stone-300">
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      case "refunded":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-red-50 text-red-700 border border-red-200">
            <ShieldAlert className="w-3 h-3" /> Refunded
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono bg-stone-100 text-brown-600">
            {status}
          </span>
        );
    }
  };

  return (
    <main className="min-h-screen bg-stone-100 text-brown-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="bg-white rounded-card border border-stone-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="font-display text-[11px] font-bold uppercase tracking-eyebrow text-amber block">
              — STUDIO OPERATIONS & SCHEDULES
            </span>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-brown-950">
              Jun Designs Operations Admin
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded border border-stone-200 text-xs font-display uppercase tracking-button font-bold text-brown-800 hover:text-amber bg-white transition-colors"
            >
              <span>View Site</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded border border-stone-200 text-xs font-display uppercase tracking-button font-bold text-brown-700 hover:text-red-700 hover:border-red-200 bg-stone-50 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </div>

        {/* Global Save Notification */}
        {saveSuccess && (
          <div className="p-3 bg-amber-50 border border-amber-300 rounded text-xs font-medium text-brown-950 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber shrink-0" />
            <span>{saveSuccess}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 bg-white rounded-t-card px-6 pt-4 gap-6">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`pb-3 text-xs md:text-sm font-display uppercase tracking-button font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "upcoming"
                ? "border-amber text-brown-950"
                : "border-transparent text-brown-500 hover:text-brown-900"
            }`}
          >
            <Calendar className="w-4 h-4 text-amber" />
            <span>Upcoming by Date & Slot</span>
          </button>

          <button
            onClick={() => setActiveTab("all")}
            className={`pb-3 text-xs md:text-sm font-display uppercase tracking-button font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "all"
                ? "border-amber text-brown-950"
                : "border-transparent text-brown-500 hover:text-brown-900"
            }`}
          >
            <Users className="w-4 h-4 text-brown-600" />
            <span>All Bookings ({allBookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`pb-3 text-xs md:text-sm font-display uppercase tracking-button font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "settings"
                ? "border-amber text-brown-950"
                : "border-transparent text-brown-500 hover:text-brown-900"
            }`}
          >
            <Settings className="w-4 h-4 text-brown-600" />
            <span>Capacity & Policies</span>
          </button>

          <button
            onClick={() => setActiveTab("logs")}
            className={`pb-3 text-xs md:text-sm font-display uppercase tracking-button font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "logs"
                ? "border-amber text-brown-950"
                : "border-transparent text-brown-500 hover:text-brown-900"
            }`}
          >
            <Mail className="w-4 h-4 text-brown-600" />
            <span>Email Audit Log ({emailLogs.length})</span>
          </button>
        </div>

        {/* TAB 1: UPCOMING BOOKINGS GROUPED BY DATE AND SLOT */}
        {activeTab === "upcoming" && (
          <div className="space-y-6">
            {upcomingGrouped.length === 0 ? (
              <div className="bg-white rounded-card border border-stone-200 p-12 text-center text-brown-600">
                No upcoming sessions found.
              </div>
            ) : (
              upcomingGrouped.map((group) => (
                <div
                  key={group.date}
                  className="bg-white rounded-card border border-stone-200 overflow-hidden shadow-sm"
                >
                  {/* Date Header */}
                  <div className="bg-stone-50 border-b border-stone-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-amber" />
                      <h2 className="font-serif text-lg font-bold text-brown-950">
                        {group.dateFormatted}
                      </h2>
                    </div>
                    <span className="font-mono text-xs text-brown-600 bg-white px-2.5 py-1 rounded border border-stone-200">
                      {group.date}
                    </span>
                  </div>

                  {/* Slot Sections */}
                  <div className="divide-y divide-stone-200">
                    {group.slots.map((slotGroup) => (
                      <div key={slotGroup.slot} className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-brown-500" />
                            <h3 className="font-display text-sm font-bold uppercase tracking-button text-brown-950">
                              {slotGroup.label}
                            </h3>
                          </div>
                          <div className="text-xs font-mono text-brown-700">
                            Booked: <strong>{slotGroup.totalGuests}</strong> / {config.capacityPerSlot} places
                          </div>
                        </div>

                        {slotGroup.bookings.length === 0 ? (
                          <div className="text-xs text-brown-500 italic py-2">
                            No reservations for this time slot.
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                              <thead>
                                <tr className="border-b border-stone-200 text-brown-600 font-display uppercase tracking-wider">
                                  <th className="py-2 pr-3">Ref</th>
                                  <th className="py-2 px-3">Workshop</th>
                                  <th className="py-2 px-3">Guest Name</th>
                                  <th className="py-2 px-3">Contact</th>
                                  <th className="py-2 px-3 text-center">Guests</th>
                                  <th className="py-2 px-3 text-right">Amount</th>
                                  <th className="py-2 px-3 text-center">Status</th>
                                  <th className="py-2 pl-3 text-right">Action</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-stone-100">
                                {slotGroup.bookings.map((booking) => (
                                  <tr key={booking.reference} className="hover:bg-stone-50/80">
                                    <td className="py-3 pr-3 font-mono font-bold text-brown-950">
                                      <Link
                                        href={`/admin/bookings/${booking.reference}`}
                                        className="hover:text-amber underline"
                                      >
                                        {booking.reference}
                                      </Link>
                                    </td>
                                    <td className="py-3 px-3 font-medium text-brown-950">
                                      {booking.workshopName}
                                    </td>
                                    <td className="py-3 px-3 text-brown-900">
                                      {booking.customerName}
                                    </td>
                                    <td className="py-3 px-3 text-brown-700 space-y-0.5">
                                      <div>{booking.customerEmail}</div>
                                      <div className="text-[11px] text-brown-500">
                                        {booking.customerCountry} {booking.customerPhone}
                                      </div>
                                    </td>
                                    <td className="py-3 px-3 text-center font-bold text-brown-950">
                                      {booking.guests}
                                    </td>
                                    <td className="py-3 px-3 text-right font-mono text-brown-950">
                                      {booking.amountRwf.toLocaleString()} RWF
                                    </td>
                                    <td className="py-3 px-3 text-center">
                                      {getStatusBadge(booking.status)}
                                    </td>
                                    <td className="py-3 pl-3 text-right">
                                      <Link
                                        href={`/admin/bookings/${booking.reference}`}
                                        className="inline-flex items-center gap-1 font-display uppercase text-[11px] font-bold text-amber hover:text-amber-600"
                                      >
                                        <span>Manage</span>
                                        <ArrowRight className="w-3 h-3" />
                                      </Link>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: ALL BOOKINGS LIST */}
        {activeTab === "all" && (
          <div className="bg-white rounded-card border border-stone-200 p-6 shadow-sm">
            <h2 className="font-serif text-lg font-bold text-brown-950 mb-4">
              All Recorded Bookings
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-brown-600 font-display uppercase tracking-wider">
                    <th className="py-2.5 pr-3">Ref</th>
                    <th className="py-2.5 px-3">Date & Slot</th>
                    <th className="py-2.5 px-3">Workshop</th>
                    <th className="py-2.5 px-3">Lead Guest</th>
                    <th className="py-2.5 px-3 text-center">Guests</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 pl-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {allBookings.map((b) => (
                    <tr key={b.reference} className="hover:bg-stone-50">
                      <td className="py-3 pr-3 font-mono font-bold text-brown-950">
                        {b.reference}
                      </td>
                      <td className="py-3 px-3 text-brown-900">
                        {b.date} &bull; {b.slot}
                      </td>
                      <td className="py-3 px-3 font-medium text-brown-950">
                        {b.workshopName}
                      </td>
                      <td className="py-3 px-3 text-brown-900">
                        {b.customerName}
                      </td>
                      <td className="py-3 px-3 text-center font-bold">
                        {b.guests}
                      </td>
                      <td className="py-3 px-3 text-right font-mono">
                        {b.amountRwf.toLocaleString()} RWF
                      </td>
                      <td className="py-3 px-3 text-center">
                        {getStatusBadge(b.status)}
                      </td>
                      <td className="py-3 pl-3 text-right">
                        <Link
                          href={`/admin/bookings/${b.reference}`}
                          className="font-display uppercase text-[11px] font-bold text-amber hover:text-amber-600"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SCHEDULE SETTINGS & CAPACITY */}
        {activeTab === "settings" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Slot Capacity Control */}
            <div className="bg-white rounded-card border border-stone-200 p-6 shadow-sm space-y-4">
              <div>
                <span className="font-display text-[11px] font-bold uppercase tracking-eyebrow text-amber block">
                  — CAPACITY MANAGEMENT
                </span>
                <h3 className="font-serif text-lg font-bold text-brown-950">
                  Capacity Per Time Slot
                </h3>
                <p className="font-sans text-xs text-brown-600 mt-1">
                  Maximum guest seats available in each 10:00am and 4:00pm session across all workshops.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={capacityInput}
                  onChange={(e) => setCapacityInput(Number(e.target.value))}
                  className="w-24 h-11 px-3 border border-stone-300 rounded font-mono text-sm text-center focus:outline-none focus:border-amber"
                />
                <button
                  onClick={handleSaveCapacity}
                  disabled={saving}
                  className="h-11 px-5 rounded bg-brown-950 text-white font-display text-xs font-bold uppercase tracking-button hover:bg-brown-800 transition-colors disabled:opacity-50"
                >
                  Save Capacity
                </button>
              </div>
            </div>

            {/* Block Dates Manager */}
            <div className="bg-white rounded-card border border-stone-200 p-6 shadow-sm space-y-4">
              <div>
                <span className="font-display text-[11px] font-bold uppercase tracking-eyebrow text-amber block">
                  — STUDIO CLOSURES
                </span>
                <h3 className="font-serif text-lg font-bold text-brown-950">
                  Block Dates
                </h3>
                <p className="font-sans text-xs text-brown-600 mt-1">
                  Block specific dates for public holidays, private royal events, or studio maintenance.
                </p>
              </div>

              <form onSubmit={handleAddBlockedDate} className="flex items-center gap-2 pt-1">
                <input
                  type="date"
                  required
                  value={newBlockedDate}
                  onChange={(e) => setNewBlockedDate(e.target.value)}
                  className="h-11 px-3 border border-stone-300 rounded text-xs font-sans focus:outline-none focus:border-amber"
                />
                <button
                  type="submit"
                  disabled={saving}
                  className="h-11 px-4 rounded bg-amber text-brown-950 font-display text-xs font-bold uppercase tracking-button hover:bg-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Block Date</span>
                </button>
              </form>

              <div className="pt-2">
                <span className="text-xs font-display uppercase tracking-wider font-bold text-brown-600 block mb-2">
                  Currently Blocked Dates ({config.blockedDates.length})
                </span>
                {config.blockedDates.length === 0 ? (
                  <p className="text-xs text-brown-500 italic">No dates currently blocked.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {config.blockedDates.map((d) => (
                      <span
                        key={d}
                        className="inline-flex items-center gap-2 bg-stone-100 border border-stone-200 px-3 py-1.5 rounded text-xs font-mono text-brown-950"
                      >
                        <span>{d}</span>
                        <button
                          onClick={() => handleRemoveBlockedDate(d)}
                          title="Remove block"
                          className="text-brown-400 hover:text-red-600 p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Cancellation Policy Editor */}
            <div className="md:col-span-2 bg-white rounded-card border border-stone-200 p-6 shadow-sm space-y-4">
              <div>
                <span className="font-display text-[11px] font-bold uppercase tracking-eyebrow text-amber block">
                  — CUSTOMER TERMS & CONDITIONS
                </span>
                <h3 className="font-serif text-lg font-bold text-brown-950">
                  Cancellation & Reschedule Policy Text
                </h3>
                <p className="font-sans text-xs text-brown-600 mt-1">
                  This text is presented to guests on the confirmation page and inside transactional emails.
                </p>
              </div>

              <textarea
                rows={4}
                value={policyInput}
                onChange={(e) => setPolicyInput(e.target.value)}
                className="w-full p-3 border border-stone-300 rounded text-xs sm:text-sm font-sans focus:outline-none focus:border-amber leading-relaxed"
              />

              <div>
                <button
                  onClick={handleSavePolicy}
                  disabled={saving}
                  className="h-11 px-6 rounded bg-brown-950 text-white font-display text-xs font-bold uppercase tracking-button hover:bg-brown-800 transition-colors disabled:opacity-50"
                >
                  Save Policy Text
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: TRANSACTIONAL EMAIL AUDIT LOG */}
        {activeTab === "logs" && (
          <div className="bg-white rounded-card border border-stone-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-bold text-brown-950">
                  Transactional Email Audit Log
                </h2>
                <p className="font-sans text-xs text-brown-600">
                  Chronological records of confirmation emails, studio alerts, and reminder dispatches.
                </p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-stone-200 text-xs font-display uppercase font-bold text-brown-700 hover:text-amber"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
            </div>

            {emailLogs.length === 0 ? (
              <p className="text-xs text-brown-500 italic py-6">No email dispatches recorded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 text-brown-600 font-display uppercase tracking-wider">
                      <th className="py-2.5 pr-3">Time</th>
                      <th className="py-2.5 px-3">Ref</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Recipient</th>
                      <th className="py-2.5 px-3">Subject</th>
                      <th className="py-2.5 px-3 text-center">Attempts</th>
                      <th className="py-2.5 pl-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {emailLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-stone-50 font-mono">
                        <td className="py-2.5 pr-3 text-brown-600 text-[11px]">
                          {new Date(log.lastAttemptAt).toLocaleTimeString()}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-brown-950">
                          {log.bookingReference}
                        </td>
                        <td className="py-2.5 px-3 font-sans text-brown-800 capitalize">
                          {log.type.replace(/_/g, " ")}
                        </td>
                        <td className="py-2.5 px-3 text-brown-700">
                          {log.recipient}
                        </td>
                        <td className="py-2.5 px-3 font-sans text-brown-900 max-w-xs truncate">
                          {log.subject}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {log.attempts}
                        </td>
                        <td className="py-2.5 pl-3 text-right">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] uppercase font-bold ${
                              log.status === "sent"
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : log.status === "retried"
                                ? "bg-amber-50 text-amber-800 border border-amber-200"
                                : "bg-red-50 text-red-700 border border-red-200"
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  );
};
