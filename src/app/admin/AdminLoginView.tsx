"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Lock, ArrowRight, AlertCircle } from "lucide-react";

export const AdminLoginView: React.FC = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Incorrect password");
      }

      // Refresh page on success
      window.location.reload();
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-card border border-stone-200 p-8 shadow-sm space-y-6">
        <div className="text-center space-y-3">
          <Image
            src="/brand/logo.png"
            alt="Jun Designs"
            width={160}
            height={150}
            priority
            className="h-16 w-auto object-contain mx-auto"
          />
          <div>
            <span className="font-display text-[11px] font-bold uppercase tracking-eyebrow text-amber block">
              — STUDIO OPERATIONS
            </span>
            <h1 className="font-serif text-2xl font-semibold text-brown-950">
              Admin Authentication
            </h1>
          </div>
          <p className="font-sans text-xs text-brown-600">
            Please enter your studio master password or PIN to access bookings and schedule settings.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block font-display text-xs font-bold uppercase tracking-button text-brown-900">
              Studio Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full h-11 pl-10 pr-3 rounded border border-stone-300 focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber text-sm font-sans"
              />
              <Lock className="w-4 h-4 text-brown-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-button bg-amber text-brown-950 font-display text-xs font-bold uppercase tracking-button hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? "Authenticating..." : "Sign In to Studio Admin"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center border-t border-stone-100">
          <span className="text-[11px] text-brown-500 font-sans">
            Default credentials: <code className="bg-stone-100 px-1.5 py-0.5 rounded font-mono text-brown-800">kigali2026</code>
          </span>
        </div>
      </div>
    </main>
  );
};
