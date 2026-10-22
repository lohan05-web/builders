import { defineField, defineType } from "sanity";
import { altTextField, imageOptions } from "./helpers";

/**
 * A building project shown in the portfolio grid and on its own detail page.
 */
export const project = defineType({
  name: "project",
  title: "Projects",
  type: "document",
  description:
    "A building project. Every project gets its own page at /projects/<slug>.",
  groups: [
    { name: "general", title: "General", default: true },
    { name: "details", title: "Details" },
    { name: "media", title: "Media" },
    { name: "content", title: "Content" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Project title",
      type: "string",
      group: "general",
      description: "The name of the project, e.g. “Riverside Villa”.",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      group: "general",
      description:
        "The last part of the page address. It is generated from the title.",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      group: "general",
      description: "Used by the filter tabs above the project grid.",
      options: {
        list: [
          { title: "Residential", value: "Residential" },
          { title: "Commercial", value: "Commercial" },
          { title: "Interiors", value: "Interiors" },
          { title: "Renovation", value: "Renovation" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured project",
      type: "boolean",
      group: "general",
      description:
        "Featured projects are pinned to the top of the project grid.",
      initialValue: false,
    }),

    defineField({
      name: "location",
      title: "Location",
      type: "string",
      group: "details",
      description: "City / area the project was built in.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "area",
      title: "Built area (sq.ft)",
      type: "number",
      group: "details",
      description: "The built-up area in square feet.",
      validation: (rule) => rule.required().positive().integer(),
    }),
    defineField({
      name: "year",
      title: "Year of completion",
      type: "number",
      group: "details",
      validation: (rule) =>
        rule.required().integer().min(1990).max(new Date().getFullYear() + 1),
    }),
    defineField({
      name: "duration",
      title: "Duration",
      type: "string",
      group: "details",
      description: "How long the build took, e.g. “12 months”.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "budgetRange",
      title: "Budget range",
      type: "string",
      group: "details",
      description: "Indicative budget, e.g. “Rs. 5 Cr - 6 Cr”.",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "mainImage",
      title: "Main image",
      type: "image",
      group: "media",
      options: imageOptions,
      fields: [altTextField()],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "gallery",
      title: "Gallery images",
      type: "array",
      group: "media",
      description: "Extra photos shown in the gallery on the project page.",
      of: [
        {
          type: "image",
          options: imageOptions,
          fields: [altTextField()],
        },
      ],
      options: { layout: "grid" },
      validation: (rule) => rule.max(10),
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "text",
      group: "content",
      rows: 6,
      description:
        "Two short paragraphs. Leave a blank line between them and they will be shown as separate paragraphs.",
      validation: (rule) => rule.required().min(40),
    }),
    defineField({
      name: "materials",
      title: "Materials used",
      type: "array",
      group: "content",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "features",
      title: "Key features",
      type: "array",
      group: "content",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      validation: (rule) => rule.unique(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "location",
      media: "mainImage",
      category: "category",
    },
    prepare({ title, subtitle, media, category }) {
      return {
        title,
        subtitle: [category, subtitle].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
