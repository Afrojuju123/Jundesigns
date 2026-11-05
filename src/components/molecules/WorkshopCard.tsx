"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Workshop } from "@/content/workshops";
import { Button } from "@/components/atoms/Button";
import { formatRwf } from "@/lib/utils";

export interface WorkshopCardProps {
  workshop: Workshop;
  onBook?: (slug: string) => void;
  priority?: boolean;
}

export const WorkshopCard: React.FC<WorkshopCardProps> = ({
  workshop,
  onBook,
  priority = false,
}) => {
  return (
    <article className="flex flex-col h-full rounded-card bg-brown-850 border border-amber-400/20 p-6 sm:p-7 shadow-warm-low hover:border-amber-400/50 transition-all group select-none">
      {/* 1. Fixed Aspect Ratio Image (4:3) */}
      <div className="relative aspect-[4/3] w-full rounded-card overflow-hidden border border-amber-400/20 bg-brown-900 mb-5 shrink-0">
        <Image
          src={workshop.heroImages.large}
          alt={workshop.name}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-smooth group-hover:scale-105"
        />
      </div>

      {/* 2. Content Block */}
      <div className="flex flex-col flex-1">
        {/* Title: 2-line clamp with fixed min-height for uniform row alignment */}
        <h3 className="font-serif text-2xl font-bold text-sand-bright line-clamp-2 min-h-[3.5rem] flex items-center">
          <Link
            href={`/workshops/${workshop.slug}`}
            className="hover:text-amber transition-colors"
          >
            {workshop.name}
          </Link>
        </h3>

        {/* Description: 2-line clamp with fixed min-height */}
        <p className="font-sans text-sm sm:text-base text-sand-primary leading-relaxed line-clamp-2 min-h-[3rem] mt-2">
          {workshop.cardLine || workshop.intro}
        </p>

        {/* Meta line */}
        <div className="font-mono text-xs sm:text-sm text-sand-muted mt-3 pt-3 border-t border-amber-400/10">
          <span>{formatRwf(workshop.priceRwf)} per person</span>
          <span className="mx-2">&middot;</span>
          <span>{workshop.duration}</span>
        </div>

        {/* 3. Action Row: Pinned to bottom with mt-auto */}
        <div className="mt-auto pt-4 border-t border-amber-400/15 flex items-center justify-between gap-4">
          <Link
            href={`/workshops/${workshop.slug}`}
            className="font-display font-semibold text-xs sm:text-sm text-amber hover:text-amber-300 inline-flex items-center gap-1 uppercase tracking-button transition-colors"
          >
            <span>View details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Button
            onClick={() => onBook && onBook(workshop.slug)}
            size="sm"
            className="px-5 shrink-0"
          >
            Book
          </Button>
        </div>
      </div>
    </article>
  );
};
