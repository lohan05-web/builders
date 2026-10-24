"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MoveHorizontal } from "lucide-react";
import { beforeAfter as fallbackBeforeAfter } from "@/data/projects";

interface BeforeAfterContent {
  before: string;
  after: string;
  title?: string;
  location?: string;
  beforeAlt?: string;
  afterAlt?: string;
}

/** Keyboard nudge amount (px of percentage points) per arrow press. */
const KEYBOARD_STEP = 3;
/** Larger nudge when Shift is held. */
const KEYBOARD_STEP_LARGE = 10;

interface BeforeAfterProps {
  beforeAfter?: BeforeAfterContent;
}

export default function BeforeAfter({ beforeAfter }: BeforeAfterProps = {}) {
  // Never render an empty slider — fall back to the local comparison.
  const comparison =
    beforeAfter && beforeAfter.before && beforeAfter.after
      ? beforeAfter
      : { ...fallbackBeforeAfter, beforeAlt: "", afterAlt: "" };

  /** Slider position as a percentage (0 = all "after", 100 = all "before"). */
  const [position, setPosition] = useState(50);
  /** Ref used to work out the pointer position relative to the track. */
  const containerRef = useRef<HTMLDivElement>(null);
  /** Tracks whether the user is currently dragging. */
  const isDragging = useRef(false);

  /** Convert a client X coordinate into a clamped 0-100 percentage. */
  const updateFromClientX = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    if (rect.width === 0) return;

    const percent = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, percent)));
  }, []);

  // --- Pointer drag (handles mouse, pen and touch identically) ------------
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true;
    // Capture the pointer so the drag keeps working outside the element.
    event.currentTarget.setPointerCapture(event.pointerId);
    updateFromClientX(event.clientX);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    updateFromClientX(event.clientX);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  // --- Keyboard controls --------------------------------------------------
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? KEYBOARD_STEP_LARGE : KEYBOARD_STEP;

    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        setPosition((value) => Math.max(0, value - step));
        break;
      case "ArrowRight":
        event.preventDefault();
        setPosition((value) => Math.min(100, value + step));
        break;
      case "Home":
        event.preventDefault();
        setPosition(0);
        break;
      case "End":
        event.preventDefault();
        setPosition(100);
        break;
      default:
        break;
    }
  };

  const roundedPosition = Math.round(position);

  return (
    <section
      id="before-after"
      className="relative w-full scroll-mt-20 border-y border-white/10 bg-navy-light/40 py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-8 lg:px-10">
        {/* --- Section heading ------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-orange">
            Before &amp; After
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Renovation Transformations
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
            Drag the handle to reveal what a complete renovation can do — the
            same property, before and after.
          </p>
        </motion.div>

        {/* --- Comparison slider ----------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-10 sm:mt-14"
        >
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onKeyDown={handleKeyDown}
            role="slider"
            aria-label="Before and after comparison slider"
            aria-orientation="horizontal"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={roundedPosition}
            aria-valuetext={`${roundedPosition}% of the before image is showing`}
            tabIndex={0}
            className={[
              "relative aspect-[4/3] w-full max-w-[390px] mx-auto overflow-hidden sm:aspect-[16/10] sm:max-w-none",
              "border border-white/10 bg-navy",
              // `touch-none` stops the page scrolling while dragging.
              "cursor-ew-resize touch-none select-none",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange/80",
            ].join(" ")}
          >
            {/* After image — the bottom layer, always fully visible */}
            <Image
              src={comparison.after}
              alt={
                comparison.afterAlt ||
                `${comparison.title} — after renovation`
              }
              fill
              sizes="(max-width: 1152px) 100vw, 1152px"
              className="object-cover"
              draggable={false}
            />

            {/* Before image — the top layer, clipped to the slider position */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
            >
              <Image
                src={comparison.before}
                alt={
                  comparison.beforeAlt ||
                  `${comparison.title} — before renovation`
                }
                fill
                sizes="(max-width: 1152px) 100vw, 1152px"
                className="object-cover"
                draggable={false}
              />
            </div>

            {/* Corner labels */}
            <span className="pointer-events-none absolute left-3 top-3 rounded-sm bg-navy/85 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-widest text-white backdrop-blur sm:left-5 sm:top-5 sm:px-3 sm:text-[10px]">
              Before
            </span>
            <span className="pointer-events-none absolute right-3 top-3 rounded-sm bg-orange px-2.5 py-1 text-[9px] font-semibold uppercase tracking-widest text-white backdrop-blur sm:right-5 sm:top-5 sm:px-3 sm:text-[10px]">
              After
            </span>

            {/* Divider line */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 z-10 w-0.5 bg-orange shadow-[0_0_16px_rgba(242,107,33,0.45)]"
              style={{ left: `${position}%` }}
            />

            {/* Draggable handle */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-orange bg-navy/90 text-orange shadow-lg backdrop-blur sm:h-13 sm:w-13"
              style={{ left: `${position}%` }}
            >
              <MoveHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
          </div>

          {/* Caption */}
          <div className="mt-6 text-center sm:mt-7">
            <h3 className="font-display text-xl font-semibold text-white sm:text-2xl">
              {comparison.title}
            </h3>
            <p className="mt-2 text-sm text-white/65">{comparison.location}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
