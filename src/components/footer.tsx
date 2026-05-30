"use client";

import BlurFade from "@/components/magicui/blur-fade";
import { DATA } from "@/data/resume";
import { BLUR_FADE_DELAY } from "@/lib/blur-fade";
import { getFooterAnimationStep } from "@/lib/footer-animation-step";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function FooterMarkup() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 text-center text-xs text-muted-foreground/60 space-y-0.5">
      <p>
        © {year} Copyright by {DATA.name}
      </p>
      <p>
        Site designed by{" "}
        <a
          href="https://www.buzzedtech.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-muted-foreground transition-colors"
        >
          Buzzed Tech
        </a>
      </p>
    </footer>
  );
}

function AnimatedFooter({ footerStep }: { footerStep: number | null }) {
  const footer = <FooterMarkup />;

  if (footerStep === null) {
    return footer;
  }

  return <BlurFade delay={BLUR_FADE_DELAY * footerStep}>{footer}</BlurFade>;
}

function ResourcesFooter() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const footerStep = getFooterAnimationStep(pathname, searchParams.get("page"));

  return <AnimatedFooter footerStep={footerStep} />;
}

function StaticRouteFooter() {
  const pathname = usePathname();
  const footerStep = getFooterAnimationStep(pathname);

  return <AnimatedFooter footerStep={footerStep} />;
}

export default function Footer() {
  const pathname = usePathname();

  if (pathname === "/resources") {
    return (
      <Suspense fallback={<StaticRouteFooter />}>
        <ResourcesFooter />
      </Suspense>
    );
  }

  return <StaticRouteFooter />;
}
