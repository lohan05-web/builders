import type { Project, ProjectCategory } from "@/data/projects";
import type { Service, ServiceIconName } from "@/data/services";
import type { Testimonial, Rating } from "@/data/testimonials";
import type { FaqItem } from "@/data/faqs";
import type { TeamMember } from "@/data/about";
import { urlForImageRef } from "./image";
import type {
  SanityBeforeAfterDoc,
  SanityFaqDoc,
  SanityProjectDoc,
  SanityServiceDoc,
  SanitySiteSettingsDoc,
  SanityTeamMemberDoc,
  SanityTestimonialDoc,
  BeforeAfterContent,
  SiteAddress,
  SiteSettings,
  SiteStat,
  SocialLinks,
  WorkingHour,
} from "./types";

/**
 * Turn a free-text title into a stable, URL-safe identifier.
 *
 * @param value The text to slugify.
 */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * The categories the gallery filter tabs understand.
 */
const PROJECT_CATEGORIES: ProjectCategory[] = [
  "Residential",
  "Commercial",
  "Interiors",
  "Renovation",
];

/**
 * The lucide icon names the services grid can render.
 */
const SERVICE_ICONS: ServiceIconName[] = [
  "Home",
  "Building2",
  "PaintRoller",
  "Armchair",
  "DraftingCompass",
  "ClipboardCheck",
];

/**
 * Map a Sanity project document onto the shape the site renders.
 *
 * Returns `null` when the document is too incomplete to show (no title or
 * no slug) so the caller can fall back to the local data.
 *
 * @param doc      The project document coming from GROQ.
 * @param fallback The matching local project, used for photos that have
 *                 not been uploaded to Sanity yet.
 */
export function mapProject(
  doc: SanityProjectDoc,
  fallback?: Project,
): Project | null {
  if (!doc.title || !doc.slug) return null;

  const category = PROJECT_CATEGORIES.includes(doc.category as ProjectCategory)
    ? (doc.category as ProjectCategory)
    : "Residential";

  // Fall back to the local photo when the CMS has no image yet.
  const image = urlForImageRef(doc.image, 2000) || fallback?.image || "";

  const gallery = (doc.gallery ?? [])
    .map((entry) => urlForImageRef(entry, 1800))
    .filter((url) => url.length > 0);

  return {
    id: doc._id,
    slug: doc.slug,
    title: doc.title,
    category,
    location: doc.location ?? fallback?.location ?? "",
    image,
    imageAlt: doc.image?.alt ?? "",
    area: doc.area ?? fallback?.area ?? 0,
    year: doc.year ?? fallback?.year ?? new Date().getFullYear(),
    description: doc.description ?? "",
    duration: doc.duration ?? "",
    budgetRange: doc.budgetRange ?? "",
    materials: doc.materials ?? [],
    features: doc.features ?? [],
    gallery: gallery.length > 0 ? gallery : (fallback?.gallery ?? []),
  };
}

/**
 * Map a Sanity service document onto the shape the site renders.
 *
 * @param doc The service document coming from GROQ.
 */
export function mapService(doc: SanityServiceDoc): Service | null {
  if (!doc.title) return null;

  const icon = SERVICE_ICONS.includes(doc.icon as ServiceIconName)
    ? (doc.icon as ServiceIconName)
    : "Home";

  return {
    id: doc._id,
    title: doc.title,
    description: doc.description ?? "",
    icon,
  };
}

/**
 * Map a Sanity testimonial document onto the shape the site renders.
 *
 * @param doc      The testimonial document coming from GROQ.
 * @param fallback The matching local testimonial, used for portraits that
 *                 have not been uploaded to Sanity yet.
 */
export function mapTestimonial(
  doc: SanityTestimonialDoc,
  fallback?: Testimonial,
): Testimonial | null {
  if (!doc.name || !doc.quote) return null;

  const rating = Math.min(5, Math.max(1, Math.round(doc.rating ?? 5))) as Rating;

  return {
    id: doc._id,
    name: doc.name,
    projectName: doc.projectName ?? "",
    location: doc.location ?? "",
    quote: doc.quote,
    photo: urlForImageRef(doc.photo, 600) || fallback?.photo || "",
    photoAlt: doc.photo?.alt ?? "",
    rating,
  };
}

/**
 * Map a Sanity FAQ document onto the shape the site renders.
 *
 * @param doc The FAQ document coming from GROQ.
 */
export function mapFaq(doc: SanityFaqDoc): FaqItem | null {
  if (!doc.question || !doc.answer) return null;

  return {
    id: doc._id,
    question: doc.question,
    answer: doc.answer,
  };
}

/**
 * Map a Sanity team member document onto the shape the site renders.
 *
 * @param doc      The team member document coming from GROQ.
 * @param fallback The matching local team member, used for portraits that
 *                 have not been uploaded to Sanity yet.
 */
export function mapTeamMember(
  doc: SanityTeamMemberDoc,
  fallback?: TeamMember,
): TeamMember | null {
  if (!doc.name) return null;

  return {
    id: doc._id,
    name: doc.name,
    role: doc.role ?? "",
    photo: urlForImageRef(doc.photo, 600) || fallback?.photo || "",
    photoAlt: doc.photo?.alt ?? "",
  };
}

/**
 * Build the single-line address shown in the footer and contact section.
 *
 * The country is left out — it is already published separately as
 * `addressCountry` in the structured data.
 *
 * @param address The address block coming from Sanity.
 */
function buildAddressLine(address: {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}): string {
  return [
    address.street,
    address.city,
    [address.state, address.postalCode].filter(Boolean).join(" "),
  ]
    .filter((part) => Boolean(part && part.trim()))
    .join(", ");
}

/**
 * Map the Sanity site-settings document onto the shape the site renders.
 *
 * Fields that the CMS does not manage (the map embed URL, the default
 * WhatsApp message) are filled in from the local fallback.
 *
 * @param doc The site-settings document coming from GROQ.
 * @param fallback The local site settings, used for the unmanaged fields.
 */
export function mapSiteSettings(
  doc: SanitySiteSettingsDoc,
  fallback: SiteSettings,
): SiteSettings {
  const address: SiteAddress = {
    street: doc.address?.street ?? fallback.address.street,
    city: doc.address?.city ?? fallback.address.city,
    state: doc.address?.state ?? fallback.address.state,
    postalCode: doc.address?.postalCode ?? fallback.address.postalCode,
    country: doc.address?.country ?? fallback.address.country,
    full: "",
  };
  address.full = buildAddressLine(address) || fallback.address.full;

  const workingHours: WorkingHour[] = (doc.workingHours ?? [])
    .filter((slot) => Boolean(slot.days && slot.hours))
    .map((slot) => ({ days: slot.days as string, hours: slot.hours as string }));

  const social: SocialLinks = {
    facebook: doc.social?.facebook ?? fallback.social.facebook,
    instagram: doc.social?.instagram ?? fallback.social.instagram,
    linkedin: doc.social?.linkedin ?? fallback.social.linkedin,
    youtube: doc.social?.youtube ?? fallback.social.youtube,
  };

  const stats: SiteStat[] = (doc.stats ?? [])
    .filter((stat) => Boolean(stat.label))
    .map((stat) => ({
      id: slugify(stat.label as string),
      value: stat.value ?? 0,
      suffix: stat.suffix ?? "",
      label: stat.label as string,
    }));

  const phone = doc.phone ?? fallback.phone;
  const whatsapp = (doc.whatsapp ?? fallback.whatsapp).replace(/[^0-9]/g, "");

  return {
    name: doc.companyName ?? fallback.name,
    tagline: doc.tagline ?? fallback.tagline,
    description: doc.description ?? fallback.description,
    phone,
    phoneHref: phone.replace(/[^\d+]/g, ""),
    whatsapp,
    whatsappLink: `https://wa.me/${whatsapp}?text=${encodeURIComponent(
      fallback.whatsappMessage,
    )}`,
    email: doc.email ?? fallback.email,
    address,
    workingHours: workingHours.length > 0 ? workingHours : fallback.workingHours,
    social,
    map: fallback.map,
    whatsappMessage: fallback.whatsappMessage,
    stats: stats.length > 0 ? stats : fallback.stats,
  };
}

/**
 * Map the Sanity before/after document onto the shape the site renders.
 *
 * @param doc The before/after document coming from GROQ.
 * @param fallback The local before/after data.
 */
export function mapBeforeAfter(
  doc: SanityBeforeAfterDoc,
  fallback: { before: string; after: string; title: string; location: string },
): BeforeAfterContent {
  const before = urlForImageRef(doc.before, 2000);
  const after = urlForImageRef(doc.after, 2000);

  return {
    before: before || fallback.before,
    after: after || fallback.after,
    title: doc.title ?? fallback.title,
    location: doc.location ?? fallback.location,
    beforeAlt: doc.before?.alt ?? "",
    afterAlt: doc.after?.alt ?? "",
  };
}
