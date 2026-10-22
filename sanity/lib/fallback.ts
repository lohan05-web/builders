import { site, stats, whatsappLink } from "@/data/site";
import type { SiteSettings } from "./types";

/**
 * The company details used when Sanity is not configured (or returns
 * nothing).
 *
 * This is the local copy of the site settings — it keeps the site working
 * even before a Sanity project exists, and acts as a safety net if the CMS
 * is unreachable at build time.
 */
export const fallbackSiteSettings: SiteSettings = {
  name: site.name,
  tagline: site.tagline,
  description: site.description,
  phone: site.phone,
  phoneHref: site.phoneHref,
  whatsapp: site.whatsapp,
  whatsappLink: whatsappLink(),
  email: site.email,
  address: { ...site.address },
  workingHours: site.workingHours.map((slot) => ({ ...slot })),
  social: { ...site.social },
  map: { ...site.map },
  whatsappMessage: site.whatsappMessage,
  stats: stats.map((stat) => ({ ...stat })),
};
