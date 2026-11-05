import React from "react";
import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ImageSlotProps {
  src?: string;
  alt: string;
  aspectRatio?: "16/9" | "4/3" | "1/1" | "3/4" | "2/1" | "square" | "landscape" | "portrait";
  radius?: "card" | "hero" | "none";
  label?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}

export const ImageSlot: React.FC<ImageSlotProps> = ({
  src,
  alt,
  aspectRatio = "4/3",
  radius = "card",
  label,
  width = 800,
  height = 600,
  priority = false,
  className,
}) => {
  const aspectClass = {
    "16/9": "aspect-[16/9]",
    "4/3": "aspect-[4/3]",
    "1/1": "aspect-square",
    "3/4": "aspect-[3/4]",
    "2/1": "aspect-[2/1]",
    square: "aspect-square",
    landscape: "aspect-[4/3]",
    portrait: "aspect-[3/4]",
  }[aspectRatio];

  const radiusClass = {
    card: "rounded-card",
    hero: "rounded-hero",
    none: "rounded-none",
  }[radius];

  if (!src) {
    return (
      <div
        className={cn(
          "relative w-full overflow-hidden flex flex-col items-center justify-center text-center p-6 bg-brown-800 border border-amber-400/20 shadow-warm-low select-none",
          aspectClass,
          radiusClass,
          className
        )}
        role="img"
        aria-label={alt}
      >
        {/* Subtle geometric Imigongo corner accents */}
        <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-amber-400/30" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-amber-400/30" />

        <div className="flex flex-col items-center justify-center max-w-sm gap-2.5">
          <div className="w-12 h-12 rounded-full bg-brown-700/80 border border-amber-400/20 flex items-center justify-center text-amber">
            <ImageIcon className="w-5 h-5 stroke-[1.5]" />
          </div>
          <span className="font-display font-semibold text-xs tracking-eyebrow uppercase text-amber">
            — PHOTO SLOT
          </span>
          <p className="font-sans text-xs md:text-sm text-sand-primary font-medium leading-snug">
            {label || alt}
          </p>
          <span className="font-mono text-[11px] text-sand-muted">
            Ratio {aspectRatio.replace("/", ":")}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden border border-amber-400/20 bg-brown-800",
        aspectClass,
        radiusClass,
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-transform duration-smooth hover:scale-105"
      />
    </div>
  );
};
