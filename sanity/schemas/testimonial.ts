import { defineField, defineType } from "sanity";
import { altTextField, imageOptions } from "./helpers";

/**
 * A client testimonial shown in the "What Our Clients Say" carousel.
 */
export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonials",
  type: "document",
  description: "Feedback from a client the company built for.",
  fields: [
    defineField({
      name: "name",
      title: "Client name",
      type: "string",
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "projectName",
      title: "Project name",
      type: "string",
      description: "The project the client commissioned.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "City / region the project was built in.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 4,
      description: "The client's words — two or three short lines.",
      validation: (rule) => rule.required().min(30),
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
      name: "rating",
      title: "Rating",
      type: "number",
      description: "How many stars out of five the client gave.",
      options: {
        list: [
          { title: "1 star", value: 1 },
          { title: "2 stars", value: 2 },
          { title: "3 stars", value: 3 },
          { title: "4 stars", value: 4 },
          { title: "5 stars", value: 5 },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required().integer().min(1).max(5),
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "projectName", media: "photo" },
    prepare({ title, subtitle, media }) {
      return { title, subtitle, media };
    },
  },
});
