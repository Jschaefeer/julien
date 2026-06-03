"use client";

import Link from "next/link";
import { ArrowUpRight, LayoutGrid, Mail } from "lucide-react";
import { DATA } from "@/data/resume";
import {
  accentArrowReveal,
  accentCta,
  accentCtaInner,
  accentIcon,
} from "@/lib/accent-classes";
import { cn } from "@/lib/utils";

type FeaturedResource = {
  type: string;
  title: string;
  description: string;
  slug: string;
};

export function FeaturedResourceCards({
  resources,
}: {
  resources: readonly FeaturedResource[];
}) {
  return (
    <div className="relative flex flex-col gap-3">
      {resources.map((resource) => (
        <Link
          key={resource.slug}
          href={`/resources/${resource.slug}`}
          className="group flex items-start gap-4 rounded-xl border p-5 transition-all duration-200 hover:ring-2 hover:ring-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-xs text-muted-foreground">{resource.type}</p>
            <p className="font-semibold tracking-tight">{resource.title}</p>
            <p className="text-sm text-muted-foreground">
              {resource.description}
            </p>
          </div>
          <span className={cn("mt-1 inline-flex shrink-0 items-center", accentCta)}>
            <span className={accentCtaInner}>
              Get It
              <ArrowUpRight className={accentArrowReveal} aria-hidden />
            </span>
          </span>
        </Link>
      ))}

      <Link
        href="/resources"
        className="group flex items-center gap-3 rounded-xl border p-5 font-medium transition-all duration-200 hover:ring-2 hover:ring-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <LayoutGrid className={cn("size-4", accentIcon)} />
        <span className="font-semibold tracking-tight">Browse the library</span>
      </Link>

      <Link
        id="contact"
        href={`mailto:${DATA.contact.email}`}
        className="group flex items-center gap-3 rounded-xl border p-5 font-medium transition-all duration-200 hover:ring-2 hover:ring-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <Mail className={cn("size-4", accentIcon)} />
        <span className="font-semibold tracking-tight">Contact Me</span>
      </Link>
    </div>
  );
}
