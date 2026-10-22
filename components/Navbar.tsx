"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import { track } from "@vercel/analytics";
import { navLinks } from "@/data/site";
import { useSite } from "@/components/SiteSettingsProvider";
import { useIsStudio } from "@/components/useIsStudio";

/** Pixels scrolled before the navbar switches to its solid/blurred state. */
const SCROLL_THRESHOLD = 24;

export default function Navbar() {
  const pathname = usePathname();
  /** The company details, resolved on the server and shared via context. */
  const site = useSite();
  /** True while the embedded Studio is open. */
  const isStudio = useIsStudio();
  /** True once the user has scrolled past the top of the page. */
  const [isScrolled, setIsScrolled] = useState(false);
  /** Controls the mobile slide-in drawer. */
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isHome = pathname === "/";

  // --- Track scroll position -------------------------------------------
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD);

    // Set the initial state in case the page loads mid-scroll (e.g. refresh).
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- Lock body scrolling while the drawer is open ----------------------
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // --- Close the drawer on Escape ---------------------------------------
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  // The Studio gets the full browser window — no site chrome.
  if (isStudio) return null;

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-smooth",
          // Inner pages have no hero behind the bar, so it starts solid.
          !isHome
            ? "border-b border-white/10 bg-charcoal"
            : isScrolled
              ? "border-b border-white/10 bg-charcoal/80 backdrop-blur-xl supports-[backdrop-filter]:bg-charcoal/60"
              : "border-b border-transparent bg-transparent",
        ].join(" ")}
      >
        <nav
          aria-label="Main navigation"
          className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10"
        >
          {/* --- Logo -------------------------------------------------- */}
          <Link
            href="/"
            onClick={closeMenu}
            className="group flex items-center gap-2.5"
            aria-label={`${site.name} — home`}
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

          {/* --- Desktop links ------------------------------------------ */}
          <ul className="hidden items-center gap-6 lg:flex xl:gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group relative text-sm font-medium tracking-wide text-white/75 transition-colors duration-300 hover:text-gold"
                >
                  {link.label}
                  {/* Gold underline that grows on hover */}
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1.5 left-0 h-px w-0 bg-gold transition-all duration-300 ease-smooth group-hover:w-full"
                  />
                </Link>
              </li>
            ))}
          </ul>

          {/* --- Right-hand actions ------------------------------------ */}
          <div className="flex items-center gap-3">
            {/* Phone number (desktop only) */}
            <a
              href={`tel:${site.phoneHref}`}
              onClick={() => track("call_click", { location: "navbar" })}
              className="hidden items-center gap-2 text-sm text-white/70 transition-colors duration-300 hover:text-gold xl:flex"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {site.phone}
            </a>

            {/* Gold CTA */}
            <Link
              href="/#contact"
              className="hidden rounded-sm bg-gold px-5 py-3 text-sm font-semibold tracking-wide text-charcoal transition-all duration-300 ease-smooth hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20 sm:block xl:px-6"
            >
              Free Consultation
            </Link>

            {/* Hamburger toggle (mobile + tablet) */}
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              className="flex h-11 w-11 items-center justify-center rounded-sm border border-white/15 text-white transition-colors duration-300 hover:border-gold/60 hover:text-gold lg:hidden"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* --- Mobile drawer ---------------------------------------------- */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeMenu}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
              aria-hidden="true"
            />

            {/* Slide-in panel */}
            <motion.div
              key="mobile-drawer"
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 260 }}
              className="fixed right-0 top-0 z-50 flex h-full w-[85%] max-w-sm flex-col border-l border-white/10 bg-charcoal-800 px-7 pb-10 pt-7 lg:hidden"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-semibold text-white">
                  {site.name}
                </span>
                <button
                  type="button"
                  onClick={closeMenu}
                  aria-label="Close menu"
                  className="flex h-10 w-10 items-center justify-center rounded-sm border border-white/15 text-white transition-colors duration-300 hover:border-gold/60 hover:text-gold"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              {/* Drawer links */}
              <ul className="mt-10 flex flex-col gap-1">
                {navLinks.map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.08 + index * 0.05,
                      duration: 0.35,
                      ease: "easeOut",
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      className="flex items-center gap-4 border-b border-white/5 py-4 font-display text-xl text-white/85 transition-colors duration-300 hover:text-gold"
                    >
                      <span className="text-xs font-sans text-gold/60">
                        0{index + 1}
                      </span>
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              {/* Drawer footer / CTA */}
              <div className="mt-auto flex flex-col gap-3 pt-8">
                <Link
                  href="/#contact"
                  onClick={closeMenu}
                  className="w-full rounded-sm bg-gold px-6 py-4 text-center text-sm font-semibold tracking-wide text-charcoal transition-colors duration-300 hover:bg-gold-light"
                >
                  Free Consultation
                </Link>
                <a
                  href={`tel:${site.phoneHref}`}
                  onClick={closeMenu}
                  className="flex w-full items-center justify-center gap-2 rounded-sm border border-white/15 px-6 py-4 text-sm text-white/80 transition-colors duration-300 hover:border-gold/60 hover:text-gold"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {site.phone}
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
