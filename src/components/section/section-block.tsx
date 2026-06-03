import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function SectionBlock({
  id,
  children,
  className,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("flex min-h-0 flex-col", className)}>
      {children}
    </section>
  );
}

export function SectionGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-h-0 flex-col gap-section", className)}>
      {children}
    </div>
  );
}

export function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="section-heading mb-section-header text-xl font-bold">
      {children}
    </h2>
  );
}

export function SectionContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-h-0 [&>:first-child]:!mt-0", className)}>
      {children}
    </div>
  );
}
