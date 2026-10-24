"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, MapPin, X } from "lucide-react";
import { track } from "@vercel/analytics";
import {
  formatArea,
  projects as fallbackProjects,
  type Project,
  type ProjectCategory,
} from "@/data/projects";

const EASE = [0.22, 1, 0.36, 1] as const;
const PANEL_ID = "project-grid-panel";

/** Fixed order keeps the tabs stable even if a category is temporarily empty. */
const CATEGORY_ORDER: ProjectCategory[] = [
  "Residential",
  "Commercial",
  "Interiors",
  "Renovation",
];

interface ProjectsProps {
  projects?: Project[];
}

export default function Projects({ projects }: ProjectsProps) {
  const items = projects && projects.length > 0 ? projects : fallbackProjects;
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const filters = useMemo(
    () => [
      { label: "All", value: "All" as const },
      ...CATEGORY_ORDER.map((category) => ({
        label: category,
        value: category,
      })),
    ],
    [],
  );

  const [activeFilter, setActiveFilter] = useState<ProjectCategory | "All">(
    "All",
  );
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredProjects = useMemo(
    () =>
      activeFilter === "All"
        ? items
        : items.filter((project) => project.category === activeFilter),
    [activeFilter, items],
  );

  const activeTabId = `project-tab-${activeFilter.toLowerCase()}`;

  const handleFilterChange = (value: ProjectCategory | "All") => {
    setActiveFilter(value);
    setLightboxIndex(null);
  };

  const handleTabKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number | null = null;

    switch (event.key) {
      case "ArrowRight":
        nextIndex = (index + 1) % filters.length;
        break;
      case "ArrowLeft":
        nextIndex = (index - 1 + filters.length) % filters.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = filters.length - 1;
        break;
      default:
        break;
    }

    if (nextIndex === null) return;

    event.preventDefault();
    handleFilterChange(filters[nextIndex].value);
    tabRefs.current[nextIndex]?.focus();
  };

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

  const activeProject: Project | null =
    lightboxIndex !== null ? (filteredProjects[lightboxIndex] ?? null) : null;

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

  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxIndex]);

  return (
    <section
      id="projects"
      className="relative w-full scroll-mt-20 bg-warm-white py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-orange">
            Projects
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-text-dark sm:text-4xl lg:text-5xl">
            Our Work
          </h2>
        </div>

        <div
          className="mt-8 flex flex-wrap items-center gap-2"
          role="tablist"
          aria-label="Filter projects by category"
        >
          {filters.map((filter, index) => {
            const isActive = activeFilter === filter.value;
            const tabId = `project-tab-${filter.value.toLowerCase()}`;

            return (
              <button
                key={filter.value}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                id={tabId}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={PANEL_ID}
                tabIndex={isActive ? 0 : -1}
                onClick={() => handleFilterChange(filter.value)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
                className={[
                  "min-h-[44px] rounded-sm px-4 py-2 text-sm font-semibold transition-colors duration-200",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 focus-visible:ring-offset-warm-white",
                  isActive
                    ? "bg-orange text-white"
                    : "border border-navy/10 bg-white text-text-dark hover:border-orange/60 hover:text-orange",
                ].join(" ")}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {filteredProjects.length === 0 ? (
            <motion.div
              key={`${activeFilter}-empty`}
              id={PANEL_ID}
              role="tabpanel"
              aria-labelledby={activeTabId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="mt-10 border border-dashed border-navy/20 bg-white px-6 py-12 text-center"
            >
              <p className="font-display text-xl font-bold text-text-dark">
                No projects in this category yet
              </p>
              <p className="mt-2 text-sm text-text-dark/65">
                Choose another category to explore the rest of our work.
              </p>
            </motion.div>
          ) : (
            <motion.ul
              key={activeFilter}
              id={PANEL_ID}
              role="tabpanel"
              aria-labelledby={activeTabId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
            >
              {filteredProjects.map((project, index) => (
                <li key={project.id} className="h-full">
                  <article className="group relative h-full overflow-hidden border border-navy/10 bg-white transition-all duration-300 ease-smooth hover:border-orange/60 hover:shadow-xl hover:shadow-navy/10">
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-navy/5">
                      <Image
                        src={project.image}
                        alt={project.imageAlt || project.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-105"
                      />

                      {/* Single caption: always visible on mobile, revealed on hover at md+. */}
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-navy via-navy/45 to-transparent opacity-100 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
                      />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 sm:p-5">
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-orange">
                          {project.category}
                        </span>
                        <h3 className="mt-1 line-clamp-2 font-display text-lg font-bold leading-tight text-white">
                          {project.title}
                        </h3>
                        <p className="mt-1 flex items-center gap-1.5 text-sm text-white/75">
                          <MapPin
                            className="h-3.5 w-3.5 shrink-0"
                            aria-hidden="true"
                          />
                          <span className="truncate">{project.location}</span>
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setLightboxIndex(index)}
                        aria-label={`Open ${project.title}`}
                        className="absolute inset-0 z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-inset"
                      />
                    </div>
                  </article>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
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
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 lg:p-10"
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
              aria-label={`${activeProject.title} preview`}
              onClick={(event) => event.stopPropagation()}
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 24 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="relative z-10 flex max-h-[92vh] w-full max-w-5xl flex-col overflow-y-auto border border-white/10 bg-navy-light shadow-2xl"
            >
              {/* --- Image area ------------------------------------------- */}
              <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-navy sm:aspect-[16/10]">
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
                      alt={
                        activeProject.imageAlt ||
                        `${activeProject.title}, ${activeProject.location}`
                      }
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
                  className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-navy/75 text-white backdrop-blur transition-colors duration-300 hover:border-orange hover:text-orange focus:outline-none focus-visible:ring-2 focus-visible:ring-orange sm:left-5"
                >
                  <ArrowLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  aria-label="Next project"
                  className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-navy/75 text-white backdrop-blur transition-colors duration-300 hover:border-orange hover:text-orange focus:outline-none focus-visible:ring-2 focus-visible:ring-orange sm:right-5"
                >
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </button>

                {/* Close */}
                <button
                  type="button"
                  onClick={closeLightbox}
                  aria-label="Close lightbox"
                  className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-navy/75 text-white backdrop-blur transition-colors duration-300 hover:border-orange hover:text-orange focus:outline-none focus-visible:ring-2 focus-visible:ring-orange sm:right-5 sm:top-5"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              {/* --- Details ------------------------------------------------ */}
              <div className="flex flex-col gap-5 p-5 sm:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-orange">
                      {activeProject.category}
                    </span>
                    <h3 className="mt-2 break-words font-display text-2xl font-bold text-white sm:text-3xl">
                      {activeProject.title}
                    </h3>
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-white/65">
                      <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span className="break-words">{activeProject.location}</span>
                    </p>
                  </div>

                  {/* Meta row */}
                  <dl className="flex flex-wrap gap-x-8 gap-y-3 sm:gap-10">
                    <div>
                      <dt className="text-[10px] uppercase tracking-widest text-white/45">
                        Area
                      </dt>
                      <dd className="mt-1 font-display text-lg text-white">
                        {formatArea(activeProject.area)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] uppercase tracking-widest text-white/45">
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
                  onClick={() =>
                    track("project_view_details", {
                      slug: activeProject.slug,
                    })
                  }
                  className="group inline-flex w-full items-center justify-center gap-2 border border-orange/60 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-orange transition-colors duration-300 hover:bg-orange hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 focus-visible:ring-offset-navy-light sm:w-auto"
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
