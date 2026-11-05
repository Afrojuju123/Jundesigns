"use client";

import React from "react";
import { Button } from "@/components/atoms/Button";
import { formatRwf } from "@/lib/utils";
import { cn } from "@/lib/utils";

export interface StickyBookBarProps {
  workshopName?: string;
  priceRwf?: number;
  onBookClick?: () => void;
  className?: string;
}

export const StickyBookBar: React.FC<StickyBookBarProps> = ({
  workshopName = "Cultural Workshop",
  priceRwf = 25000,
  onBookClick,
  className,
}) => {
  return (
    <aside
      aria-label="Quick Booking Navigation"
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 md:hidden bg-brown-900/95 backdrop-blur-md border-t border-amber-400/25 px-4 py-3 shadow-drawer transition-transform duration-quick",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="flex flex-col text-left">
          <span className="font-display text-[11px] font-semibold tracking-eyebrow uppercase text-sand-muted truncate max-w-[140px]">
            {workshopName}
          </span>
          <span className="font-sans font-bold text-base text-sand-bright">
            {formatRwf(priceRwf)}
            <span className="text-xs font-normal text-sand-muted ml-1">/ person</span>
          </span>
        </div>

        <Button
          onClick={onBookClick}
          size="sm"
          className="h-[44px] px-6 text-xs shrink-0"
        >
          Book Session
        </Button>
      </div>
    </aside>
  );
};
