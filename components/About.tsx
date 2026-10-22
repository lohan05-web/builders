"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Award,
  BadgeCheck,
  Handshake,
  HardHat,
  KeyRound,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import {
  aboutImage,
  companyStory,
  founder,
  team,
  trustBadges,
  type TrustIconName,
} from "@/data/about";

/**
 * Maps each badge's icon name to its lucide-react component.
 * Keeping the map here means `data/about.ts` stays free of JSX.
 */
const badgeIcons: Record<TrustIconName, LucideIcon> = {
  BadgeCheck,
  Award,
  HardHat,
  ShieldCheck,
  Handshake,
  KeyRound,
};

export default function About() {
  return (
    <section
      id="about"
      className="relative w-full scroll-mt-24 bg-charcoal py-24 sm:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* --- Section heading ------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">
            Who We Are
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            About LM Builders
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/55">
            Ten years of building homes and workplaces that people are proud to
            put their name on.
          </p>
        </motion.div>

        {/* --- Story + image ---------------------------------------------- */}
        <div className="mt-16 grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — the story and the founder */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {companyStory.paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
                className="text-base leading-relaxed text-white/65"
              >
                {paragraph}
              </p>
            ))}

            {/* Founder message */}
            <div className="mt-10 flex flex-col gap-5 rounded-sm border border-white/10 bg-charcoal-800/40 p-6 sm:flex-row sm:items-start">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-gold">
                <Image
                  src={founder.photo}
                  alt={founder.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="font-display text-lg font-semibold text-white">
                  {founder.name}
                </p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-gold">
                  {founder.role}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-white/60">
                  {founder.message}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right — the site photo with a gold frame behind it */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            {/* Offset gold frame */}
            <div
              aria-hidden="true"
              className="absolute -bottom-6 -right-6 hidden h-full w-full border border-gold/40 sm:block"
            />

            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm sm:aspect-[4/3] lg:aspect-[4/5]">
              <Image
                src={aboutImage}
                alt="LM Builders crew on a live construction site"
                fill
                sizes="(max-width: 1023px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>

        {/* --- Team ------------------------------------------------------- */}
        <div className="mt-20 lg:mt-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-2xl text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-gold">
              The Team
            </p>
            <h3 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              The people on your site
            </h3>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12 } },
            }}
            className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4"
          >
            {team.map((member) => (
              <motion.div
                key={member.id}
                variants={{
                  hidden: { opacity: 0, y: 28 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                className="group text-center"
              >
                <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-full border-2 border-white/15 transition-all duration-500 ease-smooth group-hover:border-gold group-hover:shadow-lg group-hover:shadow-gold/15 sm:h-32 sm:w-32">
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    sizes="(max-width: 639px) 28vw, 128px"
                    className="object-cover"
                  />
                </div>
                <h4 className="mt-5 font-display text-lg font-semibold text-white">
                  {member.name}
                </h4>
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-gold/70">
                  {member.role}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* --- Trust badges ---------------------------------------------- */}
        <div className="mt-20 lg:mt-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-2xl text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-gold">
              Certifications &amp; Partners
            </p>
            <h3 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Licensed, certified and accountable
            </h3>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } },
            }}
            className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-5"
          >
            {trustBadges.map((badge) => {
              const Icon = badgeIcons[badge.icon];

              return (
                <motion.div
                  key={badge.id}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                    },
                  }}
                  className="flex flex-col gap-4 rounded-sm border border-white/10 bg-charcoal-800/40 p-5 transition-colors duration-300 hover:border-gold/40 sm:flex-row sm:items-center"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-base font-semibold leading-tight text-white">
                      {badge.title}
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-white/45">
                      {badge.label}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
