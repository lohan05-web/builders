import { defineField, defineType } from "sanity";

/**
 * A question and answer pair shown in the FAQ accordion.
 *
 * The same entries are published as `FAQPage` structured data for Google.
 */
export const faq = defineType({
  name: "faq",
  title: "FAQs",
  type: "document",
  description: "A question clients ask often, and the answer.",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (rule) => rule.required().max(140),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "text",
      rows: 5,
      description:
        "Keep it short and to the point — this is also published as structured data.",
      validation: (rule) => rule.required().min(20),
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
    select: { title: "question", subtitle: "order" },
    prepare({ title, subtitle }) {
      return { title, subtitle: subtitle ? `Order ${subtitle}` : undefined };
    },
  },
});
