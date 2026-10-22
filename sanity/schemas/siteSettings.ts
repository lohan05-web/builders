import { defineField, defineType } from "sanity";

/**
 * The single document holding the company's contact details.
 *
 * The Studio pins this to one document (see `sanity.config.ts`), so there
 * is only ever one copy of it.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  description:
    "Company name, contact details, opening hours, social links and the key figures shown in the stats band.",
  fields: [
    defineField({
      name: "companyName",
      title: "Company name",
      type: "string",
      group: "general",
      description: "Shown in the navbar, the footer and the page titles.",
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      group: "general",
      description: "The short line used in the hero and the page titles.",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "description",
      title: "Meta description",
      type: "text",
      rows: 3,
      group: "general",
      description:
        "Used for search-engine previews and as the description in the footer.",
      validation: (rule) => rule.required().min(40).max(200),
    }),

    defineField({
      name: "phone",
      title: "Phone number",
      type: "string",
      group: "contact",
      description: "How the number is displayed, e.g. “+91 98765 43210”.",
      validation: (rule) => rule.required().min(8),
    }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp number",
      type: "string",
      group: "contact",
      description:
        "Digits only, with the country code and no “+” or spaces — e.g. 919876543210.",
      validation: (rule) =>
        rule
          .required()
          .regex(/^[0-9]{10,15}$/, { name: "digits only" }),
    }),
    defineField({
      name: "email",
      title: "Email address",
      type: "string",
      group: "contact",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "object",
      group: "contact",
      options: { columns: 1 },
      fields: [
        defineField({
          name: "street",
          title: "Street address",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "city",
          title: "City",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "state",
          title: "State",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "postalCode",
          title: "Postal code",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "country",
          title: "Country",
          type: "string",
          initialValue: "India",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "workingHours",
      title: "Working hours",
      type: "array",
      group: "contact",
      description: "Shown in the contact panel and in the footer.",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "days",
              title: "Days",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "hours",
              title: "Hours",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "days", subtitle: "hours" },
          },
        },
      ],
      validation: (rule) => rule.min(1),
    }),

    defineField({
      name: "social",
      title: "Social links",
      type: "object",
      group: "contact",
      options: { columns: 1 },
      fields: [
        defineField({ name: "facebook", title: "Facebook", type: "url" }),
        defineField({ name: "instagram", title: "Instagram", type: "url" }),
        defineField({ name: "linkedin", title: "LinkedIn", type: "url" }),
        defineField({ name: "youtube", title: "YouTube", type: "url" }),
      ],
    }),

    defineField({
      name: "stats",
      title: "Key figures",
      type: "array",
      group: "general",
      description:
        "The four numbers in the gold stats band. Leave the suffix empty for a plain number.",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description: "e.g. “Projects Completed”.",
              validation: (rule) => rule.required().max(40),
            }),
            defineField({
              name: "value",
              title: "Value",
              type: "number",
              description: "The number that counts up on the page.",
              validation: (rule) => rule.required().integer().min(0),
            }),
            defineField({
              name: "suffix",
              title: "Suffix",
              type: "string",
              description: "Text shown right after the number, e.g. “+” or “L+”.",
            }),
          ],
          preview: {
            select: { title: "label", value: "value", suffix: "suffix" },
            prepare({ title, value, suffix }) {
              return {
                title,
                subtitle: `${value ?? 0}${suffix ? ` ${suffix}` : ""}`,
              };
            },
          },
        },
      ],
      validation: (rule) => rule.max(6),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Site Settings",
        subtitle: "Company name, contact details and key figures",
      };
    },
  },
});
