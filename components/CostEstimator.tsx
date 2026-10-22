"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { animate, motion } from "framer-motion";
import { ArrowRight, Calculator, Check, ShieldCheck } from "lucide-react";
import { track } from "@vercel/analytics";
import {
  calculateEstimate,
  clampArea,
  estimatorConfig,
  finishLevels,
  formatINR,
  projectTypes,
  type FinishLevel,
  type ProjectType,
} from "@/data/estimator";

/** How long the result numbers take to animate to their new value. */
const TRANSITION_DURATION = 0.6;

export default function CostEstimator() {
  // --- Input state --------------------------------------------------------
  /** Raw text of the area field (kept as a string so it can be cleared). */
  const [areaText, setAreaText] = useState(String(estimatorConfig.defaultArea));
  const [projectType, setProjectType] = useState<ProjectType>("Residential");
  const [finishLevel, setFinishLevel] = useState<FinishLevel>("Standard");

  /**
   * Safe numeric area. Anything blank, negative or unparseable falls back
   * to a valid value so the estimator can never crash.
   */
  const parsedArea = Number.parseInt(areaText, 10);
  const area = clampArea(
    Number.isFinite(parsedArea) ? parsedArea : estimatorConfig.defaultArea,
  );

  /** True when the typed value was clamped (too small / too large). */
  const isClamped =
    Number.isFinite(parsedArea) &&
    parsedArea > 0 &&
    (parsedArea < estimatorConfig.minArea || parsedArea > estimatorConfig.maxArea);

  // --- Estimate -----------------------------------------------------------
  const estimate = useMemo(
    () => calculateEstimate(area, projectType, finishLevel),
    [area, projectType, finishLevel],
  );

  // --- Smooth number transition -------------------------------------------
  /** The numbers currently on screen. */
  const [display, setDisplay] = useState({ min: estimate.min, max: estimate.max });
  /** Latest animated values, so an interrupted transition resumes smoothly. */
  const currentRef = useRef({ min: estimate.min, max: estimate.max });

  useEffect(() => {
    const from = currentRef.current;

    const controls = animate(0, 1, {
      duration: TRANSITION_DURATION,
      ease: "easeOut",
      onUpdate: (t) => {
        const min = Math.round(from.min + (estimate.min - from.min) * t);
        const max = Math.round(from.max + (estimate.max - from.max) * t);
        currentRef.current = { min, max };
        setDisplay({ min, max });
      },
    });

    return () => controls.stop();
  }, [estimate.min, estimate.max]);

  // --- Scroll to the contact section for the CTA --------------------------
  const handleQuoteClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    track("get_quote_click", { location: "estimator" });

    const contact = document.getElementById("contact");
    // The contact section does not exist yet - fall back to the plain link.
    if (!contact) return;

    event.preventDefault();
    contact.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="estimator"
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
            Cost Estimator
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Estimate Your Project Cost
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/55">
            Get a realistic ballpark in seconds — pick your area, project type
            and finish level, and see the expected range.
          </p>
        </motion.div>

        {/* --- Estimator body --------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-16 grid gap-8 lg:grid-cols-5"
        >
          {/* ----- Inputs ------------------------------------------------ */}
          <div className="lg:col-span-3">
            <div className="rounded-sm border border-white/10 bg-charcoal-800/40 p-6 sm:p-8">
              {/* Area */}
              <div>
                <label
                  htmlFor="estimator-area"
                  className="text-xs font-semibold uppercase tracking-widest text-gold"
                >
                  Built-up Area (sq.ft)
                </label>
                <div className="relative mt-4">
                  <input
                    id="estimator-area"
                    type="number"
                    inputMode="numeric"
                    min={estimatorConfig.minArea}
                    max={estimatorConfig.maxArea}
                    step={50}
                    value={areaText}
                    onChange={(event) => setAreaText(event.target.value)}
                    className="w-full rounded-sm border border-white/15 bg-charcoal-900 px-5 py-4 font-display text-2xl text-white outline-none transition-colors duration-300 focus:border-gold [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-sm text-white/40">
                    sq.ft
                  </span>
                </div>
                <p
                  className={[
                    "mt-2 text-xs",
                    isClamped ? "text-gold" : "text-white/40",
                  ].join(" ")}
                >
                  {isClamped
                    ? `We have adjusted this to the allowed range of ${estimatorConfig.minArea.toLocaleString("en-IN")} - ${estimatorConfig.maxArea.toLocaleString("en-IN")} sq.ft.`
                    : `Between ${estimatorConfig.minArea.toLocaleString("en-IN")} and ${estimatorConfig.maxArea.toLocaleString("en-IN")} sq.ft.`}
                </p>
              </div>

              {/* Project type */}
              <div className="mt-10">
                <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                  Project Type
                </p>
                <div
                  role="group"
                  aria-label="Project type"
                  className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4"
                >
                  {projectTypes.map((option) => {
                    const isActive = projectType === option.id;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => setProjectType(option.id)}
                        className={[
                          "rounded-sm border px-4 py-4 text-left transition-all duration-300 ease-smooth",
                          isActive
                            ? "border-gold bg-gold/10 text-white"
                            : "border-white/15 text-white/70 hover:border-gold/50 hover:text-white",
                        ].join(" ")}
                      >
                        <span className="block text-sm font-semibold">
                          {option.label}
                        </span>
                        <span className="mt-1 block text-[11px] leading-snug text-white/45">
                          {option.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Finish level */}
              <div className="mt-10">
                <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                  Finish Level
                </p>
                <div
                  role="group"
                  aria-label="Finish level"
                  className="mt-4 grid gap-3 sm:grid-cols-3"
                >
                  {finishLevels.map((option) => {
                    const isActive = finishLevel === option.id;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => setFinishLevel(option.id)}
                        className={[
                          "group relative rounded-sm border p-5 text-left transition-all duration-300 ease-smooth",
                          isActive
                            ? "border-gold bg-gold/10 shadow-lg shadow-gold/10"
                            : "border-white/15 hover:border-gold/50",
                        ].join(" ")}
                      >
                        {/* Selected tick */}
                        {isActive && (
                          <span className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-charcoal">
                            <Check className="h-3 w-3" aria-hidden="true" />
                          </span>
                        )}

                        <span
                          className={[
                            "block font-display text-lg font-semibold",
                            isActive ? "text-gold" : "text-white",
                          ].join(" ")}
                        >
                          {option.label}
                        </span>
                        <span className="mt-2 block pr-6 text-xs leading-relaxed text-white/50">
                          {option.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ----- Result panel ------------------------------------------ */}
          <div className="lg:col-span-2">
            <div className="sticky top-28 overflow-hidden rounded-sm border border-gold/25 bg-charcoal-800/70">
              {/* Gold header */}
              <div className="flex items-center gap-3 border-b border-white/10 bg-gold/10 px-6 py-5">
                <Calculator className="h-5 w-5 text-gold" aria-hidden="true" />
                <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                  Estimated Cost
                </p>
              </div>

              <div className="px-6 py-8">
                {/* The range */}
                <p
                  aria-live="polite"
                  className="font-display text-2xl font-bold leading-tight text-white sm:text-3xl"
                >
                  {formatINR(display.min)} - {formatINR(display.max)}
                </p>

                {/* Breakdown */}
                <dl className="mt-8 space-y-4 border-t border-white/10 pt-6 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-white/45">Area</dt>
                    <dd className="font-medium text-white">
                      {area.toLocaleString("en-IN")} sq.ft
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-white/45">Project type</dt>
                    <dd className="font-medium text-white">{projectType}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-white/45">Finish level</dt>
                    <dd className="font-medium text-white">{finishLevel}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-white/45">Rate per sq.ft</dt>
                    <dd className="font-medium text-gold">
                      {formatINR(estimate.rate)}
                    </dd>
                  </div>
                </dl>

                {/* Disclaimer */}
                <p className="mt-8 flex items-start gap-2.5 border-t border-white/10 pt-6 text-xs leading-relaxed text-white/40">
                  <ShieldCheck
                    className="mt-0.5 h-4 w-4 shrink-0 text-gold/70"
                    aria-hidden="true"
                  />
                  This is an approximate estimate. Final cost depends on site
                  conditions and material choices.
                </p>

                {/* CTA */}
                <a
                  href="/#contact"
                  onClick={handleQuoteClick}
                  className="group mt-6 flex w-full items-center justify-center gap-2 rounded-sm bg-gold px-6 py-4 text-sm font-semibold tracking-wide text-charcoal transition-all duration-300 ease-smooth hover:bg-gold-light hover:shadow-lg hover:shadow-gold/25"
                >
                  Get Exact Quote
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
