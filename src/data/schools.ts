/**
 * Schools & Groups Data (Single Source of Truth)
 * Jun Designs LTD · Kigali, Rwanda
 */

export interface PriceTier {
  min: number;
  max: number; // Use Infinity for open-ended top tier
  pricePerStudent: number;
  label: string;
}

export type SchoolPackageId = "bronze" | "silver" | "gold";

export interface SchoolPackage {
  id: SchoolPackageId;
  name: string;
  minStudents: number;
  colorClass: string;
  accentVar: string;
  activities: string[]; // Activity IDs
  tiers: PriceTier[];
}

export interface SchoolActivity {
  id: string;
  name: string;
  type: "hands-on" | "demonstration" | "cultural-talk" | "movement";
  descriptionPlaceholder: string;
  safetyNote?: string;
  image: string;
}

export const SCHOOL_AUDIENCE =
  "Primary to secondary schools use the packages; universities are customised.";

export const SCHOOLS_CONTACT_PHONE = "+250 780 324 944";

export const SCHOOL_ACTIVITIES: Record<string, SchoolActivity> = {
  storytelling: {
    id: "storytelling",
    name: "Storytelling on early Rwandan history and culture",
    type: "cultural-talk",
    descriptionPlaceholder:
      "[CONTENT NEEDED: one or two plain sentences from the owner describing the historical narrative covered for students]",
    image: "/images/schools/schools-painting-veranda.jpg",
  },
  blacksmithing: {
    id: "blacksmithing",
    // [CONFIRM] spelling gucura vs gucuru; add safety note [CONTENT NEEDED]
    name: "Live blacksmithing (gucura)",
    type: "demonstration",
    descriptionPlaceholder:
      "[CONTENT NEEDED: one or two plain sentences from the owner describing traditional metal forging methods]",
    safetyNote:
      "[CONTENT NEEDED: Student observation distance and protective barriers for live forge demonstrations]",
    image: "/images/schools/schools-painting-mat.jpg",
  },
  dance: {
    id: "dance",
    name: "Learning traditional dance",
    type: "movement",
    descriptionPlaceholder:
      "[CONTENT NEEDED: one or two plain sentences from the owner on rhythm, posture, and group movements taught]",
    image: "/images/schools/schools-dance-pavilion.jpg",
  },
  "imigongo-live": {
    id: "imigongo-live",
    name: "Live Imigongo production",
    type: "demonstration",
    descriptionPlaceholder:
      "[CONTENT NEEDED: one or two plain sentences on demonstrating traditional clay and organic relief shaping]",
    image: "/images/imigongo-easel-kigali.jpg",
  },
  "imigongo-painting": {
    id: "imigongo-painting",
    // [CONFIRM] source says "Painting umugongo"
    name: "Imigongo painting",
    type: "hands-on",
    descriptionPlaceholder:
      "[CONTENT NEEDED: one or two plain sentences on students painting prepared geometric relief boards with natural pigments to take home]",
    image: "/images/schools/schools-painting-circle.jpg",
  },
  pottery: {
    id: "pottery",
    name: "Pottery",
    type: "hands-on",
    descriptionPlaceholder:
      "[CONTENT NEEDED: one or two plain sentences from the owner describing clay shaping and coil techniques]",
    image: "/images/schools/schools-painting-mat.jpg",
  },
  "women-weaving": {
    id: "women-weaving",
    name: "Women weaving",
    type: "demonstration",
    descriptionPlaceholder:
      "[CONTENT NEEDED: one or two plain sentences on observing master Rwandan artisans hand-weave sisal patterns]",
    image: "/images/weaving/weaving-hands-loom.jpg",
  },
  "guhiha-live": {
    id: "guhiha-live",
    // [CONFIRM] needs a one-line explanation for readers who do not know the term
    name: "Live guhiha",
    type: "demonstration",
    descriptionPlaceholder:
      "[CONTENT NEEDED: one or two plain sentences explaining the traditional Rwandan craft of guhiha]",
    image: "/images/schools/schools-dance-outdoors.jpg",
  },
};

export const SCHOOL_PACKAGES: SchoolPackage[] = [
  {
    id: "bronze",
    name: "Bronze",
    minStudents: 25,
    colorClass: "text-[#B87333] border-[#B87333]", // Bronze metallic heritage
    accentVar: "var(--bronze-500, #B87333)",
    // activities: storytelling, blacksmithing, dance, imigongo-live, guhiha-live
    activities: [
      "storytelling",
      "blacksmithing",
      "dance",
      "imigongo-live",
      "guhiha-live",
    ],
    // tiers: { 25-65: 5000, 66-130: 5000, 131+: 4500 }
    // [CONFIRM] first two tiers identical (5,000 RWF), possible source typo
    tiers: [
      { min: 25, max: 65, pricePerStudent: 5000, label: "25–65 students" },
      { min: 66, max: 130, pricePerStudent: 5000, label: "66–130 students" },
      { min: 131, max: Infinity, pricePerStudent: 4500, label: "131+ students" },
    ],
  },
  {
    id: "silver",
    name: "Silver",
    minStudents: 35,
    colorClass: "text-stone-300 border-stone-300", // Neutral sand silver
    accentVar: "var(--sand-300, #D4C5B9)",
    // activities: storytelling, blacksmithing, imigongo-live, imigongo-painting, pottery, dance
    // [CONFIRM] Silver has no guhiha-live while Bronze and Gold do
    activities: [
      "storytelling",
      "blacksmithing",
      "imigongo-live",
      "imigongo-painting",
      "pottery",
      "dance",
    ],
    // tiers: { 35-100: 7000, 101-200: 6500, 201+: 6000 }
    tiers: [
      { min: 35, max: 100, pricePerStudent: 7000, label: "35–100 students" },
      { min: 101, max: 200, pricePerStudent: 6500, label: "101–200 students" },
      { min: 201, max: Infinity, pricePerStudent: 6000, label: "201+ students" },
    ],
  },
  {
    id: "gold",
    name: "Gold",
    minStudents: 50,
    colorClass: "text-amber border-amber", // Amber gold
    accentVar: "var(--amber-500, #D97706)",
    // activities: storytelling, blacksmithing, imigongo-live, pottery, imigongo-painting, dance, women-weaving, guhiha-live
    activities: [
      "storytelling",
      "blacksmithing",
      "imigongo-live",
      "pottery",
      "imigongo-painting",
      "dance",
      "women-weaving",
      "guhiha-live",
    ],
    // tiers: { 50-100: 8000, 101-200: 7500, 201+: 7000 }
    // [CONFIRM] source says "200 & above"; treated as 201+ to avoid ambiguity with 101-200
    tiers: [
      { min: 50, max: 100, pricePerStudent: 8000, label: "50–100 students" },
      { min: 101, max: 200, pricePerStudent: 7500, label: "101–200 students" },
      { min: 201, max: Infinity, pricePerStudent: 7000, label: "201+ students" },
    ],
  },
];

/**
 * Returns available packages for a given group size n
 */
export function getPackagesForGroupSize(n: number): SchoolPackage[] {
  if (n < 1 || isNaN(n)) return [];
  return SCHOOL_PACKAGES.filter((pkg) => n >= pkg.minStudents);
}

/**
 * Returns price per student in RWF for a package and group size n,
 * or null if n is below package minimum.
 */
export function getPricePerStudent(
  packageId: SchoolPackageId,
  n: number
): number | null {
  if (n < 1 || isNaN(n)) return null;
  const pkg = SCHOOL_PACKAGES.find((p) => p.id === packageId);
  if (!pkg || n < pkg.minStudents) return null;

  for (const tier of pkg.tiers) {
    if (n >= tier.min && n <= tier.max) {
      return tier.pricePerStudent;
    }
  }

  return null;
}

export interface EstimateResult {
  packageId: SchoolPackageId;
  packageName: string;
  students: number;
  perStudent: number;
  total: number;
  tierLabel: string;
}

/**
 * Computes estimated total cost and returns breakdown,
 * or null if n is below package minimum.
 */
export function estimateTotal(
  packageId: SchoolPackageId,
  n: number
): EstimateResult | null {
  const pkg = SCHOOL_PACKAGES.find((p) => p.id === packageId);
  if (!pkg || n < pkg.minStudents || isNaN(n)) return null;

  for (const tier of pkg.tiers) {
    if (n >= tier.min && n <= tier.max) {
      const perStudent = tier.pricePerStudent;
      const total = perStudent * n;
      return {
        packageId,
        packageName: pkg.name,
        students: n,
        perStudent,
        total,
        tierLabel: tier.label,
      };
    }
  }

  return null;
}
