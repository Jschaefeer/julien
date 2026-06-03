"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Clock, GraduationCap, Landmark } from "lucide-react";

import { SpaceParticles } from "@/components/magicui/space-particles";
import { usePrefersDark } from "@/lib/use-prefers-dark";
import { Badge } from "@/components/ui/badge";
import { accentArrowReveal, accentCta, accentCtaInner } from "@/lib/accent-classes";
import { cn } from "@/lib/utils";

interface FeaturedHeroCardProps {
  href: string;
  title: string;
  label: string;
  description: string;
  audience: string;
  pillars: string;
  readTime: string;
  cost: string;
}

export function FeaturedHeroCard({
  href,
  title,
  label,
  description,
  audience,
  pillars,
  readTime,
  cost,
}: FeaturedHeroCardProps) {
  const [hovered, setHovered] = useState(false);
  const prefersDark = usePrefersDark();

  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-xl border transition-[box-shadow,border-color] duration-500 ease-out hover:border-red-800/50 hover:shadow-[0_0_28px_-6px_rgba(153,27,27,0.28),0_0_56px_-12px_rgba(69,10,10,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:hover:border-red-800/45 dark:hover:shadow-[0_0_32px_-6px_rgba(225,29,72,0.18),0_0_64px_-12px_rgba(127,29,29,0.14)]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <div className="relative border-b border-red-900/30 bg-[linear-gradient(to_bottom_right,#991b1b,#7f1d1d,#450a0a)] px-5 py-4 text-white dark:border-red-900/40 dark:bg-linear-to-br dark:from-red-950/55 dark:via-rose-950/25 dark:to-background dark:text-inherit">
        <SpaceParticles
          active={hovered}
          particleColor={prefersDark ? "244, 63, 94" : "255, 255, 255"}
        />
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.08),transparent)] opacity-0 transition-opacity duration-700 ease-out dark:bg-linear-to-br dark:from-red-500/0 dark:via-rose-500/0 dark:to-transparent",
            hovered &&
              "opacity-100 dark:from-red-500/8 dark:via-rose-500/5",
          )}
          aria-hidden
        />
        <div className="relative z-10 space-y-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
            <Badge
              variant="secondary"
              className="shrink-0 border-white/20 bg-white/15 text-white dark:border-transparent dark:bg-secondary dark:text-secondary-foreground"
            >
              {label}
            </Badge>
          </div>
          <p className="text-sm leading-relaxed text-red-100 dark:text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <GraduationCap className="size-3.5" />
            {audience}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Landmark className="size-3.5" />
            {pillars} pillars
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" />
            {readTime}
          </span>
          <span className="font-medium text-green-800 dark:text-green-700">${cost}</span>
        </div>
        <span className={cn("inline-flex items-center", accentCta)}>
          <span className={accentCtaInner}>
            Start Reading
            <ArrowUpRight className={accentArrowReveal} aria-hidden />
          </span>
        </span>
      </div>
    </Link>
  );
}
