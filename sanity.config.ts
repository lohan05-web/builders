"use client";

import { defineConfig } from "sanity";
import { structureTool, type StructureBuilder } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { apiVersion, dataset, projectId } from "./sanity/publicEnv";

/**
 * The Studio sidebar.
 *
 * The order is deliberate: the company details sit at the top because
 * they are the first thing to update, followed by the content sections in
 * the order they appear on the website.
 *
 * @param S The Sanity structure builder.
 */
const structure = (S: StructureBuilder) =>
  S.list()
    .title("Content")
    .items([
      // The single site-settings document — always the same id so there
      // is only ever one copy of it.
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Site Settings"),
        ),
      S.divider(),
      S.documentTypeListItem("project").title("Projects"),
      S.documentTypeListItem("service").title("Services"),
      S.documentTypeListItem("testimonial").title("Testimonials"),
      S.documentTypeListItem("faq").title("FAQs"),
      S.documentTypeListItem("teamMember").title("Team"),
      S.documentTypeListItem("beforeAfter").title("Before / After"),
    ]);

/**
 * The Sanity Studio configuration.
 *
 * The Studio is embedded in the website at `/studio`, so the client can
 * edit the content at `yoursite.com/studio` without opening Sanity.
 *
 * This file is a client module: the Studio runs entirely in the browser,
 * so it may only read `NEXT_PUBLIC_*` environment variables.
 */
export default defineConfig({
  /** Used as the local-storage key for the Studio in the browser. */
  name: "lm-builders",
  title: "LM Builders",
  /** The website project. */
  projectId: projectId || "placeholder",
  /** The dataset the Studio writes to. */
  dataset,
  /** Where the Studio is mounted. */
  basePath: "/studio",
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: {
    types: schemaTypes,
  },
});
