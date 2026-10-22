import { defineField } from "sanity";

/**
 * Shared field helpers used by more than one schema.
 */

/**
 * A reusable "alternative text" field.
 *
 * Every image in the schemas uses it so the client always has to describe
 * what a photo shows — it is used for accessibility and for image SEO.
 *
 * @returns A fresh field definition (Sanity mutates field objects).
 */
export const altTextField = () =>
  defineField({
    name: "alt",
    title: "Alternative text",
    type: "string",
    description:
      "Describe the image for people using a screen reader, e.g. \"Concrete villa with floor-to-ceiling windows\".",
    validation: (rule) =>
      rule
        .required()
        .min(5)
        .warning(
          "Add a short description — it is used for accessibility and image SEO.",
        ),
  });

/**
 * Options shared by every image field (hotspot cropping).
 */
export const imageOptions = { hotspot: true };
