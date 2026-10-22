import type { Metadata } from "next";

/**
 * The 404 page is never indexable. Next.js also injects a `noindex` meta tag
 * for 404 responses, but declaring it here keeps the head free of
 * conflicting robots directives.
 */
export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist or has been moved.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-charcoal px-5">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-gold">
          404 — Page Not Found
        </p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
          Lost on the build site
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-white/55">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-sm bg-gold px-8 py-4 text-sm font-semibold tracking-wide text-charcoal transition-all duration-300 ease-smooth hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20"
          >
            Back to Home
          </a>
          <a
            href="/#contact"
            className="inline-flex items-center justify-center rounded-sm border border-white/15 px-8 py-4 text-sm font-semibold tracking-wide text-white/80 transition-colors duration-300 hover:border-gold hover:text-gold"
          >
            Get a Free Quote
          </a>
        </div>
      </div>
    </section>
  );
}
