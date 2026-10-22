import { beforeAfter } from "./beforeAfter";
import { faq } from "./faq";
import { project } from "./project";
import { service } from "./service";
import { siteSettings } from "./siteSettings";
import { teamMember } from "./teamMember";
import { testimonial } from "./testimonial";

/**
 * Every schema type the Studio knows about.
 *
 * The order here is the order the types appear in the Studio sidebar
 * (the sidebar itself is arranged in `sanity.config.ts`).
 */
export const schemaTypes = [
  siteSettings,
  project,
  service,
  testimonial,
  faq,
  teamMember,
  beforeAfter,
];
