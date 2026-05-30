"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export function ChecklistPrintButton() {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="no-print gap-2 shrink-0"
      onClick={() => window.print()}
    >
      <Printer className="size-3.5" aria-hidden />
      Print checklist
    </Button>
  );
}
