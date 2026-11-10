import React from "react";
import Image from "next/image";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { SectionHeading } from "@/components/atoms/SectionHeading";
import { CardGrid } from "@/components/molecules/CardGrid";
import { SCHOOL_ACTIVITIES } from "@/data/schools";

const ACTIVITY_DESCRIPTIONS: Record<string, { desc: string; takeaway?: string }> = {
  storytelling: {
    desc: "Students gather to hear Rwandan oral traditions, the origins of cultural crafts, and the symbolism embedded in everyday heritage objects.",
    takeaway: "Interactive Q&A with elder narrators",
  },
  blacksmithing: {
    desc: "A live demonstration of historic Rwandan ironworking, showing how bellows, charcoal heat, and anvils were used to forge tools and royal regalia.",
    takeaway: "Supervised from designated viewing perimeters with protective safety barriers",
  },
  dance: {
    desc: "Active movement workshop where students learn the posture, arm gestures, and rhythms of traditional Intore dancing alongside professional dancers.",
    takeaway: "Full group participation with traditional music",
  },
  "imigongo-live": {
    desc: "Artisans demonstrate how traditional relief ridges are hand-moulded onto wood boards using organic binders and historic geometric templates.",
    takeaway: "Step-by-step master artisan demonstration",
  },
  "imigongo-painting": {
    desc: "Every student receives a prepared geometric Imigongo relief board and paints it using traditional natural earth pigments (soot black, ochre red, and chalk white).",
    takeaway: "Each student takes their painted artwork home",
  },
  pottery: {
    desc: "Students work directly with natural clay, learning foundational coil-building, surface smoothing, and shaping techniques used in Rwandan vessels.",
    takeaway: "Hands-on tactile clay experience",
  },
  "women-weaving": {
    desc: "Artisans demonstrate how sisal plant fibers are harvested, dyed with natural plant extracts, and hand-woven into world-renowned Agaseke peace baskets.",
    takeaway: "Observation of traditional handloom & spiral coiling",
  },
};

const TYPE_LABELS: Record<string, { label: string; colorClass: string }> = {
  "hands-on": { label: "Hands-On Workshop", colorClass: "bg-amber/15 text-amber border-amber/30" },
  demonstration: { label: "Artisan Demonstration", colorClass: "bg-sand-muted/15 text-sand-bright border-sand-muted/30" },
  "cultural-talk": { label: "Oral History & Talk", colorClass: "bg-terracotta/15 text-terracotta border-terracotta/30" },
  movement: { label: "Dance & Movement", colorClass: "bg-amber/20 text-amber-300 border-amber-300/30" },
};

export const SchoolsActivities: React.FC = () => {
  const activityList = Object.values(SCHOOL_ACTIVITIES);

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-20 bg-brown-800 border-y border-amber-400/20 text-left">
      <div className="max-w-content mx-auto space-y-16">
        <div className="max-w-3xl space-y-3">
          <Eyebrow>CURRICULUM &amp; CRAFTS</Eyebrow>
          <SectionHeading
            level="h2"
            title="What Students *Experience &amp; Learn*"
          />
          <p className="font-sans text-base sm:text-lg text-sand-primary leading-relaxed">
            Our educational workshops rotate students through guided artisan stations. Sessions combine active making, physical movement, and direct observation with elder craftspeople.
          </p>
        </div>

        {/* Equal Aligned Grid of 8 Activities */}
        <CardGrid columns={2}>
          {activityList.map((activity) => {
            const meta = ACTIVITY_DESCRIPTIONS[activity.id] || { desc: activity.name };
            const typeInfo = TYPE_LABELS[activity.type] || { label: activity.type, colorClass: "bg-stone-800 text-stone-200" };

            return (
              <article
                key={activity.id}
                className="rounded-card bg-brown-850 border border-amber-400/20 p-6 sm:p-7 flex flex-col h-full shadow-warm-low hover:border-amber-400/50 transition-all select-none"
              >
                <div className="relative aspect-[4/3] w-full rounded-card overflow-hidden border border-amber-400/20 bg-brown-900 mb-5 shrink-0">
                  <Image
                    src={activity.image}
                    alt={activity.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 550px"
                    className="object-cover transition-transform duration-smooth hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-pill text-[11px] font-display font-bold uppercase tracking-wider border backdrop-blur-md ${typeInfo.colorClass}`}
                    >
                      {typeInfo.label}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col flex-1">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-sand-bright line-clamp-2 min-h-[3.5rem] flex items-center">
                    {activity.name}
                  </h3>

                  <p className="font-sans text-sm sm:text-base text-sand-primary leading-relaxed line-clamp-2 min-h-[3rem] mt-2">
                    {meta.desc}
                  </p>

                  {meta.takeaway && (
                    <div className="mt-auto pt-4 border-t border-amber-400/15 text-xs font-mono text-sand-muted flex items-start gap-2 min-h-[3rem]">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber shrink-0 mt-1" />
                      <span className="line-clamp-2">{meta.takeaway}</span>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </CardGrid>
      </div>
    </section>
  );
};
