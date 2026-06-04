"use client";

import BlurFade from "@/components/magicui/blur-fade";
import { DATA } from "@/data/resume";
import { BLUR_FADE_DELAY } from "@/lib/blur-fade";
import { getFooterAnimationStep } from "@/lib/footer-animation-step";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function FooterFranklinEyes() {
  return (
    <div className="site-footer__eyes" aria-hidden>
      <div className="site-footer__eyes-media">
        <Image
          src="/footer/franklin-eyes4.jpg"
          alt=""
          fill
          sizes="(max-width: 640px) 94vw, 352px"
          quality={90}
          className="site-footer__eyes-img"
          priority={false}
        />
      </div>
      <div className="site-footer__eyes-vignette" />
    </div>
  );
}

function FooterMarkup() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer mt-24 text-center text-xs space-y-0.5">
      <FooterFranklinEyes />
      <p className="site-footer__copy">
        <span className="site-footer__mark" aria-hidden>
          ©
        </span>{" "}
        {year} Copyright by {DATA.name}
      </p>
      <p className="site-footer__credit">
        Site designed by{" "}
        <a
          href="https://www.buzzedtech.com"
          target="_blank"
          rel="noopener noreferrer"
          className="site-footer__link"
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
