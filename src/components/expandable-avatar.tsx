"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type Rect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type ExpandableAvatarProps = {
  src: string;
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

const imageVariants = {
  collapsed: ({ origin }: LightboxRects) => ({
    top: origin.top,
    left: origin.left,
    width: origin.width,
    height: origin.height,
    borderRadius: 12,
    transition: {
      type: "tween" as const,
      duration: 0.26,
      ease: [0.33, 1, 0.68, 1],
    },
  }),
  expanded: ({ expanded }: LightboxRects) => ({
    top: expanded.top,
    left: expanded.left,
    width: expanded.width,
    height: expanded.height,
    borderRadius: 16,
    transition: {
      type: "spring" as const,
      stiffness: 420,
      damping: 34,
    },
  }),
};

export default function ExpandableAvatar({
  src,
  alt,
  initials,
  className,
}: ExpandableAvatarProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const rectsRef = useRef<LightboxRects | null>(null);
  const [open, setOpen] = useState(false);
  const [showThumbnail, setShowThumbnail] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

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
    setShowThumbnail(false);
    setOpen(true);
  }, [captureRects]);

  const closeLightbox = useCallback(() => {
    captureRects();
    setOpen(false);
  }, [captureRects]);

  const handleExitComplete = useCallback(() => {
    setShowThumbnail(true);
  }, []);

  useEffect(() => {
    if (!open && showThumbnail) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) closeLightbox();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, showThumbnail, closeLightbox]);

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
                    transition: { duration: 0.22, delay: 0.06 },
                  }}
                  onClick={closeLightbox}
                />

                <motion.div
                  custom={rects}
                  variants={imageVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  className="fixed z-50 overflow-hidden border shadow-2xl ring-4 ring-muted will-change-[top,left,width,height]"
                >
                  <img
                    src={src}
                    alt={alt}
                    className="h-full w-full object-cover"
                  />
                </motion.div>

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
        aria-label={`View photo of ${alt}`}
        aria-expanded={open}
        className={cn(
          "relative size-24 md:size-32 shrink-0 cursor-zoom-in rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
      >
        <img
          src={src}
          alt={alt}
          className={cn(
            "size-full rounded-xl border object-cover shadow-lg ring-4 ring-muted",
            !showThumbnail && "opacity-0"
          )}
        />
        <span className="sr-only">{initials}</span>
      </button>
      {overlay}
    </>
  );
}
