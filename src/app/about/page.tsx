import BlurFade from "@/components/magicui/blur-fade";
import {
  AboutPageHero,
  ExperienceEducationSection,
} from "@/components/section/about-section";
import { getAboutExperienceStartDelay } from "@/lib/about-delays";
import { BLUR_FADE_DELAY } from "@/lib/blur-fade";
import { accentBackChevron, accentBackLink } from "@/lib/accent-classes";
import { createMetadata } from "@/lib/seo";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

const aboutDescription =
  "Julian Palmer creates NIL financial literacy content for college athletes. Finance background at J.P. Morgan, UMass Isenberg alum, and lifelong New York sports fan.";

export const metadata: Metadata = createMetadata({
  title: "About",
  description: aboutDescription,
  path: "/about",
});

export default function AboutPage() {
  const baseDelay = BLUR_FADE_DELAY;
  const experienceDelay = getAboutExperienceStartDelay(baseDelay);

  return (
    <section id="about" className="flex flex-col gap-8 sm:gap-section">
      <BlurFade delay={0}>
        <Link
          href="/"
          className={accentBackLink}
          aria-label="Back to Home"
        >
          <ChevronLeft className={accentBackChevron} />
          Back to Home
        </Link>
      </BlurFade>

      <AboutPageHero baseDelay={baseDelay} />

      <ExperienceEducationSection baseDelay={experienceDelay} />
    </section>
  );
}
