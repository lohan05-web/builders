"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Phone } from "lucide-react";
import { track } from "@vercel/analytics";
import { useSite } from "@/components/SiteSettingsProvider";
import { useIsStudio } from "@/components/useIsStudio";
import { whatsappLink } from "@/data/site";

/** How far the user has to scroll before the buttons fade in. */
const REVEAL_AFTER_PX = 300;

export default function FloatingButtons() {
  /** The company details, resolved on the server and shared via context. */
  const site = useSite();
  /** True while the embedded Studio is open. */
  const isStudio = useIsStudio();
  /** True once the user has scrolled past the reveal threshold. */
  const [isVisible, setIsVisible] = useState(false);

  // --- Reveal the buttons once the page has been scrolled ---------------
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > REVEAL_AFTER_PX);
    };

    // Set the initial state in case the page loads mid-scroll.
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // The Studio gets the full browser window — no site chrome.
  if (isStudio) return null;

  return (
    // `z-40` keeps the buttons above the page content but below the navbar.
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-center gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {isVisible ? (
          <motion.div
            key="floating-actions"
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.9 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-3"
          >
            {/* --- WhatsApp ------------------------------------------- */}
            <a
              href={whatsappLink(site.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click", { location: "floating_button" })}
              aria-label="Chat with us on WhatsApp"
              className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/40 transition-transform duration-300 ease-smooth hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:h-14 sm:w-14"
            >
              {/* Subtle pulse ring — purely decorative. */}
              <span
                aria-hidden="true"
                className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-60"
              />
              <MessageCircle
                className="relative h-6 w-6 sm:h-7 sm:w-7"
                aria-hidden="true"
              />
            </a>

            {/* --- Call ----------------------------------------------- */}
            <a
              href={`tel:${site.phoneHref}`}
              onClick={() => track("call_click", { location: "floating_button" })}
              aria-label={`Call ${site.name} on ${site.phone}`}
              className="group flex h-12 w-12 items-center justify-center rounded-full bg-gold text-charcoal shadow-lg shadow-black/40 transition-transform duration-300 ease-smooth hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:h-14 sm:w-14"
            >
              <Phone className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
            </a>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
