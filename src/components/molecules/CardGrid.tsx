import React from "react";
import { cn } from "@/lib/utils";

export interface CardGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 2 | 3 | 4;
  children: React.ReactNode;
}

export const CardGrid: React.FC<CardGridProps> = ({
  columns = 3,
  className,
  children,
  ...props
}) => {
  const colStyles = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  }[columns];

  return (
    <div
      className={cn(
        "grid gap-6 sm:gap-8 items-stretch w-full",
        colStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
