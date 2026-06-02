"use client";

import { Dock, DockIcon } from "@/components/magicui/dock";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DATA } from "@/data/resume";
import { LayoutGroup, motion } from "motion/react";

const LAYOUT_SPRING = {
  type: "spring" as const,
  stiffness: 360,
  damping: 36,
  mass: 0.95,
};

function NavTooltip({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        side="top"
        sideOffset={8}
        className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]"
      >
        <p>{label}</p>
        <TooltipArrow className="fill-primary" />
      </TooltipContent>
    </Tooltip>
  );
}

function DockIconLink({
  href,
  label,
  external,
  children,
}: {
  href: string;
  label: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  return (
    <NavTooltip label={label}>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        <DockIcon className="rounded-3xl cursor-pointer size-full bg-background p-0 text-muted-foreground can-hover:hover:text-foreground can-hover:hover:bg-muted backdrop-blur-3xl border border-border can-hover:transition-colors">
          {children}
        </DockIcon>
      </a>
    </NavTooltip>
  );
}

export default function Navbar() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-30">
      <LayoutGroup id="navbar-dock">
        <Dock className="z-50 pointer-events-auto relative h-14 items-end p-2 w-fit mx-auto flex overflow-visible border bg-card/90 backdrop-blur-3xl shadow-[0_0_10px_3px] shadow-primary/5">
          <motion.div
            layout
            transition={{ layout: LAYOUT_SPRING }}
            className="flex items-end gap-2 overflow-visible"
          >
            {DATA.navbar.map((item) => {
              const isExternal = item.href.startsWith("http");
              return (
                <DockIconLink
                  key={item.label}
                  href={item.href}
                  label={item.label}
                  external={isExternal}
                >
                  <item.icon className="size-full rounded-sm object-contain" />
                </DockIconLink>
              );
            })}

          </motion.div>
        </Dock>
      </LayoutGroup>
    </div>
  );
}
