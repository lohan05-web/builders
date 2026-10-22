/**
 * Client testimonials shown in the "What Our Clients Say" carousel.
 *
 * Images are hosted on Unsplash and optimised through `next/image`
 * (`images.unsplash.com` is already allowed in `next.config.mjs`).
 */

/** Star rating a client can leave. */
export type Rating = 1 | 2 | 3 | 4 | 5;

export interface Testimonial {
  /** Stable slug — used as the React key. */
  id: string;
  /** Client's full name. */
  name: string;
  /** Name of the project they commissioned. */
  projectName: string;
  /** City / region the project was built in. */
  location: string;
  /** The client's words — two to three short lines. */
  quote: string;
  /** Unsplash portrait URL. */
  photo: string;
  /**
   * Alternative text for the portrait.
   *
   * Comes from the CMS when the testimonial is managed in Sanity; empty for
   * the local fallback data, in which case the client's name is used.
   */
  photoAlt?: string;
  /** Star rating out of five. */
  rating: Rating;
}

/** Unsplash helper — keeps the query string consistent across the file. */
const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=400&q=80`;

export const testimonials: Testimonial[] = [
  {
    id: "ananya-iyer",
    name: "Ananya Iyer",
    projectName: "Lakeview Residence",
    location: "Bengaluru, Karnataka",
    quote:
      "They handed over our home two weeks early and not a single thing was left pending. The daily site updates meant we never had to chase anyone for an answer.",
    photo: unsplash("photo-1494790108377-be9c29b29330"),
    rating: 5,
  },
  {
    id: "rahul-mehta",
    name: "Rahul Mehta",
    projectName: "Meridian Tech Park",
    location: "Pune, Maharashtra",
    quote:
      "We were on a very tight deadline. LM Builders pulled resources from three sites to keep our fit-out on schedule without compromising on quality.",
    photo: unsplash("photo-1507003211169-0a1dd7228f2d"),
    rating: 5,
  },
  {
    id: "sneha-patel",
    name: "Sneha Patel",
    projectName: "Apartment Renovation",
    location: "Mumbai, Maharashtra",
    quote:
      "The cost estimate they gave on day one was the cost we paid on the final bill. That kind of honesty is rare in this industry and it built a lot of trust.",
    photo: unsplash("photo-1544005313-94ddf0286df2"),
    rating: 5,
  },
  {
    id: "vivek-reddy",
    name: "Vivek Reddy",
    projectName: "Sunrise Villa",
    location: "Hyderabad, Telangana",
    quote:
      "Our architect had a very specific vision and the site team executed it to the millimetre. The finish quality on the stone and joinery is genuinely showroom grade.",
    photo: unsplash("photo-1500648767791-00dcc994a43e"),
    rating: 5,
  },
  {
    id: "priya-nair",
    name: "Priya Nair",
    projectName: "Coastal Restaurant Fit-out",
    location: "Chennai, Tamil Nadu",
    quote:
      "They worked around our business hours and kept the noise down. The crew was polite, well organised and cleaned up every single evening before leaving.",
    photo: unsplash("photo-1438761681033-6461ffad8d80"),
    rating: 4,
  },
  {
    id: "arjun-singh",
    name: "Arjun Singh",
    projectName: "Maple Court Apartments",
    location: "Gurugram, Haryana",
    quote:
      "Twelve flats delivered as one project, and every single one matched the sample we approved. Their structural warranty has made selling the building far easier.",
    photo: unsplash("photo-1524504388940-b1c1722653e1"),
    rating: 5,
  },
  {
    id: "kavya-rao",
    name: "Kavya Rao",
    projectName: "Design Studio Interiors",
    location: "Noida, Uttar Pradesh",
    quote:
      "From the first sketch to the final styling, everything came from one team. It never felt like chasing three different contractors for one small room.",
    photo: unsplash("photo-1517841905240-472988babdf9"),
    rating: 5,
  },
];
