import React from "react";
import { cn } from "@/lib/utils";

export interface FactItem {
  label: string;
  value: React.ReactNode;
  hint?: string;
}

export interface FactListProps {
  items: FactItem[];
  columns?: 1 | 2 | 3;
  className?: string;
}

export const FactList: React.FC<FactListProps> = ({
  items,
  columns = 2,
  className,
}) => {
  const colClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  }[columns];

  return (
    <dl
      className={cn(
        "grid gap-px bg-amber-400/20 border border-amber-400/20 rounded-card overflow-hidden",
        colClass,
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          className="bg-brown-850 p-5 md:p-6 flex flex-col justify-between transition-colors hover:bg-brown-800"
        >
          <dt className="font-display text-xs font-bold uppercase tracking-eyebrow text-sand-muted mb-2">
            {item.label}
          </dt>
          <dd className="font-sans text-base md:text-lg font-semibold text-sand-bright">
            {item.value}
          </dd>
          {item.hint && (
            <p className="font-sans text-xs text-sand-muted mt-1.5 leading-normal">
              {item.hint}
            </p>
          )}
        </div>
      ))}
    </dl>
  );
};
