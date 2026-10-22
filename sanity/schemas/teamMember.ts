import { defineField, defineType } from "sanity";
import { altTextField, imageOptions } from "./helpers";

/**
 * A member of the leadership / site team shown in the About section.
 */
export const teamMember = defineType({
  name: "teamMember",
  title: "Team",
  type: "document",
  description: "A person shown in the “The people on your site” row.",
  fields: [
    defineField({
      name: "name",
      title: "Full name",
      type: "string",
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      description: "Their job title, e.g. “Project Director”.",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "photo",
      title: "Portrait",
      type: "image",
      options: imageOptions,
      fields: [altTextField()],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      description: "Lower numbers appear first.",
      initialValue: 1,
      validation: (rule) => rule.required().integer().min(0),
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "photo" },
    prepare({ title, subtitle, media }) {
      return { title, subtitle, media };
    },
  },
});
