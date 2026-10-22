import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { dataset, projectId } from "../env";

/**
 * Image URL builder for assets stored in Sanity.
 *
 * The generated URLs point at `cdn.sanity.io`, which is whitelisted in
 * `next.config.mjs` so `next/image` can optimise them.
 */
const builder = imageUrlBuilder({
  projectId: projectId || "placeholder",
  dataset,
});

/**
 * The image fields we project out of GROQ.
 *
 * Both the reference (`_ref` / `_id`) and the plain CDN URL are kept so the
 * mapper always has a way to build a working link.
 */
export interface SanityImageRef {
  /** `_ref` of the referenced image asset, e.g. `image-abc-2000x1500-jpg`. */
  ref?: string;
  /** `_id` of the referenced image asset. */
  id?: string;
  /** Direct CDN URL of the asset — used when the builder cannot be used. */
  url?: string;
  /** Alternative text stored next to the image in the Studio. */
  alt?: string;
}

/**
 * Build an optimised Sanity CDN URL for an image reference.
 *
 * @param source The image object (or asset reference) coming from GROQ.
 * @param width  Target width in pixels.
 */
export function urlForImage(source: SanityImageSource, width = 2000): string {
  try {
    return builder
      .image(source)
      .width(width)
      .fit("crop")
      .auto("format")
      .quality(80)
      .url();
  } catch (error) {
    console.error("[sanity] could not build an image URL:", error);
    return "";
  }
}

/**
 * Build a CDN URL for an image projected out of GROQ.
 *
 * The image builder is tried first (it can crop to a hotspot and apply the
 * Sanity image pipeline). If that is not possible we fall back to the plain
 * asset URL with Sanity's own transform query parameters appended.
 *
 * @param ref   The projected image reference.
 * @param width Target width in pixels.
 */
export function urlForImageRef(ref: SanityImageRef | undefined, width = 2000): string {
  if (!ref) return "";

  // 1. The image builder understands an asset reference.
  if (ref.ref) {
    const built = urlForImage({ asset: { _ref: ref.ref } }, width);
    if (built) return built;
  }

  // 2. …and an asset id.
  if (ref.id) {
    const built = urlForImage({ asset: { _id: ref.id } }, width);
    if (built) return built;
  }

  // 3. Last resort: the raw asset URL plus Sanity's transform parameters.
  if (ref.url) {
    const separator = ref.url.includes("?") ? "&" : "?";
    return `${ref.url}${separator}auto=format&fit=crop&w=${width}&q=80`;
  }

  return "";
}
