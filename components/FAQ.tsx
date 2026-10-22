"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/data/faqs";

/** Shared easing curve. */
const EASE = [0.22, 1, 0.36, 1] as const;

export default function FAQ() {
  /** Id of the currently open item — only one is open at a time. */
  const [openId, setOpenId] = useState<string | null>(null);

  /** Toggle a row open/closed. */
  const toggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section
      id="faq"
      className="relative w-full scroll-mt-24 bg-charcoal py-24 sm:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-3xl px-5 sm:px-8 lg:px-10">
        {/* --- Section heading ------------------------------------------- */}
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">
            FAQ
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/50 sm:text-base">
            Straight answers to the questions we hear most often.
          </p>
        </div>

        {/* --- Accordion -------------------------------------------------- */}
        <div className="mt-14 divide-y divide-white/5 rounded-sm border border-white/10">
          {faqs.map((item) => {
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
                    className="flex w-full items-center justify-between gap-6 px-5 py-6 text-left transition-colors duration-300 hover:bg-white/[0.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-inset sm:px-7"
                  >
                    <span className="font-display text-lg font-medium text-white sm:text-xl">
                      {item.question}
                    </span>
                    <motion.span
                      aria-hidden="true"
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-gold/40 text-gold"
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
                      transition={{ duration: 0.35, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-6 text-sm leading-relaxed text-white/55 sm:px-7 sm:text-base">
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
