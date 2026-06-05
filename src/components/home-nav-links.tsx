"use client";

import type { RefObject } from "react";
import { ChevronRight } from "lucide-react";

import BlurFade from "@/components/magicui/blur-fade";
import type { ContactOriginRect } from "@/components/home-contact-overlay";
import { useContactTrigger } from "@/components/home-contact-overlay";
import { accentChevron } from "@/lib/accent-classes";
import { cn } from "@/lib/utils";

const navLinkClass =
  "group flex w-full items-center justify-between rounded-xl border border-border bg-card px-5 py-4 text-base font-medium transition-colors can-hover:hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export function HomeContactButton({
  baseDelay,
  contactOpen,
  contactLocked,
  contactButtonRef,
  onContactOpen,
}: {
  baseDelay: number;
  contactOpen: boolean;
  contactLocked: boolean;
  contactButtonRef: RefObject<HTMLButtonElement | null>;
  onContactOpen: (origin: ContactOriginRect) => void;
}) {
  const { openContact } = useContactTrigger();

  const handleContactClick = () => {
    openContact(contactButtonRef.current, onContactOpen);
  };

  return (
    <BlurFade delay={baseDelay}>
      <button
        ref={contactButtonRef}
        type="button"
        onClick={handleContactClick}
        disabled={contactLocked}
        aria-expanded={contactLocked}
        aria-haspopup="dialog"
        className={cn(
          navLinkClass,
          "w-full cursor-pointer text-left",
          contactOpen && "invisible",
        )}
        tabIndex={contactLocked ? -1 : 0}
      >
        Contact
        <ChevronRight className={accentChevron} aria-hidden />
      </button>
    </BlurFade>
  );
}
