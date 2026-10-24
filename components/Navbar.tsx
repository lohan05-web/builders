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
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          isScrolled || !isHome
            ? "border-b border-white/10 bg-navy"
            : "border-b border-transparent bg-navy/95",
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
              className="flex h-9 w-9 items-center justify-center border border-orange bg-orange/10 font-display text-base font-bold text-orange"
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
                  className="text-sm font-medium tracking-wide text-white/90 transition-colors duration-200 hover:text-orange"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* --- Right-hand actions ------------------------------------ */}
          <div className="flex items-center gap-3">
            <a
              href={`tel:${site.phoneHref}`}
              onClick={() => track("call_click", { location: "navbar" })}
              className="hidden items-center gap-2 text-sm text-white/90 transition-colors duration-200 hover:text-orange xl:flex"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {site.phone}
            </a>

            <Link
              href="/#contact"
              className="hidden min-h-[44px] items-center rounded-sm bg-orange px-5 py-2 text-sm font-semibold tracking-wide text-white transition-colors duration-200 hover:bg-orange-hover sm:flex xl:px-6"
            >
              Get a Free Quote
            </Link>

            {/* Hamburger toggle (mobile + tablet) */}
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              className="flex h-11 w-11 items-center justify-center border border-white/20 text-white transition-colors duration-200 hover:border-orange hover:text-orange focus:outline-none focus-visible:ring-2 focus-visible:ring-orange lg:hidden"
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
              className="fixed right-0 top-0 z-50 flex h-full w-[85%] max-w-sm flex-col border-l border-white/10 bg-navy px-7 pb-10 pt-7 lg:hidden"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-semibold text-white">
                  {site.name}
                </span>
                <button
                  type="button"
                  onClick={closeMenu}
                  aria-label="Close navigation"
                  className="flex h-11 w-11 items-center justify-center border border-white/20 text-white transition-colors duration-200 hover:border-orange hover:text-orange focus:outline-none focus-visible:ring-2 focus-visible:ring-orange"
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
                      className="flex items-center gap-4 border-b border-white/5 py-4 font-display text-xl text-white/90 transition-colors duration-200 hover:text-orange focus:outline-none focus-visible:text-orange"
                    >
                      <span className="text-xs font-sans text-orange/80">
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
                  className="w-full min-h-[44px] rounded-sm bg-orange px-6 py-3 text-center text-sm font-semibold tracking-wide text-white transition-colors duration-200 hover:bg-orange-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Get a Free Quote
                </Link>
                <a
                  href={`tel:${site.phoneHref}`}
                  onClick={closeMenu}
                  className="flex w-full min-h-[44px] items-center justify-center gap-2 border border-white/20 px-6 py-3 text-sm text-white/90 transition-colors duration-200 hover:border-orange hover:text-orange focus:outline-none focus-visible:ring-2 focus-visible:ring-orange"
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
