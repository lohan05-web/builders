"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { track } from "@vercel/analytics";

/**
 * Fade-up entrance for the hero copy.
 * Children are staggered by `staggerChildren`.
 */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Unsplash photo of a construction site — optimised by next/image. */
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=2400&q=80";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen w-full items-center overflow-hidden"
    >
      {/* --- Background image ------------------------------------------- */}
      <Image
        src={HERO_IMAGE}
        alt="Construction site with builders working on a new structure"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* --- Dark overlay for readability ------------------------------- */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-charcoal/80"
      />
      {/* Extra left-weighted gradient so the headline always pops */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/70 to-charcoal/30"
      />
      {/* Subtle vignette to frame the composition */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-charcoal/60"
      />

      {/* --- Content ----------------------------------------------------- */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-28 pt-36 sm:px-8 lg:px-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          // Stagger the individual blocks of copy.
          className="max-w-3xl"
        >
          {/* Eyebrow */}
          <motion.div
            variants={fadeUp}
            className="mb-7 flex items-center gap-4"
          >
            <span aria-hidden="true" className="h-px w-12 bg-gold" />
            <span className="text-xs font-medium uppercase tracking-widest text-gold">
              Residential &amp; Commercial Construction
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeUp}
            className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Building Your Dream,{" "}
            <span className="text-gold">Brick by Brick</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={fadeUp}
            className="mt-7 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg"
          >
            We deliver quality construction and trusted craftsmanship on every
            project — from the first sketch to the final handover.
          </motion.p>

          {/* Buttons */}
          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <Link
              href="/#contact"
              onClick={() => track("get_quote_click", { location: "hero" })}
              className="group inline-flex items-center justify-center gap-2 rounded-sm bg-gold px-8 py-4 text-sm font-semibold tracking-wide text-charcoal transition-all duration-300 ease-smooth hover:bg-gold-light hover:shadow-xl hover:shadow-gold/25"
            >
              Get a Quote
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>

            <Link
              href="/#projects"
              className="inline-flex items-center justify-center rounded-sm border border-white/30 px-8 py-4 text-sm font-semibold tracking-wide text-white transition-all duration-300 ease-smooth hover:border-gold hover:bg-gold/10 hover:text-gold"
            >
              View Projects
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* --- Scroll-down indicator ---------------------------------------- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <Link
          href="/#services"
          aria-label="Scroll to next section"
          className="group flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-widest text-white/40 transition-colors duration-300 group-hover:text-gold">
            Scroll
          </span>
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-gold transition-colors duration-300 group-hover:border-gold"
          >
            <ArrowDown className="h-4 w-4" aria-hidden="true" />
          </motion.span>
        </Link>
      </motion.div>
    </section>
  );
}
