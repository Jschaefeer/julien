"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  blurFadeEnterTransition,
  blurFadeExit,
  blurFadeExitTransition,
  blurFadeHidden,
  blurFadeVisible,
} from "@/lib/blur-fade";
import {
  accentArrowReveal,
  accentCta,
  accentCtaInner,
  accentIcon,
  accentTabLabel,
  featuredTabActive,
} from "@/lib/accent-classes";
import { cn } from "@/lib/utils";

export type ArticlePreviewData = {
  slug: string;
  title: string;
  tabLabel: string;
  summary: string;
  excerpt: string;
  label?: string;
  readTime?: string;
  cost?: string;
};

const tabBaseClass =
  "relative max-w-[9.5rem] shrink-0 truncate px-3.5 py-2.5 text-xs font-semibold tracking-tight sm:max-w-[10.5rem] sm:px-4 sm:text-sm";

const tabSpring = { type: "spring", stiffness: 420, damping: 34, mass: 0.85 } as const;

type TabIndicatorRect = {
  left: number;
  width: number;
  height: number;
};

function useTabIndicator(activeSlug: string) {
  const tabListRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());
  const [indicator, setIndicator] = useState<TabIndicatorRect | null>(null);

  const setTabRef = useCallback((slug: string, node: HTMLButtonElement | null) => {
    if (node) tabRefs.current.set(slug, node);
    else tabRefs.current.delete(slug);
  }, []);

  const measure = useCallback(() => {
    const list = tabListRef.current;
    const tab = tabRefs.current.get(activeSlug);
    if (!list || !tab) return;

    const listRect = list.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();

    setIndicator({
      left: tabRect.left - listRect.left + list.scrollLeft,
      width: tabRect.width,
      height: tabRect.height,
    });
  }, [activeSlug]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const list = tabListRef.current;
    if (!list) return;

    const observer = new ResizeObserver(measure);
    observer.observe(list);
    tabRefs.current.forEach((tab) => observer.observe(tab));

    list.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      list.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure, activeSlug]);

  return { tabListRef, setTabRef, indicator, measure };
}

function FolderTab({
  slug,
  label,
  title,
  active,
  touchStart,
  onClick,
  setTabRef,
}: {
  slug: string;
  label: string;
  title: string;
  active: boolean;
  touchStart: boolean;
  onClick: () => void;
  setTabRef: (slug: string, node: HTMLButtonElement | null) => void;
}) {
  return (
    <motion.button
      ref={(node) => setTabRef(slug, node)}
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      whileTap={{ scale: 0.98, originY: 1 }}
      transition={{ duration: 0.12 }}
      className={cn(
        tabBaseClass,
        "text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        "rounded-t-lg border border-border",
        touchStart ? "" : "-ml-px",
        active
          ? "group z-20 -mb-px border-transparent bg-transparent"
          : "group z-0 bg-muted transition-colors duration-200 hover:bg-accent",
      )}
      title={title}
    >
      <motion.span
        className={cn(
          "relative block truncate",
          active ? featuredTabActive : accentTabLabel,
        )}
        animate={{ y: active ? -1 : 0 }}
        transition={
          active
            ? { type: "spring", stiffness: 460, damping: 28 }
            : { duration: 0.18, ease: "easeOut" }
        }
      >
        {label}
      </motion.span>
    </motion.button>
  );
}

function TabIndicator({
  rect,
  prefersReducedMotion,
}: {
  rect: TabIndicatorRect | null;
  prefersReducedMotion: boolean | null;
}) {
  if (!rect) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute bottom-0 z-10 -mb-px rounded-t-lg border border-border border-b-card bg-card shadow-[0_1px_0_0_hsl(var(--card))]"
      initial={false}
      animate={{
        left: rect.left,
        width: rect.width,
        height: rect.height,
        opacity: 1,
      }}
      transition={
        prefersReducedMotion ? { duration: 0 } : tabSpring
      }
    />
  );
}

function LibraryTab({ touchStart }: { touchStart: boolean }) {
  return (
    <Link
      href="/resources"
      className={cn(
        tabBaseClass,
        "group inline-flex items-center gap-1 text-muted-foreground",
        "rounded-t-lg border border-border",
        touchStart ? "" : "-ml-px",
        "bg-muted hover:bg-accent can-hover:hover:text-money-green",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
      )}
      title="Browse the library"
    >
      Library
      <ArrowUpRight className={cn("size-3 opacity-70", accentIcon)} />
    </Link>
  );
}

function ArticlePreviewFooter() {
  return (
    <div className="flex justify-end pt-4">
      <span className={cn("inline-flex shrink-0 items-center", accentCta)}>
        <span className={accentCtaInner}>
          Read article
          <ArrowUpRight className={accentArrowReveal} aria-hidden />
        </span>
      </span>
    </div>
  );
}

function ArticlePreviewCard({ article }: { article: ArticlePreviewData }) {
  return (
    <Link
      href={`/resources/${article.slug}`}
      className="group flex flex-col gap-4 bg-card p-5 pt-4 transition-colors duration-200 hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset sm:px-6 sm:pb-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-2">
          {article.label ? (
            <Badge variant="outline">
              {article.label}
            </Badge>
          ) : null}
          <h3 className="text-xl font-semibold tracking-tight">{article.title}</h3>
          <p className="text-sm font-medium leading-snug text-foreground/85">
            {article.summary}
          </p>
        </div>
      </div>

      <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
        {article.excerpt}
      </p>

      <ArticlePreviewFooter />
    </Link>
  );
}

const heightEase = [0.32, 0.72, 0, 1] as const;

function AnimatedTabPanel({
  activeSlug,
  activeArticle,
  prefersReducedMotion,
}: {
  activeSlug: string;
  activeArticle: ArticlePreviewData;
  prefersReducedMotion: boolean | null;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>();

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
  }, [activeSlug]);

  const heightTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.38, ease: heightEase };

  return (
    <div
      role="tabpanel"
      aria-labelledby={activeArticle.tabLabel}
      className="-mt-px overflow-hidden rounded-xl border border-border bg-card transition-shadow duration-200 hover:shadow-sm"
    >
      <motion.div
        initial={false}
        animate={{ height: prefersReducedMotion ? "auto" : (height ?? "auto") }}
        transition={heightTransition}
        className="overflow-hidden"
      >
        <div ref={contentRef} className="relative">
          <div aria-hidden className="invisible pointer-events-none">
            <ArticlePreviewCard article={activeArticle} />
          </div>
          <div className="absolute inset-x-0 top-0">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={activeSlug}
                initial={
                  prefersReducedMotion ? blurFadeVisible : blurFadeHidden
                }
                animate={blurFadeVisible}
                exit={
                  prefersReducedMotion
                    ? blurFadeVisible
                    : { ...blurFadeExit, transition: blurFadeExitTransition() }
                }
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : blurFadeEnterTransition()
                }
              >
                <ArticlePreviewCard article={activeArticle} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function FileCabinetDrawer({
  articles,
}: {
  articles: ArticlePreviewData[];
}) {
  const prefersReducedMotion = useReducedMotion();
  const [activeSlug, setActiveSlug] = useState(articles[0]?.slug ?? "");

  const activeIndex = articles.findIndex((a) => a.slug === activeSlug);

  const selectTab = useCallback(
    (slug: string, offset?: number) => {
      const nextIndex =
        offset !== undefined
          ? (activeIndex + offset + articles.length) % articles.length
          : articles.findIndex((a) => a.slug === slug);

      if (nextIndex < 0 || nextIndex === activeIndex) return;

      setActiveSlug(articles[nextIndex]?.slug ?? slug);
    },
    [activeIndex, articles],
  );

  const selectByOffset = useCallback(
    (offset: number) => {
      selectTab(activeSlug, offset);
    },
    [activeSlug, selectTab],
  );

  const { tabListRef, setTabRef, indicator } = useTabIndicator(activeSlug);

  const activeArticle =
    articles.find((a) => a.slug === activeSlug) ?? articles[0];

  if (!activeArticle) return null;

  return (
    <div className="flex flex-col">
      <div
        ref={tabListRef}
        role="tablist"
        aria-label="Resource folders"
        className="relative -mt-1 flex items-end overflow-x-auto overflow-y-hidden px-3 pt-1 touch-pan-x [scrollbar-width:none] sm:px-4 [&::-webkit-scrollbar]:hidden"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            selectByOffset(1);
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            selectByOffset(-1);
          }
        }}
      >
        <TabIndicator
          rect={indicator}
          prefersReducedMotion={prefersReducedMotion}
        />
        {articles.map((article, index) => (
          <FolderTab
            key={article.slug}
            slug={article.slug}
            label={article.tabLabel}
            title={article.title}
            touchStart={index === 0}
            active={activeSlug === article.slug}
            onClick={() => selectTab(article.slug)}
            setTabRef={setTabRef}
          />
        ))}
        <LibraryTab touchStart={articles.length === 0} />
      </div>

      <AnimatedTabPanel
        activeSlug={activeSlug}
        activeArticle={activeArticle}
        prefersReducedMotion={prefersReducedMotion}
      />
    </div>
  );
}
