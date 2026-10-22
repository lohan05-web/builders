"use client";

import Link from "next/link";
import { ArrowUp, Clock, Mail, MapPin, Phone } from "lucide-react";
import { track } from "@vercel/analytics";
import { navLinks } from "@/data/site";
import type { Service } from "@/data/services";
import { useSite } from "@/components/SiteSettingsProvider";
import { useIsStudio } from "@/components/useIsStudio";
import { socialIcons, socialLabels, type SocialNetwork } from "./SocialIcons";

/** The networks shown in the footer, in display order. */
const SOCIAL_NETWORKS: SocialNetwork[] = [
  "facebook",
  "instagram",
  "linkedin",
  "youtube",
];

interface FooterProps {
  /** The services catalogue, resolved on the server. */
  services: Service[];
}

export default function Footer({ services }: FooterProps) {
  /** The company details, resolved on the server and shared via context. */
  const site = useSite();
  /** True while the embedded Studio is open. */
  const isStudio = useIsStudio();

  /** Scroll smoothly back to the very top of the page. */
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // The Studio gets the full browser window — no site chrome.
  if (isStudio) return null;

  return (
    <footer className="relative border-t border-gold bg-charcoal-900">
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-16 sm:px-8 sm:pt-20 lg:px-10">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {/* ----------------------------- Brand --------------------- */}
          <div>
            <Link
              href="/"
              aria-label={`${site.name} — back to top of page`}
              className="group flex items-center gap-2.5"
            >
              <span
                aria-hidden="true"
                className="flex h-9 w-9 items-center justify-center rounded-sm border border-gold/60 font-display text-base font-bold text-gold transition-colors duration-300 group-hover:bg-gold group-hover:text-charcoal"
              >
                LM
              </span>
              <span className="font-display text-xl font-semibold tracking-wide text-white sm:text-2xl">
                {site.name}
              </span>
            </Link>

            <p className="mt-5 text-sm leading-relaxed text-white/50">
              {site.description}
            </p>

            <p className="mt-5 font-display text-sm italic text-gold/80">
              {site.tagline}
            </p>
          </div>

          {/* -------------------------- Quick links ------------------- */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white">
              Quick Links
            </h2>
            <span aria-hidden="true" className="mt-3 block h-px w-10 bg-gold" />

            <ul className="mt-5 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/55 transition-colors duration-300 hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {/* Plain anchor — the FAQ section has no nav entry of its own. */}
              <li>
                <Link
                  href="/#faq"
                  className="text-sm text-white/55 transition-colors duration-300 hover:text-gold"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* ---------------------------- Services -------------------- */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white">
              Services
            </h2>
            <span aria-hidden="true" className="mt-3 block h-px w-10 bg-gold" />

            <ul className="mt-5 space-y-3">
              {services.map((service) => (
                <li key={service.id}>
                  <Link
                    href="/#services"
                    className="text-sm text-white/55 transition-colors duration-300 hover:text-gold"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* --------------------------- Contact info ------------------ */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white">
              Get in Touch
            </h2>
            <span aria-hidden="true" className="mt-3 block h-px w-10 bg-gold" />

            <ul className="mt-5 space-y-4">
              <li className="flex gap-3">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-gold"
                  aria-hidden="true"
                />
                <span className="text-sm leading-relaxed text-white/55">
                  {site.address.full}
                </span>
              </li>
              <li className="flex gap-3">
                <Phone
                  className="mt-0.5 h-4 w-4 shrink-0 text-gold"
                  aria-hidden="true"
                />
                <a
                  href={`tel:${site.phoneHref}`}
                  onClick={() => track("call_click", { location: "footer" })}
                  className="text-sm text-white/55 transition-colors duration-300 hover:text-gold"
                >
                  {site.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail
                  className="mt-0.5 h-4 w-4 shrink-0 text-gold"
                  aria-hidden="true"
                />
                <a
                  href={`mailto:${site.email}`}
                  className="break-all text-sm text-white/55 transition-colors duration-300 hover:text-gold"
                >
                  {site.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock
                  className="mt-0.5 h-4 w-4 shrink-0 text-gold"
                  aria-hidden="true"
                />
                <span className="text-sm text-white/55">
                  {site.workingHours[0].days}: {site.workingHours[0].hours}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ------------------------------ Bottom bar ------------------- */}
      {/* Extra bottom padding on small screens so the floating action
          buttons never sit on top of this row. */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-5 pb-32 pt-7 sm:flex-row sm:justify-between sm:px-8 sm:pb-8 lg:px-10">
          <p className="text-xs text-white/35">
            (c) 2026 {site.name}. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
            <Link
              href="/privacy-policy"
              className="text-xs text-white/40 transition-colors duration-300 hover:text-gold"
            >
              Privacy Policy
            </Link>

            {/* Social icons */}
            <div className="flex items-center gap-2.5">
              {SOCIAL_NETWORKS.map((network) => {
                const Icon = socialIcons[network];
                return (
                  <a
                    key={network}
                    href={site.social[network]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${site.name} on ${socialLabels[network]}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/50 transition-all duration-300 ease-smooth hover:border-gold hover:text-gold"
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                );
              })}
            </div>

            {/* Back to top */}
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              className="flex h-9 items-center gap-1.5 rounded-sm border border-gold px-3 text-[11px] font-semibold uppercase tracking-widest text-gold transition-colors duration-300 hover:bg-gold hover:text-charcoal"
            >
              <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
              Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
