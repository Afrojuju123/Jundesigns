import React from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CalloutProps {
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const Callout: React.FC<CalloutProps> = ({
  title,
  children,
  icon,
  className,
}) => {
  return (
    <aside
      className={cn(
        "relative rounded-card bg-brown-850 border border-amber-400/25 p-5 md:p-6 text-left shadow-warm-low overflow-hidden",
        className
      )}
    >
      {/* 3px accent bar on left */}
      <div
        className="absolute top-0 left-0 bottom-0 w-1 bg-amber"
        aria-hidden="true"
      />

      <div className="flex items-start gap-3.5 pl-2">
        <div className="text-amber mt-0.5 shrink-0">
          {icon || <Info className="w-5 h-5 stroke-[1.5]" />}
        </div>
        <div className="space-y-1">
          {title && (
            <h4 className="font-display font-bold text-sm tracking-wide uppercase text-sand-bright">
              {title}
            </h4>
          )}
          <div className="font-sans text-sm md:text-[15px] text-sand-primary leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </aside>
  );
};
