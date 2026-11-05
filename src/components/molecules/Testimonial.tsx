import React from "react";
import { Star } from "lucide-react";
import { Testimonial as TestimonialType } from "@/types";
import { cn } from "@/lib/utils";

export interface TestimonialProps {
  testimonial: TestimonialType;
  className?: string;
}

export const Testimonial: React.FC<TestimonialProps> = ({
  testimonial,
  className,
}) => {
  return (
    <article
      className={cn(
        "rounded-card bg-brown-850 border border-amber-400/20 p-6 md:p-8 flex flex-col justify-between text-left shadow-warm-low transition-colors hover:border-amber-400/40",
        className
      )}
    >
      <div className="space-y-4">
        {/* Star Rating */}
        <div
          className="flex items-center gap-1 text-amber"
          aria-label={`${testimonial.rating} out of 5 stars`}
        >
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber stroke-none" />
          ))}
        </div>

        {/* Quote */}
        <blockquote className="font-serif italic text-base md:text-lg text-sand-bright leading-relaxed">
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>
      </div>

      <div className="pt-6 mt-6 border-t border-amber-400/15 flex items-center justify-between">
        <div>
          <cite className="not-italic block font-display font-bold text-sm tracking-wide text-sand-bright uppercase">
            {testimonial.author}
          </cite>
          <span className="block font-sans text-xs text-sand-muted">
            {testimonial.origin}
          </span>
        </div>
        <div className="text-right">
          <span className="inline-block px-2.5 py-1 rounded-sm bg-brown-900 border border-amber-400/20 font-display text-[11px] font-semibold tracking-wider uppercase text-amber">
            {testimonial.workshopName}
          </span>
        </div>
      </div>
    </article>
  );
};
