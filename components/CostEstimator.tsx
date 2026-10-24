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
            Cost Estimator
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Estimate Your Project Cost
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
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
          className="mt-10 grid gap-6 lg:mt-16 lg:grid-cols-5 lg:gap-8"
        >
          {/* ----- Inputs ------------------------------------------------ */}
          <div className="lg:col-span-3">
            <div className="rounded-sm border border-white/10 bg-navy-light/60 p-5 sm:p-7 lg:p-8">
              {/* Area */}
              <div>
                <label
                  htmlFor="estimator-area"
                  className="text-xs font-semibold uppercase tracking-widest text-orange"
                >
                  Built-up Area (sq.ft)
                </label>
                <div className="relative mt-3">
                  <input
                    id="estimator-area"
                    type="number"
                    inputMode="numeric"
                    min={estimatorConfig.minArea}
                    max={estimatorConfig.maxArea}
                    step={50}
                    value={areaText}
                    onChange={(event) => setAreaText(event.target.value)}
                    aria-describedby="estimator-area-help"
                    className="w-full rounded-sm border border-white/15 bg-navy px-4 py-3 text-lg text-white outline-none transition-colors duration-200 focus:border-orange focus:ring-2 focus:ring-orange/40 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none sm:py-4 sm:text-2xl"
                  />
                  <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-sm text-white/40">
                    sq.ft
                  </span>
                </div>
                <p
                  id="estimator-area-help"
                  className={[
                    "mt-2 text-xs",
                    isClamped ? "text-orange" : "text-white/55",
                  ].join(" ")}
                >
                  {isClamped
                    ? `We have adjusted this to the allowed range of ${estimatorConfig.minArea.toLocaleString("en-IN")} - ${estimatorConfig.maxArea.toLocaleString("en-IN")} sq.ft.`
                    : `Between ${estimatorConfig.minArea.toLocaleString("en-IN")} and ${estimatorConfig.maxArea.toLocaleString("en-IN")} sq.ft.`}
                </p>
              </div>

              {/* Project type */}
              <div className="mt-8 sm:mt-10">
                <p className="text-xs font-semibold uppercase tracking-widest text-orange">
                  Project Type
                </p>
                <div
                  role="group"
                  aria-label="Project type"
                  className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4"
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
                          "min-h-[44px] rounded-sm border px-3 py-3 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange",
                          isActive
                            ? "border-orange bg-orange/10 text-white"
                            : "border-white/15 text-white/80 hover:border-orange/60 hover:text-white",
                        ].join(" ")}
                      >
                        <span className="block text-sm font-semibold">
                          {option.label}
                        </span>
                        <span className="mt-1 block text-[11px] leading-snug text-white/55">
                          {option.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Finish level */}
              <div className="mt-8 sm:mt-10">
                <p className="text-xs font-semibold uppercase tracking-widest text-orange">
                  Finish Level
                </p>
                <div
                  role="group"
                  aria-label="Finish level"
                  className="mt-3 grid gap-2 sm:grid-cols-3"
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
                          "group relative min-h-[44px] rounded-sm border p-4 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange",
                          isActive
                            ? "border-orange bg-orange/10"
                            : "border-white/15 hover:border-orange/60",
                        ].join(" ")}
                      >
                        {/* Selected tick */}
                        {isActive && (
                          <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-orange text-white">
                            <Check className="h-3 w-3" aria-hidden="true" />
                          </span>
                        )}

                        <span
                          className={[
                            "block font-display text-lg font-semibold",
                            isActive ? "text-orange" : "text-white",
                          ].join(" ")}
                        >
                          {option.label}
                        </span>
                        <span className="mt-1 block pr-6 text-xs leading-relaxed text-white/60">
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
            <div className="rounded-sm border border-orange/40 bg-navy-light/70">
              {/* Header */}
              <div className="flex items-center gap-3 border-b border-white/10 bg-orange/10 px-5 py-4 sm:px-6">
                <Calculator className="h-5 w-5 text-orange" aria-hidden="true" />
                <p className="text-xs font-semibold uppercase tracking-widest text-orange">
                  Estimated Cost
                </p>
              </div>

              <div className="px-5 py-6 sm:px-6 sm:py-8">
                {/* The range */}
                <p
                  aria-live="polite"
                  className="font-display text-2xl font-bold leading-tight text-white sm:text-3xl"
                >
                  {formatINR(display.min)} - {formatINR(display.max)}
                </p>
                <p className="mt-2 text-xs uppercase tracking-widest text-orange/80">
                  Approximate estimate — not a final quote
                </p>

                {/* Breakdown */}
                <dl className="mt-6 space-y-3 border-t border-white/10 pt-6 text-sm sm:mt-8">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-white/60">Area</dt>
                    <dd className="font-medium text-white">
                      {area.toLocaleString("en-IN")} sq.ft
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-white/60">Project type</dt>
                    <dd className="font-medium text-white">{projectType}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-white/60">Finish level</dt>
                    <dd className="font-medium text-white">{finishLevel}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-white/60">Rate per sq.ft</dt>
                    <dd className="font-medium text-orange">
                      {formatINR(estimate.rate)}
                    </dd>
                  </div>
                </dl>

                {/* Disclaimer */}
                <p className="mt-6 flex items-start gap-2.5 border-t border-white/10 pt-6 text-xs leading-relaxed text-white/60 sm:mt-8">
                  <ShieldCheck
                    className="mt-0.5 h-4 w-4 shrink-0 text-orange"
                    aria-hidden="true"
                  />
                  This is an approximate estimate, not a final quote. Final cost
                  depends on site conditions, approvals and material choices.
                </p>

                {/* CTA */}
                <a
                  href="/#contact"
                  onClick={handleQuoteClick}
                  className="group mt-6 flex w-full min-h-[44px] items-center justify-center gap-2 rounded-sm bg-orange px-6 py-4 text-sm font-semibold tracking-wide text-white transition-all duration-200 hover:bg-orange-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Get Exact Quote
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
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
