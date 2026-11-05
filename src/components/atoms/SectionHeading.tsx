import React from "react";
import { cn } from "@/lib/utils";

export interface SectionHeadingProps {
  level?: "h1" | "h2" | "h3";
  title?: string;
  children?: React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  level = "h2",
  title,
  children,
  align = "left",
  className,
}) => {
  const alignStyles = {
    left: "text-left",
    center: "text-center mx-auto",
    right: "text-right ml-auto",
  };

  const levelStyles = {
    h1: "text-[clamp(3.5rem,6vw+1rem,6rem)] leading-[1.08] tracking-[-0.02em]",
    h2: "text-[clamp(2.25rem,3.5vw+0.5rem,3.5rem)] leading-[1.15] tracking-[-0.015em]",
    h3: "text-[clamp(1.375rem,1.5vw+0.5rem,1.75rem)] leading-[1.25] tracking-[-0.01em]",
  };

  const HeadingTag = level;

  // Helper to parse `*emphasised words*` into `<em class="italic text-amber">`
  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*[^*]+\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("*") && part.endsWith("*")) {
        return (
          <em
            key={index}
            className="italic text-amber not-italic:font-normal font-serif transition-colors duration-quick"
          >
            {part.slice(1, -1)}
          </em>
        );
      }
      return <React.Fragment key={index}>{part}</React.Fragment>;
    });
  };

  return (
    <HeadingTag
      className={cn(
        "font-serif font-bold text-sand-bright",
        levelStyles[level],
        alignStyles[align],
        className
      )}
    >
      {title ? renderFormattedText(title) : children}
    </HeadingTag>
  );
};
