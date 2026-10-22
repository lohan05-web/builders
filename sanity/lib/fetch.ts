import {
  beforeAfter as fallbackBeforeAfter,
  projects as fallbackProjects,
  type Project,
} from "@/data/projects";
import { services as fallbackServices, type Service } from "@/data/services";
import {
  testimonials as fallbackTestimonials,
  type Testimonial,
} from "@/data/testimonials";
import { faqs as fallbackFaqs, type FaqItem } from "@/data/faqs";
import { team as fallbackTeam, type TeamMember } from "@/data/about";
import { isSanityConfigured } from "../env";
import { client } from "./client";
import { fallbackSiteSettings } from "./fallback";
import {
  mapBeforeAfter,
  mapFaq,
  mapProject,
  mapService,
  mapSiteSettings,
  mapTeamMember,
  mapTestimonial,
} from "./mappers";
import {
  BEFORE_AFTER_QUERY,
  FAQS_QUERY,
  PROJECTS_QUERY,
  PROJECT_BY_SLUG_QUERY,
  SERVICES_QUERY,
  SITE_SETTINGS_QUERY,
  TEAM_QUERY,
  TESTIMONIALS_QUERY,
} from "./queries";
import type {
  BeforeAfterContent,
  SanityBeforeAfterDoc,
  SanityFaqDoc,
  SanityProjectDoc,
  SanityServiceDoc,
  SanitySiteSettingsDoc,
  SanityTeamMemberDoc,
  SanityTestimonialDoc,
  SiteSettings,
} from "./types";

/**
 * How often the cached Sanity responses are refreshed, in seconds.
 *
 * A change made in the Studio therefore shows up on the live site within
 * roughly a minute.
 */
export const REVALIDATE_SECONDS = 60;

/**
 * The outcome of a Sanity request.
 *
 * `ok: false` means "Sanity is not configured or the request failed" — the
 * caller should fall back to the local data. `ok: true` with a `null` data
 * value means "Sanity answered, but there is no such document".
 */
type SanityResult<T> = { ok: true; data: T } | { ok: false };

/**
 * Run a GROQ query against Sanity with ISR caching.
 *
 * Never throws — a broken CMS must not take the website down with it.
 *
 * @param query  The GROQ query to run.
 * @param params Query parameters.
 * @param tags   Cache tags used to revalidate the response on demand.
 * @param options Set `revalidate: false` to skip the cache (used by the
 *                contact API, where the request is not a GET).
 */
async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  tags: string[] = [],
  options: { revalidate?: number | false } = {},
): Promise<SanityResult<T>> {
  // Without a project id there is nothing to talk to.
  if (!isSanityConfigured) return { ok: false };

  const revalidate =
    options.revalidate === undefined ? REVALIDATE_SECONDS : options.revalidate;

  try {
    const data =
      revalidate === false
        ? await client.fetch<T>(query, params, { cache: "no-store" })
        : await client.fetch<T>(query, params, {
            next: { revalidate, tags },
          });

    return { ok: true, data };
  } catch (error) {
    console.error("[sanity] query failed, using the local fallback:", error);
    return { ok: false };
  }
}

/**
 * All projects, newest first.
 *
 * Falls back to the local `data/projects.ts` list when Sanity is not
 * configured or has no projects yet.
 */
export async function getProjects(): Promise<Project[]> {
  const result = await sanityFetch<SanityProjectDoc[]>(
    PROJECTS_QUERY,
    {},
    ["projects"],
  );

  if (!result.ok || !result.data || result.data.length === 0) {
    return fallbackProjects;
  }

  const projects = result.data
    .map((doc) =>
      mapProject(
        doc,
        fallbackProjects.find((project) => project.slug === doc.slug),
      ),
    )
    .filter((project): project is Project => project !== null);

  return projects.length > 0 ? projects : fallbackProjects;
}

/**
 * A single project, looked up by its URL slug.
 *
 * Returns `null` when Sanity is configured but has no project with that
 * slug — that is how a project removed in the Studio disappears from the
 * site.
 *
 * @param slug The URL slug of the project.
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const result = await sanityFetch<SanityProjectDoc | null>(
    PROJECT_BY_SLUG_QUERY,
    { slug },
    [`project:${slug}`],
  );

  // Sanity is unreachable — fall back to the local list.
  if (!result.ok) {
    return fallbackProjects.find((project) => project.slug === slug) ?? null;
  }

  if (!result.data) return null;

  return mapProject(
    result.data,
    fallbackProjects.find((project) => project.slug === result.data?.slug),
  );
}

/**
 * The previous and next project in the list.
 *
 * @param slug The URL slug of the current project.
 */
export async function getAdjacentProjects(slug: string): Promise<{
  prev: Project | null;
  next: Project | null;
}> {
  const all = await getProjects();
  const index = all.findIndex((project) => project.slug === slug);

  if (index === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: index > 0 ? all[index - 1] : null,
    next: index < all.length - 1 ? all[index + 1] : null,
  };
}

/**
 * The services catalogue.
 */
export async function getServices(): Promise<Service[]> {
  const result = await sanityFetch<SanityServiceDoc[]>(
    SERVICES_QUERY,
    {},
    ["services"],
  );

  if (!result.ok || !result.data || result.data.length === 0) {
    return fallbackServices;
  }

  const services = result.data
    .map(mapService)
    .filter((service): service is Service => service !== null);

  return services.length > 0 ? services : fallbackServices;
}

/**
 * The client testimonials shown in the carousel.
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  const result = await sanityFetch<SanityTestimonialDoc[]>(
    TESTIMONIALS_QUERY,
    {},
    ["testimonials"],
  );

  if (!result.ok || !result.data || result.data.length === 0) {
    return fallbackTestimonials;
  }

  const testimonials = result.data
    .map((doc) =>
      mapTestimonial(
        doc,
        fallbackTestimonials.find((item) => item.name === doc.name),
      ),
    )
    .filter((testimonial): testimonial is Testimonial => testimonial !== null);

  return testimonials.length > 0 ? testimonials : fallbackTestimonials;
}

/**
 * The FAQ accordion entries.
 */
export async function getFaqs(): Promise<FaqItem[]> {
  const result = await sanityFetch<SanityFaqDoc[]>(FAQS_QUERY, {}, ["faqs"]);

  if (!result.ok || !result.data || result.data.length === 0) {
    return fallbackFaqs;
  }

  const faqs = result.data
    .map(mapFaq)
    .filter((faq): faq is FaqItem => faq !== null);

  return faqs.length > 0 ? faqs : fallbackFaqs;
}

/**
 * The leadership / site team shown in the About section.
 */
export async function getTeam(): Promise<TeamMember[]> {
  const result = await sanityFetch<SanityTeamMemberDoc[]>(
    TEAM_QUERY,
    {},
    ["team"],
  );

  if (!result.ok || !result.data || result.data.length === 0) {
    return fallbackTeam;
  }

  const team = result.data
    .map((doc) =>
      mapTeamMember(
        doc,
        fallbackTeam.find((member) => member.name === doc.name),
      ),
    )
    .filter((member): member is TeamMember => member !== null);

  return team.length > 0 ? team : fallbackTeam;
}

/**
 * The company details (name, phone, address, stats, …).
 *
 * @param options Set `revalidate: false` to skip the cache.
 */
export async function getSiteSettings(
  options: { revalidate?: number | false } = {},
): Promise<SiteSettings> {
  const result = await sanityFetch<SanitySiteSettingsDoc | null>(
    SITE_SETTINGS_QUERY,
    {},
    ["siteSettings"],
    options,
  );

  if (!result.ok || !result.data) {
    return fallbackSiteSettings;
  }

  return mapSiteSettings(result.data, fallbackSiteSettings);
}

/**
 * The before/after comparison shown in the renovation slider.
 */
export async function getBeforeAfter(): Promise<BeforeAfterContent> {
  const result = await sanityFetch<SanityBeforeAfterDoc | null>(
    BEFORE_AFTER_QUERY,
    {},
    ["beforeAfter"],
  );

  if (!result.ok || !result.data) {
    return {
      ...fallbackBeforeAfter,
      beforeAlt: "",
      afterAlt: "",
    };
  }

  return mapBeforeAfter(result.data, fallbackBeforeAfter);
}
