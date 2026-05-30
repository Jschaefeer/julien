import type { ReactNode } from "react";
import { BrandLogo } from "@/components/mdx/brand-logo";

type BrandHeadingProps = {
  logo: string;
  children: ReactNode;
};

export function BrandHeading({ logo, children }: BrandHeadingProps) {
  return (
    <h4 className="not-prose flex items-center gap-2.5 text-base font-medium tracking-tight leading-tight mt-6 mb-2 text-foreground">
      <BrandLogo logo={logo} />
      <span>{children}</span>
    </h4>
  );
}
