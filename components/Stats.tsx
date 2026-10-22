"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { stats } from "@/data/site";

/** How long the count-up tween runs, in seconds. */
const COUNT_DURATION = 1.8;

interface StatItemProps {
  /** The number the counter animates up to. */
  value: number;
  /** Static text rendered straight after the number (e.g. `+` or `L+`). */
  suffix: string;
  /** Small caption underneath the number. */
  label: string;
}

/**
 * A single statistic with a count-up animation.
 *
 * The counter starts at 0 and animates to `value` the first time the item
 * scrolls into view. `once: true` guarantees it only ever runs once.
 */
function StatItem({ value, suffix, label }: StatItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  // `once: true` -> the animation never replays on subsequent scrolls.
  const isInView = useInView(ref, { once: true, amount: 0.4 });

  // Raw animated number, plus a rounded version for display.
  const count = useMotionValue(0);
  const display = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (!isInView) return;

    // Honour the user's reduced-motion preference by skipping the tween.
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const controls = animate(count, value, {
      duration: prefersReducedMotion ? 0 : COUNT_DURATION,
      ease: "easeOut",
    });

    // Stop the animation if the component unmounts mid-flight.
    return () => controls.stop();
  }, [isInView, count, value]);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center px-4 py-10 text-center sm:py-12"
    >
      {/* Number + suffix */}
      <dt className="flex items-baseline">
        <motion.span className="font-display text-5xl font-bold leading-none text-gold sm:text-6xl lg:text-7xl">
          {display}
        </motion.span>
        <span className="font-display text-5xl font-bold leading-none text-gold sm:text-6xl lg:text-7xl">
          {suffix}
        </span>
      </dt>

      {/* Label */}
      <dd className="mt-4 text-[11px] font-medium uppercase tracking-widest text-white/55 sm:text-xs">
        {label}
      </dd>
    </div>
  );
}

export default function Stats() {
  return (
    <section
      aria-label="Company statistics"
      className="relative w-full border-t border-gold/40 bg-charcoal bg-gradient-to-b from-charcoal to-charcoal-800"
    >
      {/* Soft gold glow along the top edge for depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(201,162,75,0.10),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* 2 columns on mobile -> 4 columns on desktop */}
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.id}
              className={[
                // Hairline separators between columns (desktop only).
                "lg:border-l lg:border-white/10",
                index === 0 ? "lg:border-l-0" : "",
              ].join(" ")}
            >
              <StatItem
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
              />
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
