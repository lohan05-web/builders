import { createClient } from "next-sanity";
import {
  apiVersion,
  dataset,
  isSanityConfigured,
  projectId,
  readToken,
} from "../env";

/**
 * Read-only Sanity client used by every Server Component.
 *
 * - `useCdn` is switched off automatically when a read token is present,
 *   because the CDN cannot serve private datasets.
 * - The placeholder project id keeps the module importable even when the
 *   env vars are missing — `isSanityConfigured` guards every actual request.
 */
export const client = createClient({
  projectId: projectId || "placeholder",
  dataset,
  apiVersion,
  useCdn: !readToken,
  token: readToken,
  perspective: "published",
});

export { isSanityConfigured };
