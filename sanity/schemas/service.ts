import { defineField, defineType } from "sanity";

/**
 * One of the services listed in the "Our Services" grid.
 */
export const service = defineType({
  name: "service",
  title: "Services",
  type: "document",
  description: "A service the company offers.",
  fields: [
    defineField({
      name: "title",
      title: "Service title",
      type: "string",
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "One or two lines shown under the title.",
      validation: (rule) => rule.required().min(20),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      description:
        "Pick the line icon that best matches the service. Only these icons exist on the website.",
      options: {
        list: [
          { title: "Home (residential)", value: "Home" },
          { title: "Building (commercial)", value: "Building2" },
          { title: "Paint roller (renovation)", value: "PaintRoller" },
          { title: "Armchair (interiors)", value: "Armchair" },
          { title: "Drafting compass (structural)", value: "DraftingCompass" },
          { title: "Clipboard (project management)", value: "ClipboardCheck" },
        ],
        layout: "radio",
      },
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
    select: { title: "title", subtitle: "icon", order: "order" },
    prepare({ title, subtitle, order }) {
      return {
        title,
        subtitle: `${order ?? "–"} · ${subtitle ?? ""}`.trim(),
      };
    },
  },
});
