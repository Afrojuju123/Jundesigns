import { Cormorant_Garamond, DM_Sans, Outfit } from "next/font/google";

export const fontHeading = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-heading",
});

export const fontBody = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-body",
});

export const fontAccent = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-accent",
});
