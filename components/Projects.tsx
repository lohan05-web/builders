"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Expand, MapPin, X } from "lucide-react";
import { track } from "@vercel/analytics";
import {
  formatArea,
  projects as fallbackProjects,
  type Project,
  type ProjectCategory,
} from "@/data/projects";

/** Filter tab definitions — "All" shows every project. */
const filters: { label: string; value: ProjectCategory | "All" }[] = [
  { label: "All", value: "All" },
  { label: "Residential", value: "Residential" },
  { label: "Commercial", value: "Commercial" },
  { label: "Interiors", value: "Interiors" },
  { label: "Renovation", value: "Renovation" },
];

/** Shared easing curve for every animation on this page. */
const EASE = [0.22, 1, 0.36, 1] as const;

interface ProjectsProps {
  /**
   * The projects shown in the grid.
   *
   * Resolved on the server (from Sanity, falling back to the local data)
   * and handed down as a prop.
   */
  projects: Project[];
}

export default function Projects({ projects }: ProjectsProps) {
  // Never render an empty grid — fall back to the local projects.
  const items = projects.length > 0 ? projects : fallbackProjects;

  /** Currently selected filter tab. */
  const [activeFilter, setActiveFilter] = useState<ProjectCategory | "All">(
    "All",
  );
  /** Index of the project shown in the lightbox (`null` = closed). */
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // --- Filtering ----------------------------------------------------------
  const filteredProjects = useMemo(
    () =>
      activeFilter === "All"
        ? items
        : items.filter((project) => project.category === activeFilter),
    [activeFilter, items],
  );

  /** Switching tabs closes any open lightbox so the index stays valid. */
  const handleFilterChange = (value: ProjectCategory | "All") => {
    setActiveFilter(value);
    setLightboxIndex(null);
  };

  // --- Lightbox navigation ------------------------------------------------
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const showNext = useCallback(() => {
    setLightboxIndex((index) =>
      index === null ? null : (index + 1) % filteredProjects.length,
    );
  }, [filteredProjects.length]);

  const showPrev = useCallback(() => {
    setLightboxIndex((index) =>
      index === null
        ? null
        : (index - 1 + filteredProjects.length) % filteredProjects.length,
    );
  }, [filteredProjects.length]);

  /** The project currently displayed in the lightbox. */
  const activeProject: Project | null =
    lightboxIndex !== null ? (filteredProjects[lightboxIndex] ?? null) : null;

  // --- Keyboard controls (Esc / arrows) while the lightbox is open -------
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowRight") showNext();
      if (event.key === "ArrowLeft") showPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, closeLightbox, showNext, showPrev]);

  // --- Lock page scrolling while the lightbox is open ---------------------
  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxIndex]);

  return (
    <section
      id="projects"
      className="relative w-full scroll-mt-24 bg-charcoal py-24 sm:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* --- Section heading ------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">
            Our Work
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Our Projects
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/55">
            A selection of homes, workplaces and restorations we have delivered
            for clients across the country.
          </p>
        </motion.div>

        {/* --- Filter tabs ------------------------------------------------ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="mt-12 flex flex-wrap items-center justify-center gap-3"
          role="tablist"
          aria-label="Filter projects by category"
        >
          {filters.map((filter) => {
            const isActive = activeFilter === filter.value;

            return (
              <button
                key={filter.value}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleFilterChange(filter.value)}
                className={[
                  "rounded-sm border px-6 py-2.5 text-sm font-medium tracking-wide",
                  "transition-all duration-300 ease-smooth",
                  isActive
                    ? "border-gold bg-gold text-charcoal shadow-lg shadow-gold/20"
                    : "border-white/20 text-white/70 hover:border-gold/60 hover:text-gold",
                ].join(" ")}
              >
                {filter.label}
              </button>
            );
          })}
        </motion.div>

        {/* --- Project grid ------------------------------------------------ */}
        <motion.ul
          layout
          className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.li
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="h-full"
              >
                <button
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  aria-label={`Open ${project.title}`}
                  className="group relative block h-full w-full overflow-hidden rounded-sm border border-white/10 text-left transition-colors duration-500 hover:border-gold/40"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    {/* Project photo */}
                    <Image
                      src={project.image}
                      alt={project.imageAlt || project.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
                    />

                    {/*
                      Dark overlay. Hidden on pointer devices until hover,
                      always visible on touch devices (where hover is impossible).
                    */}
                    <div
                      className={[
                        "absolute inset-0 flex flex-col justify-end p-6",
                        "bg-gradient-to-t from-charcoal via-charcoal/75 to-transparent",
                        "opacity-100 md:opacity-0 md:transition-opacity md:duration-500",
                        "md:group-hover:opacity-100",
                      ].join(" ")}
                    >
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-gold">
                        {project.category}
                      </span>
                      <h3 className="mt-2 font-display text-xl font-semibold text-white">
                        {project.title}
                      </h3>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-white/70">
                        <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                        {project.location}
                      </p>
                    </div>

                    {/* Expand affordance */}
                    <span
                      aria-hidden="true"
                      className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-charcoal/50 text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    >
                      <Expand className="h-4 w-4" />
                    </span>
                  </div>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>

      {/* =====================================================================
          LIGHTBOX — built with Framer Motion only, no extra libraries.
          ===================================================================== */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            // Clicking anywhere outside the panel closes the lightbox.
            onClick={closeLightbox}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-10"
          >
            {/* Backdrop */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={activeProject.title}
              onClick={(event) => event.stopPropagation()}
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 24 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="relative z-10 flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-sm border border-white/10 bg-charcoal-800 shadow-2xl"
            >
              {/* --- Image area ------------------------------------------- */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-charcoal-900 sm:aspect-[16/8]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeProject.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={activeProject.image}
                      alt={activeProject.imageAlt || activeProject.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 1024px"
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Prev / Next */}
                <button
                  type="button"
                  onClick={showPrev}
                  aria-label="Previous project"
                  className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-charcoal/70 text-white backdrop-blur transition-colors duration-300 hover:border-gold hover:text-gold sm:left-5"
                >
                  <ArrowLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  aria-label="Next project"
                  className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-charcoal/70 text-white backdrop-blur transition-colors duration-300 hover:border-gold hover:text-gold sm:right-5"
                >
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </button>

                {/* Close */}
                <button
                  type="button"
                  onClick={closeLightbox}
                  aria-label="Close lightbox"
                  className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-charcoal/70 text-white backdrop-blur transition-colors duration-300 hover:border-gold hover:text-gold sm:right-5 sm:top-5"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              {/* --- Details ------------------------------------------------ */}
              <div className="flex flex-col gap-5 p-6 sm:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-gold">
                      {activeProject.category}
                    </span>
                    <h3 className="mt-2 font-display text-2xl font-semibold text-white sm:text-3xl">
                      {activeProject.title}
                    </h3>
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-white/60">
                      <MapPin className="h-4 w-4" aria-hidden="true" />
                      {activeProject.location}
                    </p>
                  </div>

                  {/* Meta row */}
                  <dl className="flex gap-8 sm:gap-10">
                    <div>
                      <dt className="text-[10px] uppercase tracking-widest text-white/40">
                        Area
                      </dt>
                      <dd className="mt-1 font-display text-lg text-white">
                        {formatArea(activeProject.area)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] uppercase tracking-widest text-white/40">
                        Year
                      </dt>
                      <dd className="mt-1 font-display text-lg text-white">
                        {activeProject.year}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Link to the full project page */}
                <Link
                  href={`/projects/${activeProject.slug}`}
                  onClick={() => track("project_view_details", {
                    slug: activeProject.slug,
                  })}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-sm border border-gold/60 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-gold transition-colors duration-300 hover:bg-gold hover:text-charcoal sm:w-auto"
                >
                  View Full Details
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
