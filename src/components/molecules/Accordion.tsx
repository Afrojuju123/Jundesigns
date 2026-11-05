"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  id: string;
  question: string;
  answer: string | React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultOpenIndex?: number;
  allowMultiple?: boolean;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultOpenIndex,
  allowMultiple = false,
  className,
}) => {
  const [openIndices, setOpenIndices] = useState<number[]>(
    typeof defaultOpenIndex === "number" ? [defaultOpenIndex] : []
  );

  const toggle = (idx: number) => {
    if (allowMultiple) {
      setOpenIndices((prev) =>
        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
      );
    } else {
      setOpenIndices((prev) => (prev.includes(idx) ? [] : [idx]));
    }
  };

  return (
    <div className={cn("divide-y divide-brown-800/80 border-y border-brown-800/80", className)}>
      {items.map((item, index) => {
        const isOpen = openIndices.includes(index);
        const triggerId = `accordion-trigger-${item.id}`;
        const panelId = `accordion-panel-${item.id}`;

        return (
          <div key={item.id} className="py-5 sm:py-6 group transition-colors">
            <button
              id={triggerId}
              type="button"
              onClick={() => toggle(index)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="w-full flex items-center justify-between text-left gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-brown-950 rounded-sm cursor-pointer"
            >
              <h3 className="font-serif text-lg sm:text-xl font-semibold text-sand-bright group-hover:text-amber transition-colors">
                {item.question}
              </h3>
              <div
                className={cn(
                  "w-8 h-8 rounded-full border border-amber-400/25 flex items-center justify-center shrink-0 text-amber transition-transform duration-300",
                  isOpen ? "rotate-180 bg-amber text-brown-950 border-amber" : "group-hover:border-amber"
                )}
              >
                <ChevronDown className="w-4 h-4 stroke-[2]" />
              </div>
            </button>

            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className={cn(
                "grid transition-all duration-300 ease-in-out",
                isOpen
                  ? "grid-rows-[1fr] opacity-100 pt-3"
                  : "grid-rows-[0fr] opacity-0 pointer-events-none"
              )}
            >
              <div className="overflow-hidden">
                <div className="font-sans text-sm sm:text-base text-sand-primary leading-relaxed max-w-prose">
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
