"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { createPortal, flushSync } from "react-dom";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  type Transition,
  type Variants,
} from "motion/react";
import { ChevronRight, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DATA } from "@/data/resume";
import { accentChevron } from "@/lib/accent-classes";
import { cn } from "@/lib/utils";

export type ContactOriginRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type OverlayRects = {
  origin: ContactOriginRect;
  expanded: ContactOriginRect;
};

const MORPH_EASE = [0.32, 0.72, 0, 1] as const;
const MORPH_DURATION = 0.28;
const CONTENT_HIDE_DURATION = 0.1;

function getTriggerRect(element: HTMLElement): ContactOriginRect {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
}

function getFullScreenRect(): ContactOriginRect {
  return {
    top: 0,
    left: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

function morphTransition(reducedMotion: boolean): Transition {
  if (reducedMotion) return { duration: 0.01 };
  return { duration: MORPH_DURATION, ease: MORPH_EASE };
}

const shellVariants: Variants = {
  collapsed: ({ origin }: OverlayRects) => ({
    top: origin.top,
    left: origin.left,
    width: origin.width,
    height: origin.height,
    borderRadius: 12,
  }),
  expanded: ({ expanded }: OverlayRects) => ({
    top: expanded.top,
    left: expanded.left,
    width: expanded.width,
    height: expanded.height,
    borderRadius: 0,
  }),
};

const fieldClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

function buildMailtoHref({
  name,
  message,
}: {
  name: string;
  message: string;
}) {
  const trimmedName = name.trim();
  const trimmedMessage = message.trim();
  const subject = trimmedName
    ? `Message from ${trimmedName} - NIL Contact Form`
    : "Message from NIL Contact Form";

  return `mailto:${DATA.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(trimmedMessage)}`;
}

function contentVisibilityTransition(reducedMotion: boolean, closing: boolean) {
  if (reducedMotion) return { duration: 0.01 };
  return {
    duration: closing ? CONTENT_HIDE_DURATION : 0.2,
    ease: MORPH_EASE,
  };
}

function ContactPanelContent({
  open,
  reducedMotion,
  onClose,
}: {
  open: boolean;
  reducedMotion: boolean;
  onClose: () => void;
}) {
  const closing = !open;
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (open) return;
    setSent(false);
    setName("");
    setMessage("");
  }, [open]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;

    window.location.href = buildMailtoHref({ name, message: trimmed });
    setSent(true);
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <div className="group flex h-[58px] shrink-0 items-center justify-between px-5 py-4">
        <span className="text-base font-medium">Contact</span>
        {open ? (
          <motion.button
            type="button"
            onClick={onClose}
            initial={false}
            animate={{ opacity: 1 }}
            transition={contentVisibilityTransition(reducedMotion, closing)}
            className={cn(
              "inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors",
              "can-hover:hover:bg-muted/50 can-hover:hover:text-money-green",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            )}
            aria-label="Close"
          >
            <X className="size-4" aria-hidden />
          </motion.button>
        ) : (
          <ChevronRight className={accentChevron} aria-hidden />
        )}
      </div>

      <motion.div
        initial={false}
        animate={{ opacity: open ? 1 : 0 }}
        transition={contentVisibilityTransition(reducedMotion, closing)}
        className={cn(
          "mx-auto flex w-full max-w-lg min-h-0 flex-1 flex-col justify-center gap-8 px-6 pb-20 sm:px-8 sm:pb-24",
          !open && "pointer-events-none",
        )}
        aria-hidden={!open}
      >
        {sent ? (
          <p className="text-pretty text-base leading-relaxed text-muted-foreground">
            Thanks for reaching out.
            {/* {" "}
            <Link
              href="/about"
              className="font-medium text-foreground underline underline-offset-4 transition-colors can-hover:hover:text-foreground/80"
            >
              Learn more about {DATA.name}
            </Link>
            . */}
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col gap-4"
          >
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Name
              </span>
              <input
                type="text"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={fieldClass}
                placeholder="Your name"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Message
              </span>
              <textarea
                name="message"
                required
                rows={6}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className={cn(fieldClass, "min-h-[9rem] resize-y")}
                placeholder="How can I help?"
              />
            </label>
            <Button
              type="submit"
              size="lg"
              className="h-12 w-full rounded-xl text-base"
              disabled={!message.trim()}
            >
              Send
            </Button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

export function HomeContactOverlay({
  open,
  origin,
  onClose,
  onPresenceChange,
}: {
  open: boolean;
  origin: ContactOriginRect | null;
  onClose: () => void;
  onPresenceChange?: (present: boolean) => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = !!prefersReducedMotion;
  const [mounted, setMounted] = useState(false);
  const [rects, setRects] = useState<OverlayRects | null>(null);
  const closeHandledRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open || !origin) return;
    closeHandledRef.current = false;
    setRects({
      origin,
      expanded: getFullScreenRect(),
    });
  }, [open, origin]);

  const activeRects = useMemo((): OverlayRects | null => {
    if (!origin) return null;
    if (!rects) {
      return open
        ? { origin, expanded: getFullScreenRect() }
        : null;
    }
    return { origin, expanded: rects.expanded };
  }, [open, origin, rects]);

  useEffect(() => {
    onPresenceChange?.(!!activeRects);
  }, [activeRects, onPresenceChange]);

  useEffect(() => {
    if (!activeRects) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeRects, onClose]);

  useEffect(() => {
    if (!activeRects) return;

    const onResize = () => {
      setRects((current) =>
        current
          ? { ...current, expanded: getFullScreenRect() }
          : current,
      );
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeRects]);

  const finishClose = useCallback(() => {
    if (closeHandledRef.current) return;
    closeHandledRef.current = true;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setRects(null);
      });
    });
  }, []);

  const handleShellAnimationComplete = useCallback(
    (definition: string) => {
      if (open || definition !== "collapsed") return;
      finishClose();
    },
    [open, finishClose],
  );

  const shellTransition = morphTransition(reducedMotion);

  const overlay =
    mounted && activeRects
      ? createPortal(
          <motion.div
            custom={activeRects}
            variants={shellVariants}
            initial="collapsed"
            animate={open ? "expanded" : "collapsed"}
            transition={shellTransition}
            onAnimationComplete={handleShellAnimationComplete}
            className={cn(
              "fixed z-[100] overflow-hidden bg-card will-change-[top,left,width,height,border-radius]",
              !open && "border border-border",
            )}
            role="dialog"
            aria-modal="true"
            aria-label="Contact"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-muted/20 via-transparent to-transparent" />
            <div className="relative h-full min-h-0">
              <ContactPanelContent
                open={open}
                reducedMotion={reducedMotion}
                onClose={onClose}
              />
            </div>
          </motion.div>,
          document.body,
        )
      : null;

  return overlay;
}

export function useContactTrigger() {
  const openContact = useCallback(
    (
      element: HTMLElement | null,
      onOpen: (origin: ContactOriginRect) => void,
    ) => {
      if (!element) return;
      const origin = getTriggerRect(element);
      flushSync(() => onOpen(origin));
    },
    [],
  );

  return { openContact };
}

export const contactMorphDuration = MORPH_DURATION;
export const contactMorphEase = MORPH_EASE;
