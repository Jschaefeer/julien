"use client";

import type { RefObject } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import BlurFade from "@/components/magicui/blur-fade";
import type { ContactOriginRect } from "@/components/home-contact-overlay";
import { useContactTrigger } from "@/components/home-contact-overlay";
import { BLUR_FADE_DELAY } from "@/lib/blur-fade";
import { accentChevron } from "@/lib/accent-classes";
import { cn } from "@/lib/utils";

const HOME_LINKS = [
  { href: "/about", label: "About" },
  { href: "/resources", label: "Resources" },
] as const;

const navLinkClass =
  "group flex w-full items-center justify-between rounded-xl border border-border bg-card px-5 py-4 text-base font-medium transition-colors can-hover:hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export function HomeNavLinks({
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
    <nav aria-label="Site pages" className="flex w-full flex-col gap-3">
      <BlurFade delay={baseDelay}>
        <div
          className={cn(
            "flex flex-col gap-3",
            contactLocked && "pointer-events-none",
          )}
          aria-hidden={contactLocked}
        >
          {HOME_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={navLinkClass} tabIndex={contactLocked ? -1 : 0}>
              {link.label}
              <ChevronRight className={accentChevron} aria-hidden />
            </Link>
          ))}
        </div>
      </BlurFade>

      <BlurFade delay={baseDelay + HOME_LINKS.length * BLUR_FADE_DELAY}>
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
    </nav>
  );
}
