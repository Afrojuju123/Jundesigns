"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  src?: string;
  aspectRatio?: "16/9" | "4/3" | "1/1" | "3/4" | "2/1" | "square" | "landscape" | "portrait";
}

export interface GalleryGridProps {
  items: GalleryItem[];
  className?: string;
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({
  items,
  className,
}) => {
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveItem(null);
      }
    };
    if (activeItem) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [activeItem]);

  return (
    <>
      {/* Equal 3-column / 2-column / 1-column grid with items-stretch */}
      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch w-full",
          className
        )}
      >
        {items.map((item, idx) => (
          <article
            key={item.id}
            onClick={() => item.src && setActiveItem(item)}
            className="group relative cursor-pointer overflow-hidden rounded-card border border-amber-400/20 bg-brown-850 p-5 sm:p-6 flex flex-col h-full transition-all duration-quick hover:border-amber-400/50 hover:shadow-warm-low select-none"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                if (item.src) setActiveItem(item);
              }
            }}
            aria-label={`View photo: ${item.title}`}
          >
            {/* Fixed 4:3 Aspect Ratio Image */}
            <div className="relative aspect-[4/3] w-full rounded-card overflow-hidden border border-amber-400/20 bg-brown-900 mb-4 shrink-0">
              {item.src ? (
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading={idx < 3 ? "eager" : "lazy"}
                  className="object-cover transition-transform duration-smooth group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-brown-900 text-sand-muted text-xs">
                  {process.env.NODE_ENV === "development" ? "PHOTO SLOT" : ""}
                </div>
              )}
            </div>

            {/* Content Column */}
            <div className="flex flex-col flex-1">
              <h4 className="font-serif text-lg sm:text-xl font-bold text-sand-bright line-clamp-2 min-h-[3rem] flex items-center group-hover:text-amber transition-colors">
                {item.title}
              </h4>
              <p className="font-sans text-xs sm:text-sm text-sand-primary line-clamp-2 min-h-[2.5rem] mt-1.5 leading-relaxed">
                {item.description}
              </p>

              {/* Action row pinned to bottom with mt-auto */}
              <div className="mt-auto pt-3 border-t border-amber-400/15 flex items-center justify-between text-xs text-amber font-display uppercase tracking-button">
                <span>View detail</span>
                <span className="p-1.5 rounded-full bg-brown-900 border border-amber-400/20 text-amber group-hover:bg-amber group-hover:text-brown-950 transition-colors">
                  <ZoomIn className="w-3.5 h-3.5 stroke-[2]" />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Accessible Modal Lightbox */}
      {activeItem && activeItem.src && (
        <div
          className="fixed inset-0 z-50 bg-brown-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-reveal"
          role="dialog"
          aria-modal="true"
          aria-label={`Expanded view: ${activeItem.title}`}
          onClick={() => setActiveItem(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-brown-900 border border-amber-400/30 rounded-hero overflow-hidden shadow-drawer text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-brown-950/80 text-sand-primary hover:text-amber border border-amber-400/30 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-brown-950">
              <Image
                src={activeItem.src}
                alt={activeItem.title}
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-contain"
              />
            </div>

            <div className="p-6 sm:p-8 space-y-2 bg-brown-900 border-t border-amber-400/20">
              <span className="font-display text-xs font-bold uppercase tracking-eyebrow text-amber block">
                Jun Designs Artisan Documentary
              </span>
              <h3 className="font-serif text-2xl font-bold text-sand-bright">
                {activeItem.title}
              </h3>
              <p className="font-sans text-sm sm:text-base text-sand-primary leading-relaxed max-w-2xl">
                {activeItem.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
