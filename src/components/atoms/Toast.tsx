"use client";

import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastProps {
  id?: string;
  type?: "success" | "error" | "info";
  title: string;
  message?: string;
  onClose: () => void;
  durationMs?: number;
}

export const Toast: React.FC<ToastProps> = ({
  type = "info",
  title,
  message,
  onClose,
  durationMs = 4500,
}) => {
  useEffect(() => {
    if (durationMs > 0) {
      const timer = setTimeout(onClose, durationMs);
      return () => clearTimeout(timer);
    }
  }, [durationMs, onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-amber shrink-0 stroke-[2]" />,
    error: <AlertCircle className="w-5 h-5 text-brick shrink-0 stroke-[2]" />,
    info: <Info className="w-5 h-5 text-amber shrink-0 stroke-[2]" />,
  };

  const borders = {
    success: "border-amber-400/40",
    error: "border-brick/50",
    info: "border-amber-400/30",
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex items-start gap-3 p-4 rounded-card bg-brown-850 border shadow-warm-low max-w-md w-full animate-reveal",
        borders[type]
      )}
    >
      <div className="mt-0.5">{icons[type]}</div>
      <div className="flex-1 space-y-0.5 text-left">
        <p className="font-display font-bold text-sm text-sand-bright tracking-wide">
          {title}
        </p>
        {message && (
          <p className="font-sans text-xs text-sand-body leading-relaxed">
            {message}
          </p>
        )}
      </div>
      <button
        onClick={onClose}
        aria-label="Close notification"
        className="text-sand-muted hover:text-sand-bright p-1 rounded-sm transition-colors cursor-pointer"
      >
        <X className="w-4 h-4 stroke-[1.5]" />
      </button>
    </div>
  );
};
