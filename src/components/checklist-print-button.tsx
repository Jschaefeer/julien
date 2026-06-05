"use client";

import { useEffect, useState } from "react";
import {
  accentPillIcon,
  resourceActionButton,
  resourceActionButtonLabel,
} from "@/lib/accent-classes";
import { cn } from "@/lib/utils";
import { Printer } from "lucide-react";

type ChecklistPrintButtonProps = {
  className?: string;
};

/** Screen-only control — omitted from SSR/HTML exports (e.g. email generation). */
export function ChecklistPrintButton({ className }: ChecklistPrintButtonProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      type="button"
      aria-label="Print checklist"
      className={cn("checklist-print-button no-print", resourceActionButton, className)}
      onClick={() => window.print()}
    >
      <Printer className={cn("size-4", accentPillIcon)} aria-hidden />
      <span className={resourceActionButtonLabel}>Print checklist</span>
    </button>
  );
}
