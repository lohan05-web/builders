/**
 * Content for the "About LM Builders" section.
 *
 * All copy below is PLACEHOLDER text — swap in the real company story,
 * founder bio and team details before going live.
 */

/** Unsplash helper — keeps the query string consistent across the file. */
const unsplash = (id: string, width = 600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;

/** The company story — two short paragraphs. */
export interface CompanyStory {
  /** Paragraphs shown under the "About LM Builders" heading. */
  paragraphs: string[];
}

export const companyStory: CompanyStory = {
  paragraphs: [
    "LM Builders began with a single truck, a small crew and a simple promise: build it once, build it right. Ten years later that promise still drives every project we take on — from a two-bedroom apartment renovation to a full commercial development.",
    "We keep our own in-house teams for the work that matters most — structure, MEP and finishes — so the people on your site are the same people we employ. It means one point of accountability, one schedule, and one number on the final bill.",
  ],
};

/** The founder of the company. */
export interface Founder {
  /** Full name. */
  name: string;
  /** Job title / role. */
  role: string;
  /** Unsplash portrait URL. */
  photo: string;
  /** A short personal message shown next to the photo. */
  message: string;
}

export const founder: Founder = {
  name: "Lalit Mehta",
  role: "Founder & Managing Director",
  photo: unsplash("photo-1519085360753-af0119f7cbe7", 500),
  message:
    "I started LM Builders because I got tired of watching good clients get let down by contractors who quote low and deliver late. We would rather turn down a project than hand over one we are not proud of.",
};

/** A member of the leadership / site team. */
export interface TeamMember {
  /** Stable slug — used as the React key. */
  id: string;
  /** Full name. */
  name: string;
  /** Role within the company. */
  role: string;
  /** Unsplash portrait URL. */
  photo: string;
  /**
   * Alternative text for the portrait.
   *
   * Comes from the CMS when the team member is managed in Sanity; empty for
   * the local fallback data, in which case the name is used instead.
   */
  photoAlt?: string;
}

export const team: TeamMember[] = [
  {
    id: "sunil-verma",
    name: "Sunil Verma",
    role: "Head of Civil Engineering",
    photo: unsplash("photo-1472099645785-5658abf4ff4e"),
  },
  {
    id: "karthik-rao",
    name: "Karthik Rao",
    role: "Project Director",
    photo: unsplash("photo-1506794778202-cad84cf45f1d"),
  },
  {
    id: "deepa-nair",
    name: "Deepa Nair",
    role: "Lead Architect & Design Head",
    photo: unsplash("photo-1534528741775-53994a69daeb"),
  },
  {
    id: "imran-sheikh",
    name: "Imran Sheikh",
    role: "Site & Safety Manager",
    photo: unsplash("photo-1502685104226-ee32379fefbe"),
  },
];

/** Union of every lucide icon name used by the trust badges. */
export type TrustIconName =
  | "BadgeCheck"
  | "ShieldCheck"
  | "Award"
  | "HardHat"
  | "Handshake"
  | "KeyRound";

/** A certification / partnership badge. */
export interface TrustBadge {
  /** Stable slug — used as the React key. */
  id: string;
  /** Main title, e.g. "RERA Registered". */
  title: string;
  /** Short supporting label. */
  label: string;
  /** lucide-react icon name (see `TrustIconName`). */
  icon: TrustIconName;
}

export const trustBadges: TrustBadge[] = [
  {
    id: "rera",
    title: "RERA Registered",
    label: "Every project registered and audited",
    icon: "BadgeCheck",
  },
  {
    id: "iso",
    title: "ISO 9001:2015",
    label: "Certified quality management system",
    icon: "Award",
  },
  {
    id: "licensed",
    title: "Licensed Contractor",
    label: "Registered with all local authorities",
    icon: "HardHat",
  },
  {
    id: "ultratech",
    title: "UltraTech Partner",
    label: "Authorised dealer and applicator",
    icon: "ShieldCheck",
  },
  {
    id: "tata-steel",
    title: "TATA Steel Partner",
    label: "Preferred supplier for structural steel",
    icon: "Handshake",
  },
  {
    id: "warranty",
    title: "10 Year Warranty",
    label: "Structural warranty on every build",
    icon: "KeyRound",
  },
];

/** Large hero image for the "About" section. */
export const aboutImage = unsplash("photo-1503387762-592deb58ef4e", 1600);
