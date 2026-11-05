import React from "react";
import { Metadata } from "next";
import { WorkshopsIndexClient } from "./WorkshopsIndexClient";

export const metadata: Metadata = {
  title: "Cultural Workshops in Kigali | Imigongo, Dance, Weaving & Igisoro | Jun Designs",
  description:
    "Four hands-on cultural workshops in Kigali. Learn sacred Imigongo geometric painting, hand-weaving, traditional Rwandan dance and Igisoro board game with local guides on Rebero hill.",
  openGraph: {
    title: "Cultural Workshops in Kigali | Jun Designs",
    description:
      "Four hands-on experiences in Kigali. Each lasts two hours, runs every day at 10:00am and 4:00pm, and includes all materials and a local guide.",
    images: [{ url: "/images/imigongo-easel-kigali.jpg", width: 1200, height: 630 }],
  },
};

export default function WorkshopsPage() {
  return <WorkshopsIndexClient />;
}
