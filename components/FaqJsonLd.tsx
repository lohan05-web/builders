import { faqs as fallbackFaqs, type FaqItem } from "@/data/faqs";

interface FaqJsonLdProps {
  /**
   * The questions and answers published as structured data.
   *
   * Resolved on the server (from Sanity, falling back to the local data)
   * and handed down as a prop.
   */
  faqs: FaqItem[];
}

/**
 * The FAQ structured data (`FAQPage`).
 *
 * It is what lets Google show the questions and answers directly in the
 * search results.
 */
export default function FaqJsonLd({ faqs }: FaqJsonLdProps) {
  const items = faqs.length > 0 ? faqs : fallbackFaqs;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
