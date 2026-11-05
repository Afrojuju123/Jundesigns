import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brown: {
          950: "#140B05",
          900: "#1F1209", // deep canvas base
          850: "#25160B",
          800: "#2D1A0D", // main section surface
          700: "#3A2311", // elevated card surface
          600: "#482C15", // medium warm earth
          500: "#5A3A1F",
          400: "#6D4A2A",
          300: "#8B6640",
          200: "#B8956A", // bronze sand accent
          100: "#D4BB9A",
        },
        amber: {
          50: "#FDF7ED",
          100: "#FBEDD5",
          200: "#F7D9AA",
          300: "#F5B24E",
          400: "#F29C1F", // primary CTA & emphasis
          500: "#E0870E",
          600: "#C97307",
          700: "#9E5506",
          DEFAULT: "#F29C1F",
        },
        sand: {
          bright: "#FFF8F0", // headings & titles (cream ivory)
          primary: "#F0E4D6", // primary text
          DEFAULT: "#C9B8A4", // body text on dark
          muted: "#988574", // muted metadata (4.70:1 WCAG AA)
        },
        brick: {
          DEFAULT: "#E06D53", // muted error terracotta
          subtle: "rgba(224, 109, 83, 0.12)",
        },
        surface: {
          light: "#F9F6F0",
          white: "#FFFFFF",
          card: "rgba(255, 255, 255, 0.04)",
          "card-hover": "rgba(255, 255, 255, 0.08)",
        },
      },
      fontFamily: {
        serif: ["var(--font-heading)", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-body)", "DM Sans", "system-ui", "sans-serif"],
        display: ["var(--font-accent)", "Outfit", "system-ui", "sans-serif"],
      },
      borderRadius: {
        input: "8px",
        card: "16px",
        hero: "28px",
        pill: "9999px",
      },
      boxShadow: {
        "warm-low": "0 8px 32px -4px rgba(15, 8, 3, 0.45)",
        drawer: "-12px 0 48px 0 rgba(10, 5, 2, 0.65)",
      },
      maxWidth: {
        content: "1200px",
      },
      letterSpacing: {
        eyebrow: "0.2em",
        button: "0.08em",
      },
      transitionDuration: {
        quick: "180ms",
        smooth: "280ms",
        drawer: "380ms",
      },
    },
  },
  plugins: [],
};

export default config;
