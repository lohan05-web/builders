"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";

interface ProjectGalleryProps {
  /** Unsplash image URLs. */
  images: string[];
  /** Project title — used for alt text and the lightbox label. */
  title: string;
}

/** Shared easing curve. */
const EASE = [0.22, 1, 0.36, 1] as const;

export default function ProjectGallery({ images, title }: ProjectGalleryProps) {
  /** Index of the image shown in the lightbox (`null` = closed). */
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const showNext = useCallback(() => {
    setLightboxIndex((index) =>
      index === null ? null : (index + 1) % images.length,
    );
  }, [images.length]);

  const showPrev = useCallback(() => {
    setLightboxIndex((index) =>
      index === null ? null : (index - 1 + images.length) % images.length,
    );
  }, [images.length]);

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

  const activeImage = lightboxIndex !== null ? images[lightboxIndex] : null;

  return (
    <>
      {/* --- Grid ----------------------------------------------------------- */}
      <ul className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
        {images.map((src, index) => (
          <li key={src}>
            <button
              type="button"
              onClick={() => setLightboxIndex(index)}
              aria-label={`Open image ${index + 1} of ${images.length}`}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-sm border border-white/10 transition-colors duration-500 hover:border-gold/40"
            >
              <Image
                src={src}
                alt={`${title} — image ${index + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
              />
              <span
                aria-hidden="true"
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-charcoal/60 text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              >
                <Expand className="h-3.5 w-3.5" />
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* --- Lightbox -------------------------------------------------------- */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            key="gallery-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
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
              aria-label={`${title} gallery`}
              onClick={(event) => event.stopPropagation()}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="relative z-10 flex w-full max-w-5xl flex-col overflow-hidden rounded-sm border border-white/10 bg-charcoal-800 shadow-2xl"
            >
              <div className="relative aspect-[16/10] w-full bg-charcoal-900">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={activeImage}
                      alt={`${title} — image ${(lightboxIndex ?? 0) + 1}`}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 1024px"
                      className="object-contain"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Prev / Next */}
                <button
                  type="button"
                  onClick={showPrev}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-charcoal/70 text-white backdrop-blur transition-colors duration-300 hover:border-gold hover:text-gold sm:left-5"
                >
                  <ArrowLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-charcoal/70 text-white backdrop-blur transition-colors duration-300 hover:border-gold hover:text-gold sm:right-5"
                >
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </button>

                {/* Close */}
                <button
                  type="button"
                  onClick={closeLightbox}
                  aria-label="Close gallery"
                  className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-charcoal/70 text-white backdrop-blur transition-colors duration-300 hover:border-gold hover:text-gold sm:right-5 sm:top-5"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              {/* Counter */}
              <p className="px-6 py-4 text-xs uppercase tracking-widest text-white/40">
                {title} — {(lightboxIndex ?? 0) + 1} / {images.length}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
