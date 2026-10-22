/**
 * Environment configuration for the Sanity workspace.
 *
 * Everything the CMS needs is read from environment variables so the same
 * codebase works locally, on Vercel and in the embedded Studio.
 *
 * See `.env.example` for the full list of names and where to get the values.
 */

import { apiVersion, dataset, projectId } from "./publicEnv";

export { apiVersion, dataset, projectId };

/**
 * Read token. Only needed for *private* datasets — leave it empty for the
 * default public dataset.
 *
 * This is a server-side secret: it is never imported by the Studio.
 */
export const readToken = process.env.SANITY_API_READ_TOKEN;

/**
 * Write token. Used exclusively by `scripts/seed.ts` to create the initial
 * content. Never commit a real value and never expose it to the browser.
 */
export const writeToken = process.env.SANITY_API_WRITE_TOKEN;

/**
 * True when the public env vars needed to talk to Sanity are present.
 *
 * The site uses this to decide between "read from Sanity" and "fall back to
 * the local `/data` files", so a missing project id never breaks a build.
 */
export const isSanityConfigured = projectId.length > 0;
