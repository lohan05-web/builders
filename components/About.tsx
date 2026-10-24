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
  team as fallbackTeam,
  trustBadges,
  type TeamMember,
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

interface AboutProps {
  team?: TeamMember[];
}

export default function About({ team = [] }: AboutProps) {
  // Never render an empty team row — fall back to the local team.
  const members = team.length > 0 ? team : fallbackTeam;

  return (
    <section
      id="about"
      className="relative w-full scroll-mt-20 bg-navy-light/40 py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* --- Section heading ------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-orange">
            Who We Are
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            About LM Builders
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
            Ten years of building homes and workplaces that people are proud to
            put their name on.
          </p>
        </motion.div>

        {/* --- Story + image ---------------------------------------------- */}
        <div className="mt-10 grid items-start gap-8 lg:mt-16 lg:grid-cols-2 lg:gap-12">
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
                className="text-sm leading-relaxed text-white/75 sm:text-base"
              >
                {paragraph}
              </p>
            ))}

            {/* Founder message */}
            <div className="mt-8 flex flex-col gap-4 rounded-sm border border-white/10 bg-navy-light/60 p-5 sm:mt-10 sm:flex-row sm:items-start sm:gap-5 sm:p-6">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-orange sm:h-20 sm:w-20">
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
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-orange">
                  {founder.role}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-white/75 sm:mt-4">
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
            {/* Offset accent frame */}
            <div
              aria-hidden="true"
              className="absolute -bottom-5 -right-5 hidden h-full w-full border border-orange/40 sm:block"
            />

            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm sm:aspect-[4/3] lg:aspect-[4/5]">
              <Image
                src={aboutImage}
                alt="LM Builders crew working on a live construction site"
                fill
                sizes="(max-width: 1023px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>

        {/* --- Team ------------------------------------------------------- */}
        <div className="mt-14 lg:mt-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-2xl text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-orange">
              The Team
            </p>
            <h3 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
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
            className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8"
          >
            {members.map((member) => (
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
                <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full border-2 border-white/15 transition-all duration-300 ease-smooth group-hover:border-orange group-hover:shadow-lg group-hover:shadow-black/20 sm:h-28 sm:w-28 lg:h-32 lg:w-32">
                  <Image
                    src={member.photo}
                    alt={member.photoAlt || member.name}
                    fill
                    sizes="(max-width: 639px) 28vw, 128px"
                    className="object-cover"
                  />
                </div>
                <h4 className="mt-4 font-display text-lg font-semibold text-white">
                  {member.name}
                </h4>
                <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-widest text-orange/80">
                  {member.role}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* --- Trust badges ---------------------------------------------- */}
        <div className="mt-14 lg:mt-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-2xl text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-orange">
              Certifications &amp; Partners
            </p>
            <h3 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
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
            className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4"
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
                  className="flex flex-col gap-3 rounded-sm border border-white/10 bg-navy-light/60 p-4 transition-colors duration-200 hover:border-orange/60 sm:flex-row sm:items-center sm:gap-4 sm:p-5"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-orange/60 text-orange">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-base font-semibold leading-tight text-white">
                      {badge.title}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-white/65">
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
