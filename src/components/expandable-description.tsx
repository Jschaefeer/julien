"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { BLUR_FADE_EASE } from "@/lib/blur-fade";
import { accentChevronSm, accentToggle } from "@/lib/accent-classes";
import { cn } from "@/lib/utils";

/** Same easing as file-cabinet-drawer AnimatedTabPanel */
const heightEase = [0.32, 0.72, 0, 1] as const;
const EXPAND_MS = 260;
const COLLAPSE_MS = 65;

const MIN_CHARS_FOR_TOGGLE = 100;

const textClass = "text-sm leading-relaxed text-muted-foreground";

type TextParts = {
  head: string;
  tail: string;
};

function splitAtWordBoundary(text: string, charIndex: number): TextParts {
  if (charIndex >= text.length) {
    return { head: text, tail: "" };
  }

  let splitAt = charIndex;
  const space = text.lastIndexOf(" ", splitAt);
  if (space > 0) {
    splitAt = space;
  }

  return {
    head: text.slice(0, splitAt).trimEnd(),
    tail: text.slice(splitAt).trimStart(),
  };
}

function measureLineClampSplit(
  text: string,
  probe: HTMLParagraphElement
): TextParts {
  probe.textContent = text;
  probe.classList.add("line-clamp-2");

  const clampedHeight = probe.scrollHeight;

  probe.classList.remove("line-clamp-2");
  const fullHeight = probe.scrollHeight;
  probe.classList.add("line-clamp-2");

  if (fullHeight <= clampedHeight + 1) {
    return { head: text, tail: "" };
  }

  let best = 0;
  for (let i = 1; i <= text.length; i++) {
    probe.textContent = text.slice(0, i);
    probe.classList.add("line-clamp-2");
    if (probe.scrollHeight <= clampedHeight) {
      best = i;
    } else {
      break;
    }
  }

  return splitAtWordBoundary(text, best);
}

type ExpandableDescriptionProps = {
  text: string;
  className?: string;
};

export function ExpandableDescription({
  text,
  className,
}: ExpandableDescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const [parts, setParts] = useState<TextParts | null>(null);
  const [tailHeight, setTailHeight] = useState(0);
  const [height, setHeight] = useState<number>();
  const contentRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLParagraphElement>(null);
  const tailInnerRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const hasTail = Boolean(parts?.tail);
  const useSplit = parts !== null && hasTail;
  const showToggle =
    text.trim().length >= MIN_CHARS_FOR_TOGGLE || hasTail || expanded;

  useLayoutEffect(() => {
    const probe = probeRef.current;
    if (!probe) return;

    setParts(measureLineClampSplit(text, probe));
  }, [text]);

  useLayoutEffect(() => {
    const inner = tailInnerRef.current;
    if (!inner || !expanded) return;

    const measure = () => {
      setTailHeight(inner.scrollHeight);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(inner);
    return () => observer.disconnect();
  }, [expanded, parts?.tail, text]);

  useLayoutEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    const updateHeight = () => {
      setHeight(node.getBoundingClientRect().height);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(node);

    return () => observer.disconnect();
  }, [expanded, text, showToggle, parts?.tail, tailHeight]);

  const heightTransition = prefersReducedMotion
    ? { duration: 0 }
    : {
        duration: (expanded ? EXPAND_MS : COLLAPSE_MS) / 1000,
        ease: heightEase,
      };

  const tailCollapseTransition = prefersReducedMotion
    ? { duration: 0.05 }
    : {
        opacity: { duration: 0.05, ease: heightEase },
        filter: { duration: 0.05, ease: heightEase },
        height: { duration: COLLAPSE_MS / 1000, ease: heightEase },
      };

  const tailOpenTransition = prefersReducedMotion
    ? { duration: 0.1 }
    : {
        height: { duration: EXPAND_MS / 1000, ease: heightEase },
        opacity: { duration: 0.22, ease: heightEase, delay: 0.02 },
        filter: { duration: 0.24, ease: heightEase, delay: 0.02 },
      };

  return (
    <div className={cn("overflow-hidden", className)}>
      <motion.div
        initial={false}
        animate={{
          height: prefersReducedMotion ? "auto" : (height ?? "auto"),
        }}
        transition={heightTransition}
        className="overflow-hidden"
      >
        <div ref={contentRef} className="flex flex-col">
          <div className="relative">
            <p
              ref={probeRef}
              aria-hidden
              className={cn(
                textClass,
                "pointer-events-none invisible absolute inset-x-0 top-0 -z-10 h-auto select-none"
              )}
            />

            {useSplit ? (
              <p data-description className={textClass}>
                {parts.head}
                <AnimatePresence initial={false} mode="sync">
                  {expanded ? (
                    <motion.span
                      key="tail"
                      className="inline-block max-w-full overflow-hidden align-baseline"
                      initial={
                        prefersReducedMotion
                          ? { height: "auto", opacity: 1 }
                          : { height: 0, opacity: 0, filter: "blur(6px)" }
                      }
                      animate={
                        prefersReducedMotion
                          ? { height: "auto", opacity: 1 }
                          : {
                              height: tailHeight > 0 ? tailHeight : "auto",
                              opacity: 1,
                              filter: "blur(0px)",
                            }
                      }
                      exit={
                        prefersReducedMotion
                          ? { height: 0, opacity: 0 }
                          : {
                              height: 0,
                              opacity: 0,
                              filter: "blur(8px)",
                              transition: tailCollapseTransition,
                            }
                      }
                      transition={tailOpenTransition}
                    >
                      <span ref={tailInnerRef} className="inline-block">
                        {" "}
                        {parts.tail}
                      </span>
                    </motion.span>
                  ) : null}
                </AnimatePresence>
              </p>
            ) : (
              <p
                data-description
                className={cn(
                  textClass,
                  !expanded && showToggle && "line-clamp-2"
                )}
              >
                {text}
              </p>
            )}

            <AnimatePresence>
              {!expanded && showToggle ? (
                <motion.div
                  key="fade"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0.08 }
                      : { duration: 0.1, ease: BLUR_FADE_EASE, delay: 0.02 }
                  }
                  aria-hidden
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-background from-35% via-background/75 via-60% to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 h-8 backdrop-blur-[3px] [mask-image:linear-gradient(to_top,black_25%,transparent)]" />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          {showToggle ? (
            <button
              type="button"
              onClick={() => setExpanded((open) => !open)}
              className={cn("mt-0.5", accentToggle)}
              aria-expanded={expanded}
            >
              {expanded ? "See less" : "See more"}
              <ChevronDown
                className={cn(
                  accentChevronSm,
                  "size-3.5 transition-transform duration-[260ms] ease-[cubic-bezier(0.32,0.72,0,1)] can-hover:group-hover:translate-x-0",
                  expanded && "rotate-180"
                )}
                aria-hidden
              />
            </button>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}
