"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { faqs as fallbackFaqs, type FaqItem } from "@/data/faqs";

/** Shared easing curve. */
const EASE = [0.22, 1, 0.36, 1] as const;

interface FAQProps {
  /**
   * The questions and answers shown in the accordion.
   *
   * Resolved on the server (from Sanity, falling back to the local data)
   * and handed down as a prop.
   */
  faqs: FaqItem[];
}

export default function FAQ({ faqs }: FAQProps) {
  // Never render an empty accordion — fall back to the local questions.
  const items = faqs.length > 0 ? faqs : fallbackFaqs;

  /** Id of the currently open item — only one is open at a time. */
  const [openId, setOpenId] = useState<string | null>(null);

  /** Toggle a row open/closed. */
  const toggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section
      id="faq"
      className="relative w-full scroll-mt-20 bg-navy py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* --- Section heading ------------------------------------------- */}
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-orange">
            FAQ
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
            Straight answers to the questions we hear most often.
          </p>
        </div>

        {/* --- Accordion -------------------------------------------------- */}
        <div className="mt-10 divide-y divide-white/10 rounded-sm border border-white/10 sm:mt-14">
          {items.map((item) => {
            const isOpen = openId === item.id;
            const buttonId = `faq-button-${item.id}`;
            const panelId = `faq-panel-${item.id}`;

            return (
              <div key={item.id}>
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(item.id)}
                    className="flex w-full items-center justify-between gap-5 px-4 py-5 text-left transition-colors duration-200 hover:bg-white/[0.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-orange/80 focus-visible:ring-offset-2 focus-visible:ring-offset-navy sm:px-6 sm:py-6"
                  >
                    <span className="font-display text-lg font-medium leading-snug text-white sm:text-xl">
                      {item.question}
                    </span>
                    <motion.span
                      aria-hidden="true"
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25, ease: EASE }}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-orange/60 text-orange"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.span>
                  </button>
                </h3>

                {/* Smooth height animation — Framer Motion only. */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pb-5 text-sm leading-relaxed text-white/75 sm:px-6 sm:pb-6 sm:text-base">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
