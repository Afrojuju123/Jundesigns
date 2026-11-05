import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRwf(amount: number): string {
  return `${amount.toLocaleString("en-US")} RWF`;
}
