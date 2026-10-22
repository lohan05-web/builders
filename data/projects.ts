/**
 * Project gallery data for the LM Builders site.
 *
 * Images are hosted on Unsplash and optimised through `next/image`
 * (`images.unsplash.com` is already allowed in `next.config.mjs`).
 */

/** The four service categories a project can belong to. */
export type ProjectCategory =
  | "Residential"
  | "Commercial"
  | "Interiors"
  | "Renovation";

export interface Project {
  /** Stable identifier — used as the React key and lightbox identifier. */
  id: string;
  /** URL-friendly slug used for individual project pages. */
  slug: string;
  /** Project name. */
  title: string;
  /** Category used by the gallery filter tabs. */
  category: ProjectCategory;
  /** City / region the project was built in. */
  location: string;
  /** Unsplash image URL (already sized for the lightbox). */
  image: string;
  /**
   * Alternative text for the main photo.
   *
   * Comes from the CMS when the project is managed in Sanity; empty for the
   * local fallback data, in which case the title is used instead.
   */
  imageAlt?: string;
  /** Built area in square feet. */
  area: number;
  /** Year of completion. */
  year: number;
  /** Short project summary (2-3 lines). */
  description: string;
  /** Construction duration. */
  duration: string;
  /** Indicative budget range in INR. */
  budgetRange: string;
  /** Materials used on the project. */
  materials: string[];
  /** Key features delivered. */
  features: string[];
  /** Gallery images for the detail page (4-6 URLs). */
  gallery: string[];
}

/** Unsplash helper — keeps the query string consistent across the file. */
const unsplash = (id: string, w = 2000) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const projects: Project[] = [
  // --- Residential -------------------------------------------------------
  {
    id: "riverside-villa",
    slug: "riverside-villa",
    title: "Riverside Villa",
    category: "Residential",
    location: "Andheri West, Mumbai",
    image: unsplash("photo-1600585154340-be6161a56a0c"),
    area: 6800,
    year: 2024,
    description:
      "A contemporary riverside villa crafted with clean lines, large glazing and a seamless indoor-outdoor flow. Designed for relaxed living, it balances privacy with open social spaces.\nCareful material selection and precision detailing give this home a timeless, understated luxury.",
    duration: "12 months",
    budgetRange: "Rs. 5 Cr - 6 Cr",
    materials: ["Reinforced concrete", "Natural stone cladding", "Teak wood", "Low-E glass", "Italian marble"],
    features: ["Infinity-edge terrace", "Private landscaped garden", "Home automation", "Rainwater harvesting", "EV charging point"],
    gallery: [
      unsplash("photo-1600585152220-90363fe7e115", 1800),
      unsplash("photo-1613490493576-7fde63acd811", 1800),
      unsplash("photo-1512917774080-9991f1c4c750", 1800),
      unsplash("photo-1600607687939-ce8a6c25118c", 1800),
      unsplash("photo-1600566753190-17f0baa2a6c3", 1800),
    ],
  },
  {
    id: "cedar-heights-residence",
    slug: "cedar-heights-residence",
    title: "Cedar Heights Residence",
    category: "Residential",
    location: "Powai, Mumbai",
    image: unsplash("photo-1600596542815-ffad4c1539a9"),
    area: 4200,
    year: 2023,
    description:
      "A warm, family-focused residence that blends modern construction with natural textures. The layout prioritises daylight, cross-ventilation and generous communal spaces.\nEvery level is tailored for comfort, with private zones kept calm and serene.",
    duration: "9 months",
    budgetRange: "Rs. 3 Cr - 3.6 Cr",
    materials: ["AAC blocks", "Cedar wood accents", "Porcelain tiles", "Sandstone", "UPVC windows"],
    features: ["Double-height living", "Skylit courtyard", "Modular kitchen", "Children's play area", "Solar water heating"],
    gallery: [
      unsplash("photo-1600585152220-90363fe7e115", 1800),
      unsplash("photo-1600210492486-724fe5c67fb0", 1800),
      unsplash("photo-1513694203232-719a280e022f", 1800),
      unsplash("photo-1600573472550-8090b5e0745e", 1800),
      unsplash("photo-1507089947368-19c1da9775ae", 1800),
    ],
  },
  {
    id: "oakwood-family-home",
    slug: "oakwood-family-home",
    title: "Oakwood Family Home",
    category: "Residential",
    location: "Bandra West, Mumbai",
    image: unsplash("photo-1512917774080-9991f1c4c750"),
    area: 3600,
    year: 2024,
    description:
      "An elegant urban family home designed for multi-generational living. Smart zoning keeps shared and private areas distinct without sacrificing openness.\nThe result is a bright, low-maintenance home built for decades of use.",
    duration: "8 months",
    budgetRange: "Rs. 2.4 Cr - 2.9 Cr",
    materials: ["RCC frame", "Engineered wood flooring", "Vitrified tiles", "Gypsum plaster", "Anodised aluminium"],
    features: ["Home lift provision", "Terrace lounge", "Home office", "Rainwater harvesting", "Smart security"],
    gallery: [
      unsplash("photo-1493809842364-78817add7ffb", 1800),
      unsplash("photo-1522708323590-d24dbb6b0267", 1800),
      unsplash("photo-1600566753086-00f18fb6b3ea", 1800),
      unsplash("photo-1616486338812-3dadae4b4ace", 1800),
      unsplash("photo-1600121848594-d8644e57abab", 1800),
    ],
  },

  // --- Commercial --------------------------------------------------------
  {
    id: "meridian-business-park",
    slug: "meridian-business-park",
    title: "Meridian Business Park",
    category: "Commercial",
    location: "BKC, Mumbai",
    image: unsplash("photo-1486406146926-c627a92ad1ab"),
    area: 42000,
    year: 2024,
    description:
      "A grade-A business park delivering flexible floor plates, efficient circulation and future-ready MEP systems. Built for scale with a focus on sustainability and tenant comfort.\nThe façade balances daylighting with heat control for year-round efficiency.",
    duration: "18 months",
    budgetRange: "Rs. 48 Cr - 55 Cr",
    materials: ["RCC shear wall", "Curtain wall glazing", "Granite cladding", "Raised access flooring", "Epoxy flooring"],
    features: ["High-speed elevators", "Central HVAC", "100% DG backup", "Ample parking", "IGBC-aligned systems"],
    gallery: [
      unsplash("photo-1497366216548-37526070297c", 1800),
      unsplash("photo-1497366754035-f200968a6e72", 1800),
      unsplash("photo-1497366811353-6870744d04b2", 1800),
      unsplash("photo-1449157291145-7efd050a4d0e", 1800),
      unsplash("photo-1524758631624-e2822e304c36", 1800),
    ],
  },
  {
    id: "harbor-point-offices",
    slug: "harbor-point-offices",
    title: "Harbor Point Offices",
    category: "Commercial",
    location: "Lower Parel, Mumbai",
    image: unsplash("photo-1449157291145-7efd050a4d0e"),
    area: 28000,
    year: 2023,
    description:
      "A boutique commercial tower designed for modern enterprises. Efficient floor plates and generous amenities create a refined work environment.\nIntegrated building systems keep operations smooth and energy use in check.",
    duration: "14 months",
    budgetRange: "Rs. 28 Cr - 34 Cr",
    materials: ["RCC frame", "Glass façade", "Aluminium composite", "Vitrified tiles", "Acoustic ceilings"],
    features: ["Double-glazed façade", "Smart access control", "Cafeteria", "Conference suites", "End-of-trip facilities"],
    gallery: [
      unsplash("photo-1497366216548-37526070297c", 1800),
      unsplash("photo-1486406146926-c627a92ad1ab", 1800),
      unsplash("photo-1524758631624-e2822e304c36", 1800),
      unsplash("photo-1497366754035-f200968a6e72", 1800),
      unsplash("photo-1449247709967-d4461a6a6103", 1800),
    ],
  },
  {
    id: "atlas-coworking-hub",
    slug: "atlas-coworking-hub",
    title: "Atlas Co-Working Hub",
    category: "Commercial",
    location: "Andheri East, Mumbai",
    image: unsplash("photo-1497366754035-f200968a6e72"),
    area: 9500,
    year: 2025,
    description:
      "A vibrant co-working hub built for agility and community. Flexible layouts, acoustic zoning and biophilic touches keep energy high without losing focus.\nDelivered with speed and precision to meet a tight handover timeline.",
    duration: "6 months",
    budgetRange: "Rs. 9 Cr - 11 Cr",
    materials: ["RCC frame", "Acoustic panels", "Polished concrete", "Carpet tiles", "Toughened glass"],
    features: ["Hot desks & private cabins", "Phone booths", "Event space", "Pantry & lounge", "High-speed IT backbone"],
    gallery: [
      unsplash("photo-1524758631624-e2822e304c36", 1800),
      unsplash("photo-1497366216548-37526070297c", 1800),
      unsplash("photo-1497366811353-6870744d04b2", 1800),
      unsplash("photo-1449157291145-7efd050a4d0e", 1800),
      unsplash("photo-1486406146926-c627a92ad1ab", 1800),
    ],
  },

  // --- Interiors ---------------------------------------------------------
  {
    id: "whitmore-living-room",
    slug: "whitmore-living-room",
    title: "The Whitmore Living Room",
    category: "Interiors",
    location: "Bandra West, Mumbai",
    image: unsplash("photo-1600210492486-724fe5c67fb0"),
    area: 1100,
    year: 2024,
    description:
      "A refined living space defined by calm palettes, layered lighting and bespoke joinery. Every element was curated to feel collected over time rather than over-designed.\nSubtle textures create depth without visual clutter.",
    duration: "3 months",
    budgetRange: "Rs. 28L - 36L",
    materials: ["Italian marble", "Engineered oak", "Linen upholstery", "Brushed brass", "Microcement"],
    features: ["Bespoke TV unit", "Concealed lighting", "Custom drapery", "Acoustic treatment", "Integrated AV"],
    gallery: [
      unsplash("photo-1616486338812-3dadae4b4ace", 1800),
      unsplash("photo-1600566753086-00f18fb6b3ea", 1800),
      unsplash("photo-1513694203232-719a280e022f", 1800),
      unsplash("photo-1600573472550-8090b5e0745e", 1800),
      unsplash("photo-1507089947368-19c1da9775ae", 1800),
    ],
  },
  {
    id: "penthouse-interior-design",
    slug: "penthouse-interior-design",
    title: "Penthouse Interior Design",
    category: "Interiors",
    location: "Worli, Mumbai",
    image: unsplash("photo-1616486338812-3dadae4b4ace"),
    area: 2400,
    year: 2025,
    description:
      "A sky-high penthouse where sweeping views drive every design decision. Floor-to-ceiling glazing is framed by warm, tactile finishes for a sense of understated grandeur.\nThe scheme balances entertaining scale with intimate, cozy corners.",
    duration: "4 months",
    budgetRange: "Rs. 65L - 85L",
    materials: ["Statuario marble", "Walnut veneer", "Silk wallpaper", "Polished nickel", "Hand-knotted carpet"],
    features: ["Wine display", "Home bar", "Master suite spa", "Private terrace", "Motorised blinds"],
    gallery: [
      unsplash("photo-1600210492486-724fe5c67fb0", 1800),
      unsplash("photo-1615873968403-89e068629265", 1800),
      unsplash("photo-1554995207-c18c203602cb", 1800),
      unsplash("photo-1600566753051-f0b89df2dd90", 1800),
      unsplash("photo-1600573472592-401b489a3cdc", 1800),
    ],
  },
  {
    id: "lakeside-kitchen-dining",
    slug: "lakeside-kitchen-dining",
    title: "Lakeside Kitchen & Dining",
    category: "Interiors",
    location: "Powai, Mumbai",
    image: unsplash("photo-1600566753086-00f18fb6b3ea"),
    area: 850,
    year: 2023,
    description:
      "A warm, sociable kitchen-dining space designed for everyday family life and effortless entertaining. Clever storage keeps surfaces clean while details add character.\nNatural light and soft materials make it the heart of the home.",
    duration: "2 months",
    budgetRange: "Rs. 14L - 18L",
    materials: ["Quartz countertop", "Shaker cabinetry", "Terracotta tiles", "Brushed bronze", "Solid oak"],
    features: ["Island with seating", "Walk-in pantry", "Built-in banquette", "Wine rack", "Task lighting"],
    gallery: [
      unsplash("photo-1556912167-f556f1f39fdf", 1800),
      unsplash("photo-1600566753051-f0b89df2dd90", 1800),
      unsplash("photo-1617103996702-96ff29b1c467", 1800),
      unsplash("photo-1502672260266-1c1ef2d93688", 1800),
      unsplash("photo-1600573472592-401b489a3cdc", 1800),
    ],
  },

  // --- Renovation --------------------------------------------------------
  {
    id: "old-mill-cottage-restoration",
    slug: "old-mill-cottage-restoration",
    title: "Old Mill Cottage Restoration",
    category: "Renovation",
    location: "Alibaug, Maharashtra",
    image: unsplash("photo-1581858726788-75bc0f6a952d"),
    area: 2400,
    year: 2024,
    description:
      "A sensitive restoration that brought a neglected cottage back to life while keeping its original soul intact. We repaired, reinforced and reimagined without erasing the years of history.\nModern comforts were slipped in discreetly behind period details.",
    duration: "10 months",
    budgetRange: "Rs. 1.8 Cr - 2.2 Cr",
    materials: ["Restored laterite stone", "Reclaimed teak", "Lime plaster", "Handmade tiles", "Traditional lime mortar"],
    features: ["Structural strengthening", "New roofing", "Period-accurate joinery", "Heritage landscaping", "Discrete MEP upgrades"],
    gallery: [
      unsplash("photo-1503174971373-b1f69850bded", 1800),
      unsplash("photo-1502005097973-6a7082348e28", 1800),
      unsplash("photo-1590725140246-20acdee442be", 1800),
      unsplash("photo-1507089947368-19c1da9775ae", 1800),
      unsplash("photo-1504307651254-35680f356dfd", 1800),
    ],
  },
  {
    id: "sunset-bungalow-makeover",
    slug: "sunset-bungalow-makeover",
    title: "Sunset Bungalow Makeover",
    category: "Renovation",
    location: "Juhu, Mumbai",
    image: unsplash("photo-1590725140246-20acdee442be"),
    area: 1800,
    year: 2023,
    description:
      "A full makeover that opened up a dark, compartmentalised bungalow into a light-filled contemporary home. Walls came down where safe to do so, and every surface was renewed.\nThe brief was modern living with warmth and character.",
    duration: "7 months",
    budgetRange: "Rs. 1.2 Cr - 1.6 Cr",
    materials: ["RCC repairs", "Engineered wood flooring", "Large-format tiles", "Gypsum", "Powder-coated aluminium"],
    features: ["Open-plan living", "New façade", "Spa-style bathrooms", "Modular kitchen", "Rooftop deck"],
    gallery: [
      unsplash("photo-1503174971373-b1f69850bded", 1800),
      unsplash("photo-1581858726788-75bc0f6a952d", 1800),
      unsplash("photo-1560448075-bb485b067938", 1800),
      unsplash("photo-1615873968403-89e068629265", 1800),
      unsplash("photo-1502005097973-6a7082348e28", 1800),
    ],
  },
  {
    id: "harbour-warehouse-conversion",
    slug: "harbour-warehouse-conversion",
    title: "Harbour Warehouse Conversion",
    category: "Renovation",
    location: "Sewri, Mumbai",
    image: unsplash("photo-1504307651254-35680f356dfd"),
    area: 8500,
    year: 2025,
    description:
      "An ambitious conversion of a disused warehouse into a mixed-use loft complex. We retained the raw structure — exposed trusses, brick and steel — and layered in warm, refined interiors.\nZoning, daylight and services were rethought to suit contemporary life.",
    duration: "16 months",
    budgetRange: "Rs. 16 Cr - 20 Cr",
    materials: ["Exposed brick", "Polished concrete", "Steel portals", "Glulam accents", "Acid-etched glass"],
    features: ["Loft residences", "Creative studios", "Rooftop terrace", "Café space", "Industrial-chic detailing"],
    gallery: [
      unsplash("photo-1581094794329-c8112a89af12", 1800),
      unsplash("photo-1621905251189-08b45d6a269e", 1800),
      unsplash("photo-1581092160562-40aa08e78837", 1800),
      unsplash("photo-1503174971373-b1f69850bded", 1800),
      unsplash("photo-1507089947368-19c1da9775ae", 1800),
    ],
  },
];

/**
 * Featured before/after comparison for the slider section.
 *
 * NOTE: these are placeholder stand-ins — swap in genuine matched
 * before/after photographs of the same property before going live.
 */
export const beforeAfter = {
  before: unsplash("photo-1504307651254-35680f356dfd"),
  after: unsplash("photo-1616486338812-3dadae4b4ace"),
  title: "Harbour Warehouse Conversion",
  location: "Sewri, Mumbai",
};

/** Look up a project by its URL slug. */
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/** Return the previous and next project in the projects array. */
export function getAdjacentProjects(slug: string): {
  prev: Project | null;
  next: Project | null;
} {
  const index = projects.findIndex((project) => project.slug === slug);

  if (index === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: index > 0 ? projects[index - 1] : null,
    next: index < projects.length - 1 ? projects[index + 1] : null,
  };
}

/** Format a raw area value for display, e.g. 42000 -> "42,000 sq.ft". */
export function formatArea(area: number): string {
  return `${area.toLocaleString("en-US")} sq.ft`;
}
