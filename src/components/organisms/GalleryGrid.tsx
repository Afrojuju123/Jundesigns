"use client";

import React, { useState, useEffect } from "react";
import { X, ZoomIn } from "lucide-react";
import { ImageSlot } from "@/components/atoms/ImageSlot";
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
      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch",
          className
        )}
      >
        {items.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => setActiveItem(item)}
            className={cn(
              "group relative cursor-pointer overflow-hidden rounded-card border border-amber-400/20 bg-brown-850 flex flex-col justify-between transition-all duration-quick hover:border-amber-400/50 hover:shadow-warm-low",
              idx === 0 ? "sm:col-span-2 lg:col-span-2" : ""
            )}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setActiveItem(item);
              }
            }}
            aria-label={`View photo: ${item.title}`}
          >
            <div className="relative w-full flex-1 min-h-[220px]">
              <ImageSlot
                src={item.src}
                alt={item.title}
                label={item.title}
                aspectRatio={item.aspectRatio || (idx === 0 ? "16/9" : "4/3")}
                radius="none"
                className="h-full border-none"
              />
            </div>

            <div className="p-4 text-left border-t border-amber-400/15 flex items-center justify-between bg-brown-850">
              <div>
                <h4 className="font-display font-bold text-sm tracking-wide text-sand-bright group-hover:text-amber transition-colors">
                  {item.title}
                </h4>
                <p className="font-sans text-xs text-sand-muted line-clamp-1 mt-0.5">
                  {item.description}
                </p>
              </div>
              <span className="p-1.5 rounded-full bg-brown-900 border border-amber-400/20 text-amber group-hover:bg-amber group-hover:text-brown-900 transition-colors shrink-0 ml-2">
                <ZoomIn className="w-3.5 h-3.5 stroke-[2]" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Accessible Modal Lightbox */}
      {activeItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-brown-950/90 backdrop-blur-md animate-reveal"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="relative w-full max-w-3xl rounded-card bg-brown-900 border border-amber-400/40 p-6 md:p-8 shadow-drawer space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-amber-400/15 pb-4">
              <div>
                <span className="font-display text-xs font-bold uppercase tracking-eyebrow text-amber">
                  — WORKSHOP ARCHIVE
                </span>
                <h3
                  id="lightbox-title"
                  className="font-serif text-2xl md:text-3xl font-bold text-sand-bright mt-1"
                >
                  {activeItem.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveItem(null)}
                aria-label="Close modal"
                className="w-10 h-10 rounded-full bg-brown-800 border border-amber-400/30 flex items-center justify-center text-sand-bright hover:text-amber hover:border-amber transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>

            <div className="w-full">
              <ImageSlot
                src={activeItem.src}
                alt={activeItem.title}
                label={activeItem.title}
                aspectRatio="16/9"
                radius="card"
              />
            </div>

            <p className="font-sans text-sm md:text-base text-sand-primary leading-relaxed text-left">
              {activeItem.description}
            </p>
          </div>
        </div>
      )}
    </>
  );
};
