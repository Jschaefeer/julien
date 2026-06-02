"use client";

import { cn } from "@/lib/utils";
import { Printer } from "lucide-react";

type ChecklistPrintButtonProps = {
  className?: string;
};

export function ChecklistPrintButton({ className }: ChecklistPrintButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "no-print inline-flex shrink-0 items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium transition-colors can-hover:hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      onClick={() => window.print()}
    >
      <Printer className="size-4" aria-hidden />
      Print checklist
    </button>
  );
}
