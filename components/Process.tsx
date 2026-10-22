"use client";

import { motion, type Variants } from "framer-motion";
import {
  FileCheck2,
  HardHat,
  KeyRound,
  MessagesSquare,
  PenTool,
  type LucideIcon,
} from "lucide-react";
import { processSteps, type ProcessIconName } from "@/data/process";

/**
 * Maps each step's icon name to its lucide-react component.
 * Keeping the map here means `data/process.ts` stays free of JSX.
 */
const stepIcons: Record<ProcessIconName, LucideIcon> = {
  MessagesSquare,
  PenTool,
  FileCheck2,
  HardHat,
  KeyRound,
};

/** Heading fade-up. */
const headingVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Individual step fade-up — staggered via the parent container. */
const stepVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

/** The connector line drawing itself across the timeline. */
const lineVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 1.3, ease: [0.22, 1, 0.36, 1], delay: 0.2 },
  },
};

/** The vertical connector line on small screens. */
const lineVariantsVertical: Variants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: 1.3, ease: [0.22, 1, 0.36, 1], delay: 0.2 },
  },
};

export default function Process() {
  return (
    <section
      id="process"
      className="relative w-full scroll-mt-24 bg-charcoal py-24 sm:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* --- Section heading ------------------------------------------- */}
        <motion.div
          variants={headingVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">
            Our Process
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            How We Work
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/55">
            Five clear stages, no surprises. You always know what is happening,
            what it costs and what comes next.
          </p>
        </motion.div>

        {/* =================================================================
            MOBILE — vertical timeline, line down the left.
            ================================================================= */}
        <motion.ol
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="relative mt-16 space-y-10 lg:hidden"
        >
          {/* Vertical gold line — draws itself downwards */}
          <motion.span
            variants={lineVariantsVertical}
            aria-hidden="true"
            className="absolute left-6 top-6 h-[calc(100%-4rem)] w-0.5 origin-top bg-gradient-to-b from-gold via-gold/70 to-gold/20"
          />

          {processSteps.map((step, index) => {
            const Icon = stepIcons[step.icon];

            return (
              <motion.li key={step.id} variants={stepVariants} className="relative">
                <div className="flex gap-5">
                  {/* Numbered gold circle */}
                  <span className="group relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-gold bg-charcoal text-gold transition-colors duration-500 group-hover:bg-gold group-hover:text-charcoal">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-charcoal">
                      {index + 1}
                    </span>
                  </span>

                  {/* Text */}
                  <div className="pb-2 pt-1">
                    <h3 className="font-display text-xl font-semibold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/55">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </motion.ol>

        {/* =================================================================
            DESKTOP — horizontal timeline, line connecting the circles.
            ================================================================= */}
        <div className="relative mt-16 hidden lg:block">
          {/* Horizontal gold line — draws itself left to right */}
          <motion.span
            variants={lineVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            aria-hidden="true"
            className="absolute inset-x-0 top-8 h-px origin-left bg-gradient-to-r from-gold via-gold/80 to-gold/30"
          />

          <motion.ol
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="relative grid grid-cols-5 gap-6"
          >
            {processSteps.map((step, index) => {
              const Icon = stepIcons[step.icon];

              return (
                <motion.li
                  key={step.id}
                  variants={stepVariants}
                  className="flex flex-col items-center text-center"
                >
                  {/* Numbered gold circle */}
                  <span className="group relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold bg-charcoal text-gold transition-all duration-500 group-hover:bg-gold group-hover:text-charcoal">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                    <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-charcoal">
                      {index + 1}
                    </span>
                  </span>

                  {/* Text */}
                  <h3 className="mt-7 font-display text-xl font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/55">
                    {step.description}
                  </p>
                </motion.li>
              );
            })}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}
