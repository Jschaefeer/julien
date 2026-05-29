/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BrandHeadingProps = {
  logo: string;
  children: ReactNode;
};

const logoPadding: Record<string, string> = {
  americanexpress: "p-0",
  bankofamerica: "p-0.5",
  fidelity: "p-0.5",
  marcus: "p-0",
  robinhood: "p-1.5",
  wealthfront: "p-1.5",
};

const logoContainerClass: Record<string, string> = {
  coinbase: "border-[#0052FF] bg-[#0052FF] p-0 shadow-none rounded-sm",
  marcus: "border-[#7399C6] bg-[#7399C6] p-0 shadow-none rounded-sm",
  robinhood: "border-[#00C805] bg-[#00C805] shadow-none rounded-sm",
};

const logoSrc: Record<string, string> = {
  americanexpress: "/logos/americanexpress.png",
  marcus: "/logos/marcus.png",
};

const logoImgClass: Record<string, string> = {
  marcus: "object-cover object-center",
};

export function BrandHeading({ logo, children }: BrandHeadingProps) {
  return (
    <h4 className="not-prose flex items-center gap-2.5 text-base font-medium tracking-tight leading-tight mt-6 mb-2 text-foreground">
      <span
        className={cn(
          "brand-logo inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-white shadow-sm",
          logoPadding[logo] ?? "p-1.5",
          logoContainerClass[logo]
        )}
      >
        <img
          src={logoSrc[logo] ?? `/logos/${logo}.svg`}
          alt=""
          aria-hidden
          width={32}
          height={32}
          className={cn(
            "block size-full max-w-none object-contain object-center",
            logoImgClass[logo]
          )}
        />
      </span>
      <span>{children}</span>
    </h4>
  );
}
