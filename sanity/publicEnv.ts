/**
 * The *public* part of the Sanity configuration.
 *
 * Everything in here is safe to use in the browser — the embedded Studio
 * is a client-side application and can only read `NEXT_PUBLIC_*` variables
 * (they are inlined at build time).
 *
 * The API tokens live in `sanity/env.ts` and are never sent to the client.
 */

/**
 * Sanity project ID — found in sanity.io/manage → your project →
 * "Project settings" → "Project ID".
 */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";

/**
 * Dataset the site reads from. `production` is the default for new projects.
 */
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

/**
 * Pinned API version. Pinning it keeps queries behaving the same way even
 * after Sanity ships breaking changes to their API.
 */
export const apiVersion = "2024-10-01";
