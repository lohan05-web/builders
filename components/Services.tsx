"use client";

import { motion, type Variants } from "framer-motion";
import {
  Armchair,
  Building2,
  ClipboardCheck,
  DraftingCompass,
  Home,
  PaintRoller,
  type LucideIcon,
} from "lucide-react";
import { services, type ServiceIconName } from "@/data/services";

/**
 * Maps each service's icon name to its lucide-react component.
 * Keeping the map here means `data/services.ts` stays free of JSX.
 */
const serviceIcons: Record<ServiceIconName, LucideIcon> = {
  Home,
  Building2,
  PaintRoller,
  Armchair,
  DraftingCompass,
  ClipboardCheck,
};

/** Parent container — staggers the cards as they come into view. */
const gridVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

/** Individual card fade-up. */
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Section heading fade-up. */
const headingVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Services() {
  return (
    <section
      id="services"
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
            What We Do
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Our Services
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/55">
            From the first blueprint to the final handover, we cover every
            stage of the build with the same uncompromising standard.
          </p>
        </motion.div>

        {/* --- Services grid --------------------------------------------- */}
        <motion.ul
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service) => {
            const Icon = serviceIcons[service.icon];

            return (
              <motion.li key={service.id} variants={cardVariants} className="h-full">
                {/*
                  The hover transform lives on this inner element so it does
                  not fight with the motion `y` transform on the <li>.
                */}
                <div
                  className={[
                    "group flex h-full flex-col rounded-sm border border-white/10",
                    "bg-charcoal-800/40 p-8",
                    "transition-all duration-500 ease-smooth",
                    "hover:-translate-y-2 hover:border-gold/50",
                    "hover:shadow-[0_25px_60px_-20px_rgba(201,162,75,0.45)]",
                  ].join(" ")}
                >
                  {/* Icon */}
                  <span
                    className={[
                      "flex h-14 w-14 items-center justify-center rounded-sm",
                      "border border-gold/30 bg-gold/10 text-gold",
                      "transition-all duration-500 ease-smooth",
                      "group-hover:border-gold group-hover:bg-gold group-hover:text-charcoal",
                    ].join(" ")}
                  >
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>

                  {/* Title */}
                  <h3 className="mt-6 font-display text-xl font-semibold text-white transition-colors duration-500 group-hover:text-gold">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 text-sm leading-relaxed text-white/55">
                    {service.description}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
