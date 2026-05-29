"use client";

import Link from "next/link";
import { ArrowUpRight, LayoutGrid, Mail } from "lucide-react";
import { DATA } from "@/data/resume";

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
          <span className="mt-1 inline-flex shrink-0 items-center text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
            <span className="relative inline-flex items-center transition-transform duration-200 ease-out group-hover:-translate-x-1.5">
              Get It
              <ArrowUpRight className="absolute left-[calc(100%+2px)] top-1/2 size-3.5 -translate-x-2 -translate-y-1/2 opacity-0 transition-all duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100" />
            </span>
          </span>
        </Link>
      ))}

      <Link
        href="/resources"
        className="group flex items-center gap-3 rounded-xl border p-5 font-medium transition-all duration-200 hover:ring-2 hover:ring-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <LayoutGrid className="size-4 shrink-0 text-muted-foreground" />
        <span className="font-semibold tracking-tight">Browse the library</span>
      </Link>

      <Link
        id="contact"
        href={`mailto:${DATA.contact.email}`}
        className="group flex items-center gap-3 rounded-xl border p-5 font-medium transition-all duration-200 hover:ring-2 hover:ring-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <Mail className="size-4 shrink-0 text-muted-foreground" />
        <span className="font-semibold tracking-tight">Contact Me</span>
      </Link>
    </div>
  );
}
