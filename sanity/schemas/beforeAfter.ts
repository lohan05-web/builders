import { defineField, defineType } from "sanity";
import { altTextField, imageOptions } from "./helpers";

/**
 * The before/after comparison shown in the renovation slider.
 *
 * Both photos must show the same property so the drag reveals the
 * transformation clearly.
 */
export const beforeAfter = defineType({
  name: "beforeAfter",
  title: "Before / After",
  type: "document",
  description:
    "The before/after pair used by the renovation slider on the home page.",
  fields: [
    defineField({
      name: "title",
      title: "Project title",
      type: "string",
      description: "Shown under the slider.",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "before",
      title: "Before image",
      type: "image",
      description: "The property before the renovation.",
      options: imageOptions,
      fields: [altTextField()],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "after",
      title: "After image",
      type: "image",
      description: "The same property after the renovation.",
      options: imageOptions,
      fields: [altTextField()],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "location", media: "after" },
    prepare({ title, subtitle, media }) {
      return { title, subtitle, media };
    },
  },
});
