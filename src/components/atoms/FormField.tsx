"use client";

import React, { forwardRef } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FormFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  errorMessage?: string;
  required?: boolean;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      label,
      helperText,
      errorMessage,
      required,
      id,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
    const hasError = Boolean(errorMessage);

    return (
      <div className="w-full space-y-1.5 text-left">
        <label
          htmlFor={inputId}
          className="block font-display text-xs md:text-sm font-semibold tracking-wide uppercase text-sand-primary"
        >
          {label}
          {required && <span className="text-amber ml-1">*</span>}
        </label>

        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={
              hasError
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            className={cn(
              "w-full h-[48px] min-h-[44px] px-4 rounded-input bg-brown-900 border text-sand-bright placeholder:text-sand-muted/60 font-sans text-sm md:text-base transition-colors duration-quick",
              hasError
                ? "border-brick focus:border-brick focus:ring-1 focus:ring-brick"
                : "border-amber-400/25 focus:border-amber focus:ring-1 focus:ring-amber",
              "outline-none disabled:opacity-50 disabled:cursor-not-allowed",
              className
            )}
            {...props}
          />
        </div>

        {hasError ? (
          <p
            id={`${inputId}-error`}
            className="flex items-center gap-1.5 text-xs text-brick mt-1 font-sans"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0 stroke-[2]" />
            <span>{errorMessage}</span>
          </p>
        ) : helperText ? (
          <p
            id={`${inputId}-helper`}
            className="text-xs text-sand-muted mt-1 font-sans"
          >
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

FormField.displayName = "FormField";
