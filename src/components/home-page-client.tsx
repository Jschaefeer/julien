"use client";

import { useCallback, useRef, useState } from "react";
import { flushSync } from "react-dom";

import BlurFade from "@/components/magicui/blur-fade";
import {
  HomeContactOverlay,
  type ContactOriginRect,
} from "@/components/home-contact-overlay";
import { HomeNavLinks } from "@/components/home-nav-links";
import { PillarFanAvatars } from "@/components/pillar-fan-avatars";
import FeaturedResourcesSection from "@/components/section/featured-resources-section";
import { DATA } from "@/data/resume";
import { BLUR_FADE_DELAY } from "@/lib/blur-fade";

function readButtonRect(button: HTMLButtonElement): ContactOriginRect {
  const rect = button.getBoundingClientRect();
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
}

export function HomePageClient() {
  const [contactOpen, setContactOpen] = useState(false);
  const [overlayPresent, setOverlayPresent] = useState(false);
  const [contactOrigin, setContactOrigin] = useState<ContactOriginRect | null>(
    null,
  );
  const contactButtonRef = useRef<HTMLButtonElement>(null);
  const contactLocked = contactOpen || overlayPresent;

  const linksDelay = BLUR_FADE_DELAY * 2;
  const featuredDelay = linksDelay + BLUR_FADE_DELAY * 3;

  const openContact = useCallback((origin: ContactOriginRect) => {
    setContactOrigin(origin);
    setContactOpen(true);
  }, []);

  const closeContact = useCallback(() => {
    const button = contactButtonRef.current;
    flushSync(() => {
      if (button) {
        setContactOrigin(readButtonRect(button));
      }
      setContactOpen(false);
    });
  }, []);

  return (
    <>
      <main
        className="relative flex w-full flex-col gap-10"
        aria-hidden={contactLocked}
        style={contactLocked ? { pointerEvents: "none" } : undefined}
      >
        <section
          id="hero"
          className="relative -mx-6 -mt-12 px-6 pt-14 text-left sm:-mt-24 sm:pt-20"
        >
          <div className="flex flex-col gap-6">
            <BlurFade delay={0}>
              <div className="flex items-center gap-3 sm:gap-4">
                <PillarFanAvatars />
                <div className="min-w-0 space-y-2">
                  <h1 className="text-3xl font-semibold tracking-tighter sm:text-4xl">
                    NIL Money Guide
                  </h1>
                  <p className="text-lg text-muted-foreground sm:text-xl">
                    by {DATA.name}
                  </p>
                </div>
              </div>
            </BlurFade>

            <BlurFade delay={BLUR_FADE_DELAY}>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                {DATA.description}
              </p>
            </BlurFade>

            <HomeNavLinks
              baseDelay={linksDelay}
              contactOpen={contactOpen}
              contactLocked={contactLocked}
              contactButtonRef={contactButtonRef}
              onContactOpen={openContact}
            />
          </div>
        </section>

        <FeaturedResourcesSection baseDelay={featuredDelay} />
      </main>

      <HomeContactOverlay
        open={contactOpen}
        origin={contactOrigin}
        onClose={closeContact}
        onPresenceChange={setOverlayPresent}
      />
    </>
  );
}
