import React from "react";
import { cn } from "@/lib/utils";

export interface EyebrowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  showLine?: boolean;
}

export const Eyebrow: React.FC<EyebrowProps> = ({
  children,
  showLine = true,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2.5 font-display text-xs md:text-[13px] font-bold uppercase tracking-eyebrow text-amber",
        className
      )}
      {...props}
    >
      {showLine && (
        <span
          className="w-5 h-[1.5px] bg-amber shrink-0"
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </div>
  );
};
