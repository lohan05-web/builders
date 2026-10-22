/**
 * GROQ queries used by the site.
 *
 * Every query projects the *fields* the site actually renders, so the
 * browser never receives the raw Sanity document. Queries are written so
 * that an empty result can simply fall back to the local `/data` files.
 */

/** Shared projection for a project document. */
const PROJECT_PROJECTION = `{
  _id,
  title,
  "slug": slug.current,
  category,
  location,
  area,
  year,
  description,
  duration,
  budgetRange,
  materials,
  features,
  featured,
  "image": mainImage{
    "ref": asset->._ref,
    "id": asset->._id,
    "url": asset->.url,
    "alt": alt
  },
  "gallery": gallery[]{
    "ref": asset->._ref,
    "id": asset->._id,
    "url": asset->.url,
    "alt": alt
  }
}`;

/** All projects, newest first, with featured projects pulled to the top. */
export const PROJECTS_QUERY = `
  *[_type == "project"] | order(featured desc, year desc, title asc) ${PROJECT_PROJECTION}
`;

/** A single project looked up by its URL slug. */
export const PROJECT_BY_SLUG_QUERY = `
  *[_type == "project" && slug.current == $slug][0] ${PROJECT_PROJECTION}
`;

/** Every project slug — used to pre-render the detail pages. */
export const PROJECT_SLUGS_QUERY = `
  *[_type == "project" && defined(slug.current)].slug.current
`;

/** The services catalogue, in the order the client arranged it. */
export const SERVICES_QUERY = `
  *[_type == "service"] | order(order asc, title asc) {
    _id,
    title,
    description,
    icon,
    order
  }
`;

/** Client testimonials, in display order. */
export const TESTIMONIALS_QUERY = `
  *[_type == "testimonial"] | order(_createdAt asc) {
    _id,
    name,
    projectName,
    location,
    quote,
    rating,
    "photo": photo{
      "ref": asset->._ref,
      "id": asset->._id,
      "url": asset->.url,
      "alt": alt
    }
  }
`;

/** The FAQ accordion entries, in display order. */
export const FAQS_QUERY = `
  *[_type == "faq"] | order(order asc, question asc) {
    _id,
    question,
    answer,
    order
  }
`;

/** The leadership / site team, in display order. */
export const TEAM_QUERY = `
  *[_type == "teamMember"] | order(order asc, name asc) {
    _id,
    name,
    role,
    "photo": photo{
      "ref": asset->._ref,
      "id": asset->._id,
      "url": asset->.url,
      "alt": alt
    }
  }
`;

/**
 * The single site-settings document.
 *
 * The Studio pins the document id to `siteSettings` so there is only ever
 * one copy of it.
 */
export const SITE_SETTINGS_QUERY = `
  *[_type == "siteSettings"][0] {
    _id,
    companyName,
    tagline,
    description,
    phone,
    whatsapp,
    email,
    address,
    workingHours,
    social,
    stats
  }
`;

/** The before/after comparison shown in the renovation slider. */
export const BEFORE_AFTER_QUERY = `
  *[_type == "beforeAfter"] | order(_createdAt asc) [0] {
    _id,
    title,
    location,
    "before": before{
      "ref": asset->._ref,
      "id": asset->._id,
      "url": asset->.url,
      "alt": alt
    },
    "after": after{
      "ref": asset->._ref,
      "id": asset->._id,
      "url": asset->.url,
      "alt": alt
    }
  }
`;
