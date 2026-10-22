/**
 * Seed the Sanity Studio with the content that currently lives in the
 * local `/data` files.
 *
 * The client can then log in at `/studio` and edit real content instead
 * of starting from an empty admin panel.
 *
 * ---------------------------------------------------------------------------
 * How to run it
 * ---------------------------------------------------------------------------
 * 1. Create a Sanity project and add the API tokens to `.env.local`:
 *
 *      NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
 *      NEXT_PUBLIC_SANITY_DATASET=production
 *      SANITY_API_WRITE_TOKEN=your-write-token
 *
 * 2. Run the script:
 *
 *      npm run seed
 *
 *    Add `-- --skip-images` to create the text content only (much faster —
 *    the website then keeps showing the local photos until real ones are
 *    uploaded in the Studio).
 *
 * ---------------------------------------------------------------------------
 * Safety
 * ---------------------------------------------------------------------------
 * The script needs the "Editor" permission. It only ever creates or
 * replaces documents that this script owns (the ids below), so running it
 * twice will not duplicate anything.
 */

import { createClient } from "next-sanity";
import { projects, beforeAfter } from "../data/projects.ts";
import { services } from "../data/services.ts";
import { testimonials } from "../data/testimonials.ts";
import { faqs } from "../data/faqs.ts";
import { team } from "../data/about.ts";
import { site, stats } from "../data/site.ts";

/* -------------------------------------------------------------------------
 * Configuration
 * ---------------------------------------------------------------------- */

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const writeToken = process.env.SANITY_API_WRITE_TOKEN;

/** `--skip-images` creates the text content without uploading any photos. */
const skipImages = process.argv.includes("--skip-images");

/**
 * The Sanity API version used while writing.
 */
const apiVersion = "2024-10-01";

/* -------------------------------------------------------------------------
 * Helpers
 * ---------------------------------------------------------------------- */

/**
 * Stop early with a helpful message when something is missing.
 *
 * @param message What the user needs to do.
 */
function bail(message: string): never {
  console.error(`\n[seed] ${message}\n`);
  process.exit(1);
}

/**
 * A document the seed script writes.
 *
 * The `_id` is always set, so the same document can be replaced instead of
 * duplicated every time the script runs.
 */
type SeedDocument = {
  _id: string;
  _type: string;
  [key: string]: unknown;
};

/**
 * Upload a photo to the Sanity asset store.
 *
 * The image is downloaded first and sent as a buffer — the Sanity client
 * no longer accepts a plain URL.
 *
 * @param url The public image URL.
 * @param filename A readable file name for the asset.
 * @returns The asset id, or `null` when the upload failed.
 */
async function uploadImage(url: string, filename: string): Promise<string | null> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const body = Buffer.from(await response.arrayBuffer());
    const asset = await client.assets.upload("image", body, {
      filename,
      contentType: "image/jpeg",
    });

    return asset._id;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    console.warn(`  ! could not upload ${filename}: ${reason}`);
    return null;
  }
}

/**
 * Build a Sanity image field.
 *
 * @param assetId The uploaded asset id, or `null` when the upload failed.
 * @param alt The alternative text for the photo.
 */
function imageField(assetId: string | null, alt: string) {
  if (!assetId) return undefined;

  return {
    _type: "image",
    asset: { _type: "reference", _ref: assetId },
    alt,
  };
}

/**
 * Remove the city / state / country from the single-line address so the
 * street part can be edited on its own in the Studio.
 */
const streetPart = site.address.full
  .replace(
    new RegExp(
      `,\\s*${site.address.city},\\s*${site.address.state}\\s*${site.address.postalCode}(,\\s*${site.address.country})?$`,
    ),
    "",
  )
  .trim();

/* -------------------------------------------------------------------------
 * Seed
 * ---------------------------------------------------------------------- */

if (!projectId) {
  bail(
    "NEXT_PUBLIC_SANITY_PROJECT_ID is missing.\n" +
      "      Add it to your .env.local (see .env.example) and try again.",
  );
}

if (!writeToken) {
  bail(
    "SANITY_API_WRITE_TOKEN is missing.\n" +
      "      Create a token with the \"Editor\" permission at\n" +
      "      https://www.sanity.io/manage → your project → API tokens,\n" +
      "      add it to .env.local and try again.",
  );
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token: writeToken,
  useCdn: false,
});

/**
 * Create (or replace) a single document.
 *
 * @param document The document to write.
 */
async function save(document: SeedDocument): Promise<void> {
  await client.createOrReplace(document);
}

async function main() {
  console.log(`\n[seed] Project: ${projectId}  Dataset: ${dataset}`);
  console.log(
    `[seed] Images: ${skipImages ? "skipped" : "uploading (this can take a few minutes)"}\n`,
  );

  // --- Site settings (a single document) ---------------------------------
  console.log("· Site settings");
  await save({
    _id: "siteSettings",
    _type: "siteSettings",
    companyName: site.name,
    tagline: site.tagline,
    description: site.description,
    phone: site.phone,
    whatsapp: site.whatsapp,
    email: site.email,
    address: {
      street: streetPart,
      city: site.address.city,
      state: site.address.state,
      postalCode: site.address.postalCode,
      country: site.address.country,
    },
    workingHours: site.workingHours.map((slot) => ({
      _key: slot.days,
      _type: "workingHour",
      days: slot.days,
      hours: slot.hours,
    })),
    social: { ...site.social },
    stats: stats.map((stat) => ({
      _key: stat.id,
      _type: "stat",
      label: stat.label,
      value: stat.value,
      suffix: stat.suffix,
    })),
  });

  // --- Services ------------------------------------------------------------
  console.log("· Services");
  for (let index = 0; index < services.length; index += 1) {
    const service = services[index];

    await save({
      _id: `service-${service.id}`,
      _type: "service",
      title: service.title,
      description: service.description,
      icon: service.icon,
      order: index + 1,
    });
  }

  // --- Projects ------------------------------------------------------------
  console.log("· Projects");
  for (const project of projects) {
    const mainImage = skipImages
      ? null
      : await uploadImage(project.image, `${project.slug}-main.jpg`);

    const gallery = skipImages
      ? []
      : await Promise.all(
          project.gallery.map((url, index) =>
            uploadImage(url, `${project.slug}-${index + 1}.jpg`),
          ),
        );

    await save({
      _id: `project-${project.slug}`,
      _type: "project",
      title: project.title,
      slug: { _type: "slug", current: project.slug },
      category: project.category,
      location: project.location,
      area: project.area,
      year: project.year,
      description: project.description,
      duration: project.duration,
      budgetRange: project.budgetRange,
      materials: project.materials,
      features: project.features,
      featured: false,
      mainImage: imageField(mainImage, `${project.title} — main photo`),
      gallery: gallery
        .map((assetId, index) =>
          imageField(assetId, `${project.title} — photo ${index + 1}`),
        )
        .filter((field): field is NonNullable<typeof field> => Boolean(field)),
    });
    console.log(`  - ${project.title}`);
  }

  // --- Testimonials --------------------------------------------------------
  console.log("· Testimonials");
  for (const testimonial of testimonials) {
    const photo = skipImages
      ? null
      : await uploadImage(testimonial.photo, `${testimonial.id}.jpg`);

    await save({
      _id: `testimonial-${testimonial.id}`,
      _type: "testimonial",
      name: testimonial.name,
      projectName: testimonial.projectName,
      location: testimonial.location,
      quote: testimonial.quote,
      rating: testimonial.rating,
      photo: imageField(photo, `Portrait of ${testimonial.name}`),
    });
  }

  // --- FAQs ----------------------------------------------------------------
  console.log("· FAQs");
  for (let index = 0; index < faqs.length; index += 1) {
    const faq = faqs[index];

    await save({
      _id: `faq-${faq.id}`,
      _type: "faq",
      question: faq.question,
      answer: faq.answer,
      order: index + 1,
    });
  }

  // --- Team ----------------------------------------------------------------
  console.log("· Team");
  for (let index = 0; index < team.length; index += 1) {
    const member = team[index];
    const photo = skipImages
      ? null
      : await uploadImage(member.photo, `${member.id}.jpg`);

    await save({
      _id: `teamMember-${member.id}`,
      _type: "teamMember",
      name: member.name,
      role: member.role,
      order: index + 1,
      photo: imageField(photo, `Portrait of ${member.name}`),
    });
  }

  // --- Before / after ------------------------------------------------------
  console.log("· Before / After");
  {
    const before = skipImages
      ? null
      : await uploadImage(beforeAfter.before, "before-after-before.jpg");
    const after = skipImages
      ? null
      : await uploadImage(beforeAfter.after, "before-after-after.jpg");

    await save({
      _id: "beforeAfter-harbour-warehouse-conversion",
      _type: "beforeAfter",
      title: beforeAfter.title,
      location: beforeAfter.location,
      before: imageField(before, `${beforeAfter.title} — before renovation`),
      after: imageField(after, `${beforeAfter.title} — after renovation`),
    });
  }

  console.log("\n[seed] Done. Open /studio to see and edit the content.\n");
}

main().catch((error) => {
  console.error("\n[seed] Failed:", error);
  process.exit(1);
});
