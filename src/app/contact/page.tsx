import React from "react";
import { Metadata } from "next";
import { ContactClient } from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact & Location | Kigali Culture Village, Rebero | Jun Designs",
  description:
    "Find Jun Designs at the Kigali Culture Village (Agaseke Center building), Rebero, Kicukiro, Kigali. Call or WhatsApp +250 780 324 944. Workshop sessions daily at 10:00am & 4:00pm.",
  openGraph: {
    title: "Contact Jun Designs Kigali",
    description:
      "Studio location, phone, WhatsApp concierge, and directions to Jun Designs at Kigali Culture Village on Rebero hill.",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
