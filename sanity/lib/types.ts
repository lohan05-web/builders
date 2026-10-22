import type { SanityImageRef } from "./image";

/**
 * Shapes of the documents as they come back from GROQ.
 *
 * They are deliberately "all optional" — a document in the Studio can be
 * half-finished, and the mapper has to survive that.
 */

/** A project document. */
export interface SanityProjectDoc {
  _id: string;
  title?: string;
  slug?: string;
  category?: string;
  location?: string;
  area?: number;
  year?: number;
  description?: string;
  duration?: string;
  budgetRange?: string;
  materials?: string[];
  features?: string[];
  featured?: boolean;
  image?: SanityImageRef;
  gallery?: SanityImageRef[];
}

/** A service document. */
export interface SanityServiceDoc {
  _id: string;
  title?: string;
  description?: string;
  icon?: string;
  order?: number;
}

/** A testimonial document. */
export interface SanityTestimonialDoc {
  _id: string;
  name?: string;
  projectName?: string;
  location?: string;
  quote?: string;
  rating?: number;
  photo?: SanityImageRef;
}

/** An FAQ document. */
export interface SanityFaqDoc {
  _id: string;
  question?: string;
  answer?: string;
  order?: number;
}

/** A team member document. */
export interface SanityTeamMemberDoc {
  _id: string;
  name?: string;
  role?: string;
  photo?: SanityImageRef;
}

/** The address block of the site settings document. */
export interface SanityAddress {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

/** A single working-hours row. */
export interface SanityWorkingHour {
  days?: string;
  hours?: string;
}

/** The social profile links. */
export interface SanitySocialLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
}

/** A single key figure shown in the stats band. */
export interface SanityStat {
  label?: string;
  value?: number;
  /** Optional text rendered straight after the number (e.g. `+` or `L+`). */
  suffix?: string;
}

/** The single site-settings document. */
export interface SanitySiteSettingsDoc {
  _id: string;
  companyName?: string;
  tagline?: string;
  description?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: SanityAddress;
  workingHours?: SanityWorkingHour[];
  social?: SanitySocialLinks;
  stats?: SanityStat[];
}

/** The before/after comparison document. */
export interface SanityBeforeAfterDoc {
  _id: string;
  title?: string;
  location?: string;
  before?: SanityImageRef;
  after?: SanityImageRef;
}

/* -------------------------------------------------------------------------
 * The shape the site actually renders.
 * ---------------------------------------------------------------------- */

/** A postal address plus the pre-built single-line version. */
export interface SiteAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  /** Single-line address, handy for map embeds / schema.org markup. */
  full: string;
}

/** One row of the opening-hours table. */
export interface WorkingHour {
  days: string;
  hours: string;
}

/** The social profile links. */
export interface SocialLinks {
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;
}

/** The Google Maps embed used by the contact section. */
export interface MapLinks {
  embedUrl: string;
  placeUrl: string;
}

/** A single key figure shown in the stats band. */
export interface SiteStat {
  /** Stable identifier — used as the React key. */
  id: string;
  /** The number the counter animates up to. */
  value: number;
  /** Text rendered straight after the number (e.g. `+` or `L+`). */
  suffix: string;
  /** Small caption underneath the number. */
  label: string;
}

/**
 * The company details used across the whole site.
 *
 * This is the shape the components consume — it is populated from Sanity
 * when the CMS is configured and from `data/site.ts` otherwise.
 */export interface SiteSettings {
  name: string;
  tagline: string;
  description: string;
  phone: string;
  /** Phone number in international format, used for `tel:` links. */
  phoneHref: string;
  /** WhatsApp number in international format (digits only, no `+`). */
  whatsapp: string;
  /** A ready-to-use WhatsApp deep link with a pre-filled message. */
  whatsappLink: string;
  email: string;
  address: SiteAddress;
  workingHours: WorkingHour[];
  social: SocialLinks;
  map: MapLinks;
  /** Default message pre-filled into every WhatsApp link on the site. */
  whatsappMessage: string;
  stats: SiteStat[];
}

/**
 * The before/after comparison shown in the renovation slider.
 */
export interface BeforeAfterContent {
  /** The "before" photo URL. */
  before: string;
  /** The "after" photo URL. */
  after: string;
  /** Project name shown under the slider. */
  title: string;
  /** Location shown under the slider. */
  location: string;
  /** Alternative text for the "before" photo. */
  beforeAlt: string;
  /** Alternative text for the "after" photo. */
  afterAlt: string;
}
