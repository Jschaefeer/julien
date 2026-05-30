/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";
import {
  isCardLogo,
  logoContainerClass,
  logoImgClass,
  logoPadding,
  logoSrc,
} from "@/components/mdx/brand-logo-config";

type BrandLogoProps = {
  logo: string;
  size?: "sm" | "md";
  className?: string;
};

const cardSizeClass = {
  sm: "h-8 aspect-[960/608]",
  md: "h-10 aspect-[960/608]",
} as const;

export function BrandLogo({ logo, size = "md", className }: BrandLogoProps) {
  const isCard = isCardLogo(logo);
  const sizeClass = isCard
    ? cardSizeClass[size]
    : size === "sm"
      ? "size-6"
      : "size-8";
  return (
    <span
      className={cn(
        "brand-logo not-prose inline-flex shrink-0 align-middle",
        isCard
          ? "overflow-hidden rounded-[2px]"
          : "items-center justify-center overflow-hidden rounded-md border border-border bg-white p-1.5 shadow-sm",
        sizeClass,
        logoContainerClass[logo],
        !isCard && (logoPadding[logo] ?? "p-1.5"),
        className
      )}
    >
      <img
        src={logoSrc[logo] ?? `/logos/${logo}.svg`}
        alt=""
        aria-hidden
        className={cn(
          "block max-w-none",
          isCard
            ? "size-full object-cover object-center"
            : "size-full object-contain object-center",
          logoImgClass[logo]
        )}
      />
    </span>
  );
}
