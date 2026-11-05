import type { Metadata } from "next";
import { fontHeading, fontBody, fontAccent } from "./fonts";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://jundesigns.rw"),
  title: "Jun Designs LTD | Rwandan Cultural Workshops & Artisan Studio",
  description:
    "Learn authentic Imigongo painting, traditional Rwandan dance, carpet hand-weaving, and the historic Igisoro board game with local guides in Kigali, Rwanda. All materials provided.",
  keywords: [
    "Kigali cultural workshops",
    "Imigongo painting workshop Kigali",
    "traditional Rwandan dance class",
    "Agaseke hand weaving Kigali",
    "Igisoro board game Rwanda",
    "things to do in Kigali",
    "Kigali Culture Village Rebero",
    "Rwanda artisan studio",
  ],
  authors: [{ name: "Jun Designs LTD" }],
  creator: "Jun Designs LTD",
  publisher: "Jun Designs LTD",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jundesigns.rw",
    siteName: "Jun Designs",
    title: "Jun Designs LTD | Cultural Workshops in Kigali, Rwanda",
    description:
      "Learn Imigongo painting, hand-weaving, traditional dance and Igisoro with local guides in Kigali. All materials provided, no experience needed.",
    images: [
      {
        url: "/images/imigongo-easel-kigali.jpg",
        width: 1200,
        height: 630,
        alt: "Artisan painting Imigongo relief overlooking Kigali hills",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jun Designs LTD | Cultural Workshops in Kigali, Rwanda",
    description:
      "Book authentic cultural workshops in Kigali: Imigongo painting, traditional dance, sisal weaving, and Igisoro.",
    images: ["/images/imigongo-easel-kigali.jpg"],
  },
  icons: {
    icon: "/brand/logo.png",
    apple: "/brand/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fontHeading.variable} ${fontBody.variable} ${fontAccent.variable}`}
    >
      <body className="bg-brown-900 text-sand antialiased min-h-screen selection:bg-amber selection:text-brown-900">
        {children}
      </body>
    </html>
  );
}
