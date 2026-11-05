import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { workshops } from "@/content/workshops";
import { testimonials } from "@/content/testimonials";
import { WorkshopView } from "./WorkshopView";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return workshops.map((workshop) => ({
    slug: workshop.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const workshop = workshops.find((w) => w.slug === slug);
  if (!workshop) return {};

  return {
    title: `${workshop.name} Workshop in Kigali | Jun Designs`,
    description: `${workshop.intro} Book your 2-hour ${workshop.name.toLowerCase()} session in Kigali, Rwanda. All materials included.`,
    openGraph: {
      title: `${workshop.name} — Cultural Workshop in Kigali`,
      description: workshop.intro,
      images: [
        {
          url: workshop.heroImages.large,
          width: 1200,
          height: 630,
          alt: `${workshop.name} at Jun Designs studio in Kigali`,
        },
      ],
    },
  };
}

export default async function WorkshopPage({ params }: PageProps) {
  const { slug } = await params;
  const workshop = workshops.find((w) => w.slug === slug);

  if (!workshop) {
    notFound();
  }

  // Find exclusive testimonial for this workshop only (if exists)
  const testimonial = testimonials.find((t) => t.workshopSlug === workshop.slug) || null;

  // Other three workshops
  const otherWorkshops = workshops.filter((w) => w.slug !== workshop.slug);

  return (
    <WorkshopView
      workshop={workshop}
      testimonial={testimonial}
      otherWorkshops={otherWorkshops}
    />
  );
}
