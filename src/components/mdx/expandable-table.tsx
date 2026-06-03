"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ComponentProps, type Ref } from "react";
import { createPortal, flushSync } from "react-dom";
import { Maximize2, X } from "lucide-react";
import { accentToggle } from "@/lib/accent-classes";
import { cn } from "@/lib/utils";

type Rect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type LightboxRects = {
  origin: Rect;
  expanded: Rect;
  tableMinWidth: number;
};

type ScrollPos = {
  left: number;
  top: number;
};

function readScroll(el: HTMLElement | null): ScrollPos {
  return {
    left: el?.scrollLeft ?? 0,
    top: el?.scrollTop ?? 0,
  };
}

function applyScroll(el: HTMLElement | null, pos: ScrollPos) {
  if (!el) return;
  el.scrollLeft = pos.left;
  el.scrollTop = pos.top;
}
const VIEWPORT_PADDING = 12;
const MIN_EXPANDED_WIDTH = 320;
const MIN_EXPANDED_HEIGHT = 120;

function getTriggerRect(element: HTMLElement): Rect {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
}

function measureExpandedRect(container: HTMLElement): {
  expanded: Rect;
  tableMinWidth: number;
} {
  const origin = getTriggerRect(container);
  const table = container.querySelector("table");
  const maxWidth = window.innerWidth - VIEWPORT_PADDING * 2;
  const maxHeight = window.innerHeight - VIEWPORT_PADDING * 2;

  if (!table) {
    return {
      expanded: {
        top: VIEWPORT_PADDING,
        left: VIEWPORT_PADDING,
        width: maxWidth,
        height: maxHeight,
      },
      tableMinWidth: maxWidth,
    };
  }

  const measureRoot = document.createElement("div");
  measureRoot.className = "table-fullscreen-view";
  measureRoot.style.cssText =
    "position:fixed;left:-9999px;top:0;visibility:hidden;pointer-events:none;max-width:none;";

  const clone = table.cloneNode(true) as HTMLTableElement;
  clone.className =
    "m-0! w-max min-w-full border-separate border-spacing-0 table-auto";

  measureRoot.appendChild(clone);
  document.body.appendChild(measureRoot);

  const naturalWidth = Math.ceil(clone.getBoundingClientRect().width);

  const width = Math.min(
    Math.max(naturalWidth, origin.width, MIN_EXPANDED_WIDTH),
    maxWidth
  );

  clone.style.minWidth = `${naturalWidth}px`;
  measureRoot.style.width = `${width}px`;
  measureRoot.style.overflow = "hidden";
  const tableHeight = Math.ceil(clone.getBoundingClientRect().height);

  document.body.removeChild(measureRoot);

  const height = Math.min(
    Math.max(tableHeight, origin.height, MIN_EXPANDED_HEIGHT),
    maxHeight
  );

  return {
    expanded: {
      top: VIEWPORT_PADDING + (maxHeight - height) / 2,
      left: VIEWPORT_PADDING + (maxWidth - width) / 2,
      width,
      height,
    },
    tableMinWidth: naturalWidth,
  };
}

const containerVariants = {
  collapsed: ({ origin }: LightboxRects) => ({
    top: origin.top,
    left: origin.left,
    width: origin.width,
    height: origin.height,
    borderRadius: 12,
    boxShadow: "0 0 0 0 transparent",
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
    borderRadius: 16,
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    transition: {
      type: "spring" as const,
      stiffness: 420,
      damping: 34,
    },
  }),
};

function TableContent({
  className,
  minWidth,
  scrollRef,
  ...props
}: ComponentProps<"table"> & {
  minWidth?: number;
  scrollRef?: Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={scrollRef}
      data-table-scroll
      className="h-full w-full overflow-x-auto overflow-y-auto overscroll-x-contain"
    >
      <table
        className={cn(
          "m-0! w-max min-w-full border-separate border-spacing-0 table-auto",
          className
        )}
        style={minWidth ? { minWidth } : undefined}
        {...props}
      />
    </div>
  );
}

export function ExpandableTable(props: ComponentProps<"table">) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inlineScrollRef = useRef<HTMLDivElement>(null);
  const fullscreenScrollRef = useRef<HTMLDivElement>(null);
  const scrollPosRef = useRef<ScrollPos>({ left: 0, top: 0 });
  const rectsRef = useRef<LightboxRects | null>(null);
  const isExitingRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [showInline, setShowInline] = useState(true);
  const [showInlineBorder, setShowInlineBorder] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const captureRects = useCallback(() => {
    const container = containerRef.current;
    if (!container) return false;

    const measured = measureExpandedRect(container);

    rectsRef.current = {
      origin: getTriggerRect(container),
      expanded: measured.expanded,
      tableMinWidth: measured.tableMinWidth,
    };
    return true;
  }, []);

  const openLightbox = useCallback(() => {
    if (!captureRects()) return;
    scrollPosRef.current = readScroll(inlineScrollRef.current);
    isExitingRef.current = false;
    setShowInlineBorder(false);
    setShowInline(false);
    setOpen(true);
  }, [captureRects]);

  const closeLightbox = useCallback(() => {
    scrollPosRef.current = readScroll(fullscreenScrollRef.current);

    const container = containerRef.current;
    if (container && rectsRef.current) {
      rectsRef.current = {
        ...rectsRef.current,
        origin: getTriggerRect(container),
      };
    }

    isExitingRef.current = true;
    setOpen(false);
  }, []);

  useLayoutEffect(() => {
    if (!open) return;

    const pos = scrollPosRef.current;
    const apply = () => applyScroll(fullscreenScrollRef.current, pos);

    apply();
    requestAnimationFrame(apply);
  }, [open]);

  useLayoutEffect(() => {
    if (open || !showInline) return;

    const pos = scrollPosRef.current;
    const apply = () => applyScroll(inlineScrollRef.current, pos);

    apply();
    requestAnimationFrame(apply);
  }, [open, showInline]);

  const handleCollapseComplete = useCallback((definition: string) => {
    if (definition === "collapsed" && isExitingRef.current) {
      flushSync(() => setShowInline(true));
    }
  }, []);

  const handleExitComplete = useCallback(() => {
    isExitingRef.current = false;
    setShowInline(true);
    setShowInlineBorder(true);
  }, []);

  useEffect(() => {
    if (!open && showInline) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (!open) return;
      if (event.key === "Escape") {
        closeLightbox();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, showInline, closeLightbox]);

  const rects = rectsRef.current;

  const overlay =
    mounted && rects
      ? createPortal(
          <AnimatePresence onExitComplete={handleExitComplete}>
            {open && (
              <>
                <motion.button
                  type="button"
                  aria-label="Close table"
                  className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.15 } }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.26, ease: [0.33, 1, 0.68, 1] as const },
                  }}
                  onClick={closeLightbox}
                />

                <motion.div
                  custom={rects}
                  variants={containerVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  className="fixed z-50 overflow-hidden border border-border bg-background will-change-[top,left,width,height,border-radius]"
                  onAnimationComplete={handleCollapseComplete}
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="h-full w-full overflow-hidden">
                    <div
                      className="table-fullscreen-view h-full w-full"
                      style={{
                        width: rects.expanded.width,
                        height: rects.expanded.height,
                      }}
                    >
                      <TableContent
                        scrollRef={fullscreenScrollRef}
                        minWidth={rects.tableMinWidth}
                        {...props}
                      />
                    </div>
                  </div>
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
      <div className="not-prose mt-2 mb-6">
        <div className="mb-1 flex justify-end">
          <button
            type="button"
            onClick={openLightbox}
            aria-label="Expand table to full screen"
            aria-expanded={open}
            className={cn(
              accentToggle,
              "rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs shadow-sm can-hover:hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            )}
          >
            <Maximize2 className="size-3.5" aria-hidden />
            Full screen
          </button>
        </div>

        <div
          ref={containerRef}
          className={cn(
            "table-fullscreen-view overflow-hidden rounded-xl border bg-background",
            showInlineBorder ? "border-border" : "border-transparent"
          )}
        >
          <div
            aria-hidden={!showInline}
            className={cn(!showInline && "invisible pointer-events-none")}
          >
            <TableContent
              scrollRef={inlineScrollRef}
              minWidth={rectsRef.current?.tableMinWidth}
              {...props}
            />
          </div>
        </div>
      </div>
      {overlay}
    </>
  );
}
