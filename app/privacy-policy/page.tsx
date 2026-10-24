import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, lastUpdated, site as localSite } from "@/data/site";

export function generateMetadata(): Metadata {
  const site = localSite;

  return {
    title: "Privacy Policy",
    description: `Privacy policy for ${site.name}.`,
    alternates: {
      canonical: `${SITE_URL}/privacy-policy`,
    },
    openGraph: {
      title: `Privacy Policy | ${site.name}`,
      description: `Privacy policy for ${site.name}.`,
      url: `${SITE_URL}/privacy-policy`,
    },
  };
}

/** Small helper for consistent section headings. */
function Heading({ children }: { children: string }) {
  return (
    <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
      {children}
    </h2>
  );
}

export default function PrivacyPolicyPage() {
  const site = localSite;

  const sections = [
    {
      title: "Information We Collect",
      body: [
        "When you submit the contact form on this website, we collect the details you provide: your name, email address, phone number, project type, budget range, preferred location and any message you write.",
        "We may also collect basic, anonymised usage data such as pages visited and time spent on the site. This data cannot be used to identify you personally.",
      ],
    },
    {
      title: "How We Use Your Information",
      body: [
        "We use the information you share to respond to your enquiry, prepare a quote, schedule a consultation and keep you updated about your project.",
        "We may also use your details to improve our services and website experience. We will never use your information for unrelated marketing without your explicit consent.",
      ],
    },
    {
      title: "Data Sharing",
      body: [
        "We do not sell, rent or trade your personal information to third parties.",
        "To deliver emails sent from our contact form, we use a trusted third-party email service provider — Resend. They process your data only on our behalf and are contractually required to keep it secure.",
        "We may disclose information if required by law or to protect our legal rights.",
      ],
    },
    {
      title: "Cookies and Analytics",
      body: [
        "This website may use cookies and similar technologies to remember your preferences and understand how the site is used.",
        "Analytics data helps us improve our content and performance. You can disable cookies in your browser settings, though some features may not work correctly as a result.",
      ],
    },
    {
      title: "Data Retention",
      body: [
        "We keep enquiry data only for as long as necessary to fulfil the purpose it was collected for, or to comply with legal obligations.",
        "If you would like your data deleted from our records, please contact us using the details below and we will act on your request promptly.",
      ],
    },
    {
      title: "Your Rights",
      body: [
        "You have the right to access, correct or delete the personal information we hold about you.",
        "You may also object to or restrict certain types of processing. To exercise any of these rights, contact us using the details at the bottom of this page.",
      ],
    },
    {
      title: "Contact for Privacy Questions",
      body: [
        "If you have questions or concerns about this Privacy Policy or how we handle your data, please get in touch. We will respond as soon as we can.",
      ],
    },
  ];

  return (
    <>
      {/* ===================== Hero ===================== */}
      <section id="home" className="relative w-full bg-charcoal pb-16 pt-36 sm:pb-20 sm:pt-40">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-xs font-medium tracking-wide text-white/45 sm:text-sm">
              <li>
                <Link href="/" className="transition-colors duration-300 hover:text-gold">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <span className="text-white/25">/</span>
              </li>
              <li className="text-gold" aria-current="page">
                Privacy Policy
              </li>
            </ol>
          </nav>

          <h1 className="mt-8 max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
            Privacy Policy
          </h1>
          <p className="mt-5 text-sm text-white/50">
            Last updated: <time>{lastUpdated}</time>
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
            Your privacy matters to us. This page explains what we collect, why
            we collect it and the choices you have.
          </p>
        </div>
      </section>

      {/* ===================== Content ===================== */}
      <section className="w-full border-t border-white/10 bg-charcoal-900 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 lg:px-10">
          <div className="space-y-14">
            {sections.map((section) => (
              <article key={section.title}>
                <Heading>{section.title}</Heading>
                <span aria-hidden="true" className="mt-4 block h-px w-10 bg-gold" />
                <div className="mt-5 space-y-4">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="text-sm leading-relaxed text-white/60 sm:text-base">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>

          {/* Contact block */}
          <div className="mt-16 rounded-sm border border-gold/40 bg-charcoal p-8">
            <h2 className="font-display text-xl font-semibold text-white sm:text-2xl">
              Questions about your data?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              Email us at{" "}
              <a
                href={`mailto:${site.email}`}
                className="text-gold underline decoration-gold/40 underline-offset-4 transition-colors duration-300 hover:text-gold-light"
              >
                {site.email}
              </a>{" "}
              or call{" "}
              <a
                href={`tel:${site.phoneHref}`}
                className="text-gold underline decoration-gold/40 underline-offset-4 transition-colors duration-300 hover:text-gold-light"
              >
                {site.phone}
              </a>{" "}
              and we will be happy to help.
            </p>
            <Link
              href="/#contact"
              className="mt-6 inline-flex items-center gap-2 rounded-sm bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-widest text-charcoal transition-colors duration-300 hover:bg-gold-light"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
