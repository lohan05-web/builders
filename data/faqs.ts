/**
 * FAQ data for the LM Builders site.
 * Used by the FAQ accordion and the FAQ JSON-LD schema.
 */

export interface FaqItem {
  /** Unique identifier used for aria-controls. */
  id: string;
  /** Question text. */
  question: string;
  /** Answer text. */
  answer: string;
}

export const faqs: FaqItem[] = [
  {
    id: "cost-per-sqft",
    question: "What is the approximate cost per sq.ft. for construction?",
    answer:
      "Construction costs in Mumbai typically range from Rs. 2,000 to Rs. 4,500 per sq.ft., depending on the project type, location, finish level, materials and site conditions. We provide a detailed, itemised estimate after a site visit so there are no hidden surprises.",
  },
  {
    id: "construction-duration",
    question: "How long will my construction or renovation project take?",
    answer:
      "Timelines depend on scale and complexity. A new residential build can take 8-18 months, interior fit-outs 2-6 months, and renovations 4-12 months. We share a realistic schedule at the outset and keep you updated with milestone reviews throughout.",
  },
  {
    id: "approvals-and-permits",
    question: "Do you handle approvals and permits?",
    answer:
      "Yes. We assist with municipal approvals, building permissions, commencement certificates, fire NOC where applicable, and other statutory clearances for your project. Our team coordinates with the relevant authorities to keep paperwork moving smoothly.",
  },
  {
    id: "payment-schedule",
    question: "What is your payment schedule?",
    answer:
      "We follow a milestone-based payment schedule tied to clearly defined stages (e.g. mobilisation, foundation, structure, finishing, handover). A typical split is agreed in the contract, with a reasonable advance and the balance linked to measurable progress. We share BOQ details upfront for full transparency.",
  },
  {
    id: "materials-quality",
    question: "How do you ensure materials quality?",
    answer:
      "We source from reputed brands and verified suppliers, inspect materials on delivery, and maintain a site checklist for critical items. Where specified, we use brand-approved products. You are welcome to review material samples and specifications before procurement.",
  },
  {
    id: "warranty",
    question: "Do you provide a warranty for your work?",
    answer:
      "Yes. We provide a workmanship warranty as specified in the contract, covering structural and execution-related defects for the agreed period. We also guide you on manufacturer warranties for fittings, fixtures and equipment we install.",
  },
  {
    id: "customize-design",
    question: "Can I customise the design to suit my needs?",
    answer:
      "Absolutely. We work closely with you to tailor layouts, finishes, storage, lighting and functionality to your lifestyle or business requirements. If you already have plans, we can review and build to them. If not, we can coordinate design support to bring your ideas to life.",
  },
  {
    id: "handle-interiors",
    question: "Do you handle interiors as well?",
    answer:
      "Yes. We offer end-to-end interior solutions — from space planning and false ceilings to modular kitchens, wardrobes, lighting, flooring and soft furnishings. Whether it's a full-home interior or a single room, our in-house team ensures a cohesive finish that matches the build quality.",
  },
];
