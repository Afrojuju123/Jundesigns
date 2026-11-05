import React from "react";
import { Metadata } from "next";
import { SchoolsPageClient } from "./SchoolsPageClient";

export const metadata: Metadata = {
  title: "Schools & Groups Cultural Workshops in Kigali | Jun Designs",
  description:
    "Educational Rwandan cultural workshops for primary schools, secondary schools and universities in Kigali. Hands-on Imigongo relief painting, traditional dance, blacksmithing, and pottery at Kigali Culture Village, Rebero.",
  alternates: {
    canonical: "/schools",
  },
  openGraph: {
    title: "Schools & Groups Cultural Workshops in Kigali | Jun Designs",
    description:
      "Structured cultural visits for school and student groups in Kigali. Hands-on learning led by local master artisans at Kigali Culture Village on Rebero hill.",
    url: "/schools",
    images: [
      {
        url: "/images/schools/schools-painting-veranda.jpg",
        width: 1200,
        height: 630,
        alt: "School students learning traditional Rwandan crafts at Jun Designs Kigali",
      },
    ],
  },
};

export default function SchoolsPage() {
  return <SchoolsPageClient />;
}
