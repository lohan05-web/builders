/**
 * Central place for all company / contact details.
 *
 * All values below are PLACEHOLDERS — replace them with the real
 * information before going live.
 */

/** Canonical site URL used for metadata, sitemap and JSON-LD. */
export const SITE_URL = "https://lmbuilders.com";

export const site = {
  /** Company name shown in the navbar, footer and metadata. */
  name: "LM Builders",

  /** Short line used in the hero and page metadata. */
  tagline: "Building Your Dream, Brick by Brick",

  /** Longer description used for SEO metadata. */
  description:
    "LM Builders delivers high-quality residential and commercial construction, built on trusted craftsmanship, transparent pricing and on-time delivery.",

  /** Business phone number (display format). */
  phone: "+91 98765 43210",

  /** Phone number in international format, used for `tel:` links. */
  phoneHref: "+919876543210",

  /** WhatsApp number in international format (digits only, no `+`). */
  whatsapp: "919876543210",

  /** Primary email address. */
  email: "hello@lmbuilders.com",

  /** Registered business address. */
  address: {
    street: "204, Sunrise Business Park",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400069",
    country: "India",
    /** Single-line address, handy for map embeds / schema.org markup. */
    full: "204, Sunrise Business Park, Andheri East, Mumbai, Maharashtra 400069",
  },

  /** Office / site hours shown in the contact section and the footer. */
  workingHours: [
    { days: "Monday – Friday", hours: "9:00 AM – 7:00 PM" },
    { days: "Saturday", hours: "9:00 AM – 5:00 PM" },
    { days: "Sunday", hours: "By appointment only" },
  ],

  /** Social profiles. */
  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    youtube: "https://youtube.com",
  },

  /** Map embed used by the contact section. */
  map: {
    /**
     * Google Maps embed URL.
     * Easiest way to change it: open Google Maps → Share → Embed a map →
     * copy the `src` value and paste it here.
     */
    embedUrl:
      "https://www.google.com/maps?q=Andheri+East%2C+Mumbai%2C+Maharashtra+400069&output=embed",

    /** Opens the same location in Google Maps (used for "Get directions"). */
    placeUrl:
      "https://www.google.com/maps/search/?api=1&query=Andheri+East%2C+Mumbai%2C+Maharashtra+400069",
  },

  /** Default message pre-filled into every WhatsApp link on the site. */
  whatsappMessage: "Hi, I am interested in your construction services",
} as const;

/**
 * Key figures shown in the Stats band.
 *
 * These are deliberately split into `value` / `suffix` / `label` so the copy
 * is easy to edit — the counter in `components/Stats.tsx` animates up to
 * `value` on its own and appends `suffix` automatically.
 */
export const stats = [
  { id: "projects", value: 150, suffix: "+", label: "Projects Completed" },
  { id: "years", value: 10, suffix: "+", label: "Years Experience" },
  { id: "sqft", value: 5, suffix: "L+", label: "Sq.ft Built" },
  { id: "clients", value: 120, suffix: "+", label: "Happy Clients" },
] as const;

/**
 * Primary navigation links.
 * Each `href` maps to a section id that will be added in later rounds.
 */
export const navLinks = [
  { label: "Home", href: "/#home" },
  { label: "Services", href: "/#services" },
  { label: "Projects", href: "/#projects" },
  { label: "Process", href: "/#process" },
  { label: "Estimator", href: "/#estimator" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
] as const;

/** Last updated date shown on the Privacy Policy page. */
export const lastUpdated = "October 22, 2026";

/**
 * Build a WhatsApp deep link with a pre-filled message.
 *
 * @param message Text pre-filled into the WhatsApp chat.
 */
export function whatsappLink(
  message: string = site.whatsappMessage,
): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
