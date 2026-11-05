"use client";

import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary";
  size?: "default" | "sm" | "lg";
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "default",
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-display font-bold uppercase transition-all duration-quick select-none outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-brown-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

    const variantStyles = {
      primary:
        "bg-amber text-brown-900 tracking-button rounded-pill hover:bg-amber-500 active:bg-amber-600 disabled:hover:bg-amber shadow-sm",
      secondary:
        "border border-amber-400/80 text-amber tracking-button rounded-pill bg-transparent hover:bg-amber/10 active:bg-amber/20 disabled:hover:bg-transparent",
      tertiary:
        "text-amber hover:text-amber-300 normal-case tracking-normal underline-offset-4 hover:underline p-0 bg-transparent disabled:hover:no-underline",
    };

    const sizeStyles = {
      sm: variant === "tertiary" ? "text-sm" : "h-[42px] px-5 text-xs min-h-[44px]",
      default: variant === "tertiary" ? "text-base" : "h-[52px] px-8 text-sm min-h-[44px]",
      lg: variant === "tertiary" ? "text-lg" : "h-[58px] px-10 text-base min-h-[44px]",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin stroke-[2]" />
            <span>{loadingText || "Reserving..."}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="mr-2 inline-flex">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="ml-2 inline-flex">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
