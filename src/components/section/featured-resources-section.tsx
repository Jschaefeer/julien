import type { RefObject } from "react";

import BlurFade from "@/components/magicui/blur-fade";
import { FileCabinet } from "@/components/file-cabinet";
import type { ContactOriginRect } from "@/components/home-contact-overlay";
import { HomeContactButton } from "@/components/home-nav-links";
import {
  SectionBlock,
  SectionContent,
  SectionHeading,
} from "@/components/section/section-block";
import { BLUR_FADE_DELAY } from "@/lib/blur-fade";

export default function FeaturedResourcesSection({
  baseDelay = BLUR_FADE_DELAY * 5,
  contactOpen,
  contactLocked,
  contactButtonRef,
  onContactOpen,
}: {
  baseDelay?: number;
  contactOpen: boolean;
  contactLocked: boolean;
  contactButtonRef: RefObject<HTMLButtonElement | null>;
  onContactOpen: (origin: ContactOriginRect) => void;
}) {
  const contactDelay = baseDelay + BLUR_FADE_DELAY;

  return (
    <SectionBlock id="resources" className="gap-3">
      <BlurFade delay={baseDelay}>
        <SectionHeading>Featured Resources</SectionHeading>
      </BlurFade>
      <BlurFade delay={baseDelay + BLUR_FADE_DELAY * 0.5}>
        <SectionContent>
          <FileCabinet />
        </SectionContent>
      </BlurFade>

      <HomeContactButton
        baseDelay={contactDelay}
        contactOpen={contactOpen}
        contactLocked={contactLocked}
        contactButtonRef={contactButtonRef}
        onContactOpen={onContactOpen}
      />
    </SectionBlock>
  );
}
