"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { animate, motion, useMotionValue } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import {
  testimonials as fallbackTestimonials,
  type Testimonial,
} from "@/data/testimonials";

/** Gap between cards in px — must match the `gap` used on the track. */
const CARD_GAP = 24;

/** How long a card stays on screen before the carousel auto-advances. */
const AUTO_SLIDE_MS = 5000;

/** Duration of a slide transition, in seconds. */
const SLIDE_DURATION = 0.55;

/** Shared easing for every carousel transition. */
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Fraction of a card the user has to drag before the gesture counts as a
 * swipe. Below this the carousel springs back to where it started.
 */
const SWIPE_THRESHOLD = 0.25;

/** How many cards are visible at a given viewport width. */
function visibleFor(width: number): number {
  if (width >= 1024) return 3;
  if (width >= 768) return 2;
  return 1;
}

interface TestimonialsProps {
  /**
   * The client testimonials shown in the carousel.
   *
   * Resolved on the server (from Sanity, falling back to the local data)
   * and handed down as a prop.
   */
  testimonials: Testimonial[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  // Never render an empty carousel — fall back to the local testimonials.
  const items = testimonials.length > 0 ? testimonials : fallbackTestimonials;
  const count = items.length;

  // --- Layout measurement -------------------------------------------------
  const viewportRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Track the viewport width so we can size the cards and the slide step.
  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0;
      setContainerWidth(width);
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  /** Number of cards on screen at the current width. */
  const visible = visibleFor(containerWidth);

  /** Width of a single card, in px. */
  const cardWidth = containerWidth
    ? (containerWidth - CARD_GAP * (visible - 1)) / visible
    : 0;

  /** Distance the track moves for each card, in px. */
  const step = cardWidth + CARD_GAP;

  // --- Carousel state -----------------------------------------------------
  /** Live horizontal offset of the track. */
  const x = useMotionValue(0);

  /** Current slot — may run negative or past the end so the loop can wrap. */
  const [position, setPosition] = useState(0);
  /** Mirror of `position` so callbacks always read the freshest value. */
  const positionRef = useRef(0);

  /** True while the pointer is dragging the track. */
  const isDragging = useRef(false);
  /** Pointer X where the current drag started. */
  const dragStartX = useRef(0);
  /** Track offset at the moment the drag started. */
  const dragBase = useRef(0);
  /** How far the pointer has moved during this drag. */
  const dragDelta = useRef(0);
  /** Controls for the running slide animation, so a drag can cancel it. */
  const slideControls = useRef<{ stop: () => void } | null>(null);

  /** Hover / focus state used to pause the auto-slide. */
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  /** Bumped on manual navigation so the auto-slide timer restarts. */
  const [tick, setTick] = useState(0);

  /**
   * Slide to a slot. When the carousel reaches either end of the rendered
   * strip we silently re-seat it on the equivalent slot — the copy of the
   * content looks identical, so the reset is invisible to the user.
   */
  const goTo = useCallback(
    (target: number) => {
      if (!step) return;

      positionRef.current = target;
      setPosition(target);

      slideControls.current = animate(x, -target * step, {
        duration: SLIDE_DURATION,
        ease: EASE,
        onComplete: () => {
          // Ignore the reset if the user moved on while we were animating.
          if (positionRef.current !== target) return;

          if (target === count) {
            // Same three cards, different copy — re-seat on slot 0.
            positionRef.current = 0;
            setPosition(0);
            x.set(0);
          } else if (target === -(count - 1)) {
            positionRef.current = 1;
            setPosition(1);
            x.set(-step);
          }
        },
      });
    },
    [count, step, x],
  );

  const next = useCallback(() => {
    goTo(Math.min(positionRef.current + 1, count));
    setTick((value) => value + 1);
  }, [count, goTo]);

  const prev = useCallback(() => {
    goTo(Math.max(positionRef.current - 1, -(count - 1)));
    setTick((value) => value + 1);
  }, [count, goTo]);

  // Keep the track glued to the right slot when the layout is resized.
  useEffect(() => {
    if (!step) return;
    x.set(-positionRef.current * step);
  }, [step, x]);

  // --- Auto-slide ---------------------------------------------------------
  useEffect(() => {
    if (isHovered || isFocused) return;

    const timer = window.setInterval(() => {
      if (isDragging.current) return;
      goTo(Math.min(positionRef.current + 1, count));
    }, AUTO_SLIDE_MS);

    return () => window.clearInterval(timer);
  }, [count, goTo, isFocused, isHovered, tick]);

  // --- Drag / swipe -------------------------------------------------------
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    // Cancel any slide that is still running so the drag feels direct.
    slideControls.current?.stop();
    slideControls.current = null;

    isDragging.current = true;
    dragStartX.current = event.clientX;
    dragBase.current = x.get();
    dragDelta.current = 0;

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;

    const delta = event.clientX - dragStartX.current;
    // Limit the drag so the track can never be pulled past its own cards.
    const limit = step * 0.8;
    const clamped = Math.max(-limit, Math.min(limit, delta));

    dragDelta.current = clamped;
    x.set(dragBase.current + clamped);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;

    isDragging.current = false;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const delta = dragDelta.current;
    dragDelta.current = 0;

    if (Math.abs(delta) > step * SWIPE_THRESHOLD) {
      if (delta < 0) next();
      else prev();
    } else {
      // Not far enough — spring back to the current slot.
      animate(x, dragBase.current, { type: "spring", stiffness: 260, damping: 30 });
    }
  };

  // --- Derived ------------------------------------------------------------
  /**
   * The rendered strip of cards. Slots run from `-(count - 1)` (the copy of
   * the last testimonial, sitting to the left) through `count + visible - 1`
   * (the copy that lets the right-hand end wrap around).
   */
  const slots = useMemo(() => {
    const from = -(count - 1);
    const to = count + visible - 1;
    return Array.from({ length: to - from + 1 }, (_, index) => from + index);
  }, [count, visible]);

  /** Index of the dot that should be highlighted. */
  const activeDot = ((position % count) + count) % count;

  return (
    <section
      id="testimonials"
      className="relative w-full scroll-mt-24 bg-charcoal-800/30 py-24 sm:py-28 lg:py-32"
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
            Testimonials
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            What Our Clients Say
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/55">
            Real feedback from the families and businesses we have built for
            over the last decade.
          </p>
        </motion.div>

        {/* --- Carousel --------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-14"
        >
          <div
            ref={viewportRef}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            aria-roledescription="carousel"
            aria-label="Client testimonials"
            className="overflow-hidden"
          >
            <motion.div
              style={{ x, gap: CARD_GAP }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="flex cursor-grab touch-pan-y select-none active:cursor-grabbing"
            >
              {slots.map((slot) => {
                // A slot wraps around the end of the testimonial list.
                const item = items[((slot % count) + count) % count];

                return (
                  <article
                    key={slot}
                    className="flex h-full shrink-0 flex-col rounded-sm border border-white/10 bg-charcoal/60 p-7"
                    style={{ width: cardWidth || undefined }}
                  >
                    {/* Quote mark */}
                    <Quote className="h-7 w-7 text-gold/40" aria-hidden="true" />

                    {/* Star rating */}
                    <div
                      className="mt-5 flex items-center gap-1"
                      aria-label={`${item.rating} out of 5 stars`}
                    >
                      {Array.from({ length: 5 }, (_, star) => (
                        <Star
                          key={star}
                          className={
                            star < item.rating
                              ? "h-4 w-4 fill-gold text-gold"
                              : "h-4 w-4 text-white/20"
                          }
                          aria-hidden="true"
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="mt-5 flex-1 text-sm leading-relaxed text-white/65">
                      {item.quote}
                    </p>

                    {/* Client */}
                    <div className="mt-7 flex items-center gap-4 border-t border-white/10 pt-6">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-gold">
                        <Image
                          src={item.photo}
                          alt={item.photoAlt || item.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-display text-base font-semibold leading-snug text-white">
                          {item.name}
                        </p>
                        <p className="mt-1 text-xs font-medium leading-snug text-white/70">
                          {item.projectName}
                        </p>
                        <p className="mt-0.5 text-xs leading-snug text-white/40">
                          {item.location}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </motion.div>
          </div>

          {/* --- Controls ------------------------------------------------- */}
          <div className="mt-10 flex items-center justify-center gap-6">
            {/* Prev */}
            <button
              type="button"
              onClick={prev}
              aria-label="Previous testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all duration-300 ease-smooth hover:border-gold hover:bg-gold/10 hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/70"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2.5" role="tablist" aria-label="Choose testimonial">
              {items.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={activeDot === index}
                  aria-label={`Go to testimonial ${index + 1} of ${count}`}
                  onClick={() => {
                    goTo(index);
                    setTick((value) => value + 1);
                  }}
                  className={[
                    "h-2 rounded-full transition-all duration-300 ease-smooth",
                    activeDot === index
                      ? "w-7 bg-gold"
                      : "w-2 bg-white/25 hover:bg-white/50",
                  ].join(" ")}
                />
              ))}
            </div>

            {/* Next */}
            <button
              type="button"
              onClick={next}
              aria-label="Next testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all duration-300 ease-smooth hover:border-gold hover:bg-gold/10 hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/70"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
