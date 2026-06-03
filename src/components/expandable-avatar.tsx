"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal, flushSync } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { accentChevronMd } from "@/lib/accent-classes";
import { cn } from "@/lib/utils";

type Rect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type ExpandableAvatarProps = {
  srcs: readonly string[];
  alt: string;
  initials: string;
  className?: string;
};

type LightboxRects = {
  origin: Rect;
  expanded: Rect;
};

function getExpandedRect(): Rect {
  const size = Math.min(window.innerWidth * 0.92, window.innerHeight * 0.85, 640);
  return {
    top: (window.innerHeight - size) / 2,
    left: (window.innerWidth - size) / 2,
    width: size,
    height: size,
  };
}

function getTriggerRect(element: HTMLElement): Rect {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
}

/** Same corner radius as thumbnail `rounded-xl` (--radius-xl). */
const avatarBorderRadius = "var(--radius-xl)";

const containerVariants = {
  collapsed: ({ origin }: LightboxRects) => ({
    top: origin.top,
    left: origin.left,
    width: origin.width,
    height: origin.height,
    borderRadius: avatarBorderRadius,
    transition: {
      type: "tween" as const,
      duration: 0.26,
      ease: [0.33, 1, 0.68, 1] as const,
    },
  }),
  expanded: ({ expanded }: LightboxRects) => ({
    top: expanded.top,
    left: expanded.left,
    width: expanded.width,
    height: expanded.height,
    borderRadius: avatarBorderRadius,
    transition: {
      type: "spring" as const,
      stiffness: 420,
      damping: 34,
    },
  }),
};

const CONTROLS_SHOW_DELAY_MS = 90;
const CONTROLS_HIDE_MS = 80;
const AUTO_ROTATE_MS = 4500;
const controlsEnterTransition = { duration: 0.14, delay: 0.06 };
const controlsExitTransition = { duration: 0.08 };

const thumbnailVariants = {
  enter: {
    opacity: 0,
    scale: 1.04,
  },
  center: {
    opacity: 1,
    scale: 1,
  },
  exit: {
    opacity: 0,
    scale: 0.96,
  },
};

const thumbnailTransition = {
  duration: 0.55,
  ease: [0.33, 1, 0.68, 1] as const,
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0.6,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0.6,
  }),
};

const SWIPE_OFFSET_THRESHOLD = 48;
const SWIPE_VELOCITY_THRESHOLD = 250;

function getSwipeDirection(offsetX: number, velocityX: number): -1 | 0 | 1 {
  if (offsetX < -SWIPE_OFFSET_THRESHOLD || velocityX < -SWIPE_VELOCITY_THRESHOLD) {
    return 1;
  }
  if (offsetX > SWIPE_OFFSET_THRESHOLD || velocityX > SWIPE_VELOCITY_THRESHOLD) {
    return -1;
  }
  return 0;
}

export default function ExpandableAvatar({
  srcs,
  alt,
  initials,
  className,
}: ExpandableAvatarProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const rectsRef = useRef<LightboxRects | null>(null);
  const instantHandoffRef = useRef(false);
  const closeTimerRef = useRef<number | null>(null);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [open, setOpen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showThumbnail, setShowThumbnail] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [autoRotatePaused, setAutoRotatePaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const hasMultiple = srcs.length > 1;
  const currentSrc = srcs[index];

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (
      !hasMultiple ||
      open ||
      !showThumbnail ||
      autoRotatePaused ||
      prefersReducedMotion
    ) {
      return;
    }

    const interval = setInterval(() => {
      setDirection(1);
      setIndex((current) => (current + 1) % srcs.length);
    }, AUTO_ROTATE_MS);

    return () => clearInterval(interval);
  }, [
    hasMultiple,
    open,
    showThumbnail,
    autoRotatePaused,
    prefersReducedMotion,
    srcs.length,
  ]);

  const goTo = useCallback(
    (nextIndex: number) => {
      if (nextIndex === index || srcs.length <= 1) return;
      setDirection(nextIndex > index ? 1 : -1);
      setIndex(nextIndex);
    },
    [index, srcs.length]
  );

  const goNext = useCallback(() => {
    goTo((index + 1) % srcs.length);
  }, [goTo, index, srcs.length]);

  const goPrev = useCallback(() => {
    goTo((index - 1 + srcs.length) % srcs.length);
  }, [goTo, index, srcs.length]);

  const handleSwipeEnd = useCallback(
    (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
      const swipeDirection = getSwipeDirection(info.offset.x, info.velocity.x);
      if (swipeDirection === 1) goNext();
      else if (swipeDirection === -1) goPrev();
    },
    [goNext, goPrev]
  );

  const captureRects = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return false;

    rectsRef.current = {
      origin: getTriggerRect(trigger),
      expanded: getExpandedRect(),
    };
    return true;
  }, []);

  const openLightbox = useCallback(() => {
    if (!captureRects()) return;
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    instantHandoffRef.current = true;
    flushSync(() => {
      setShowControls(false);
      setIsClosing(false);
      setShowThumbnail(false);
      setOpen(true);
    });
  }, [captureRects]);

  const closeLightbox = useCallback(() => {
    if (!captureRects()) return;
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
    }
    flushSync(() => {
      setShowControls(false);
      setIsClosing(true);
    });
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      setOpen(false);
    }, CONTROLS_HIDE_MS);
  }, [captureRects]);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => setShowControls(true), CONTROLS_SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [open]);

  const handleExitComplete = useCallback(() => {
    setIsClosing(false);
    instantHandoffRef.current = true;
    setShowThumbnail(true);
  }, []);

  useEffect(() => {
    if (!open && showThumbnail) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (!open) return;

      if (event.key === "Escape") {
        closeLightbox();
        return;
      }

      if (hasMultiple && event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }

      if (hasMultiple && event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, showThumbnail, closeLightbox, goNext, goPrev, hasMultiple]);

  const rects = rectsRef.current;

  const overlay =
    mounted && rects
      ? createPortal(
          <AnimatePresence onExitComplete={handleExitComplete}>
            {open && (
              <>
                <motion.button
                  type="button"
                  aria-label="Close photo"
                  className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.15 } }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.2 },
                  }}
                  onClick={closeLightbox}
                />

                <motion.div
                  custom={rects}
                  variants={containerVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  onAnimationComplete={() => {
                    if (open && !isClosing) {
                      instantHandoffRef.current = false;
                    }
                  }}
                  className="fixed z-50 overflow-hidden rounded-xl bg-background shadow-2xl will-change-[top,left,width,height]"
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="relative h-full w-full">
                    <AnimatePresence initial={false} custom={direction} mode="popLayout">
                      <motion.img
                        key={currentSrc}
                        src={currentSrc}
                        alt={alt}
                        custom={direction}
                        variants={slideVariants}
                        initial={instantHandoffRef.current ? false : "enter"}
                        animate="center"
                        exit={isClosing ? { x: 0, opacity: 1 } : "exit"}
                        transition={{ duration: 0.22, ease: [0.33, 1, 0.68, 1] as const }}
                        drag={hasMultiple ? "x" : false}
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.65}
                        dragMomentum={false}
                        onDragEnd={handleSwipeEnd}
                        className={cn(
                          "absolute inset-0 h-full w-full object-cover select-none",
                          hasMultiple && "cursor-grab touch-none active:cursor-grabbing"
                        )}
                      />
                    </AnimatePresence>
                  </div>
                </motion.div>

                {hasMultiple && (
                  <AnimatePresence>
                    {showControls && !isClosing && (
                      <>
                        <motion.button
                          type="button"
                          aria-label="Previous photo"
                          onClick={goPrev}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1, transition: controlsEnterTransition }}
                          exit={{ opacity: 0, transition: controlsExitTransition }}
                          className="group fixed z-[60] -translate-y-1/2 rounded-full border bg-background/90 p-2 shadow-sm transition-colors can-hover:hover:bg-muted"
                          style={{
                            top: rects.expanded.top + rects.expanded.height / 2,
                            left: rects.expanded.left + 12,
                          }}
                        >
                          <ChevronLeft className={accentChevronMd} />
                        </motion.button>
                        <motion.button
                          type="button"
                          aria-label="Next photo"
                          onClick={goNext}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1, transition: controlsEnterTransition }}
                          exit={{ opacity: 0, transition: controlsExitTransition }}
                          className="group fixed z-[60] -translate-y-1/2 rounded-full border bg-background/90 p-2 shadow-sm transition-colors can-hover:hover:bg-muted"
                          style={{
                            top: rects.expanded.top + rects.expanded.height / 2,
                            left: rects.expanded.left + rects.expanded.width - 44,
                          }}
                        >
                          <ChevronRight className={accentChevronMd} />
                        </motion.button>
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0, transition: controlsEnterTransition }}
                          exit={{ opacity: 0, y: 4, transition: controlsExitTransition }}
                          className="fixed z-[60] flex items-center justify-center gap-2"
                          style={{
                            top: rects.expanded.top + rects.expanded.height + 16,
                            left: rects.expanded.left,
                            width: rects.expanded.width,
                          }}
                        >
                          {srcs.map((src, i) => (
                            <button
                              key={src}
                              type="button"
                              aria-label={`Go to photo ${i + 1}`}
                              aria-current={i === index ? "true" : undefined}
                              onClick={() => goTo(i)}
                              className={cn(
                                "rounded-full transition-all duration-200",
                                i === index
                                  ? "size-2 bg-foreground"
                                  : "size-2 bg-foreground/30 hover:bg-foreground/50"
                              )}
                            />
                          ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                )}

                <motion.button
                  type="button"
                  aria-label="Close"
                  onClick={closeLightbox}
                  className="fixed top-4 right-4 z-50 rounded-full border bg-background/90 p-2 shadow-sm transition-colors hover:bg-muted"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    transition: { delay: 0.04, duration: 0.15 },
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.92,
                    transition: { duration: 0.1 },
                  }}
                >
                  <X className="size-4" />
                </motion.button>
              </>
            )}
          </AnimatePresence>,
          document.body
        )
      : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openLightbox}
        onMouseEnter={() => setAutoRotatePaused(true)}
        onMouseLeave={() => setAutoRotatePaused(false)}
        onFocus={() => setAutoRotatePaused(true)}
        onBlur={() => setAutoRotatePaused(false)}
        aria-label={`View photo of ${alt}`}
        aria-expanded={open}
        className={cn(
          "relative size-24 md:size-32 shrink-0 cursor-zoom-in rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
      >
        <div className="relative size-full overflow-hidden rounded-xl shadow-lg">
          <AnimatePresence mode="popLayout" initial={false}>
            {showThumbnail ? (
              <motion.img
                key={currentSrc}
                src={currentSrc}
                alt={alt}
                variants={thumbnailVariants}
                initial={instantHandoffRef.current ? false : "enter"}
                animate="center"
                exit={
                  instantHandoffRef.current
                    ? { opacity: 0, scale: 1, transition: { duration: 0 } }
                    : "exit"
                }
                transition={
                  instantHandoffRef.current
                    ? { duration: 0 }
                    : thumbnailTransition
                }
                onAnimationComplete={() => {
                  if (showThumbnail) {
                    instantHandoffRef.current = false;
                  }
                }}
                className="absolute inset-0 size-full object-cover"
              />
            ) : null}
          </AnimatePresence>
        </div>

        <span className="sr-only">{initials}</span>
      </button>
      {overlay}
    </>
  );
}
