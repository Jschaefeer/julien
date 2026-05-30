"use client";

import { useState } from "react";
import { Dock, DockIcon } from "@/components/magicui/dock";
import { ModeToggle } from "@/components/mode-toggle";
import { Icons } from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { DATA } from "@/data/resume";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "motion/react";
import { Instagram, MailIcon, UserIcon, XIcon } from "lucide-react";

const SOCIAL_LINKS = [
  {
    href: DATA.contact.instagram,
    icon: Instagram,
    label: "Instagram",
  },
  {
    href: DATA.contact.linkedin,
    icon: Icons.linkedin,
    label: "LinkedIn",
  },
  {
    href: `mailto:${DATA.contact.email}`,
    icon: MailIcon,
    label: "Email",
  },
] as const;

const SMOOTH_EASE = [0.32, 0.72, 0, 1] as const;

const LAYOUT_SPRING = {
  type: "spring" as const,
  stiffness: 360,
  damping: 36,
  mass: 0.95,
};

const FADE = {
  duration: 0.3,
  ease: SMOOTH_EASE,
};

const ICON_SLOT = 40;
const GAP = 8;
const SEPARATOR_WIDTH = 1;

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

function DockIconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <NavTooltip label={label}>
      <button type="button" onClick={onClick}>
        <DockIcon className="rounded-3xl cursor-pointer size-full bg-background p-0 text-muted-foreground can-hover:hover:text-foreground can-hover:hover:bg-muted backdrop-blur-3xl border border-border can-hover:transition-colors">
          {children}
        </DockIcon>
      </button>
    </NavTooltip>
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

function CollapsibleSlot({
  show,
  width = ICON_SLOT,
  reducedMotion,
  children,
}: {
  show: boolean;
  width?: number;
  reducedMotion: boolean | null;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      layout
      initial={false}
      animate={{
        width: show ? width : 0,
        opacity: show ? 1 : 0,
        marginRight: show ? 0 : -GAP,
      }}
      transition={{
        layout: LAYOUT_SPRING,
        width: LAYOUT_SPRING,
        opacity: reducedMotion ? { duration: 0.12 } : FADE,
        marginRight: LAYOUT_SPRING,
      }}
      className={cn("shrink-0 flex items-end", show ? "overflow-visible" : "overflow-hidden")}
      style={{ pointerEvents: show ? "auto" : "none" }}
    >
      <div style={{ width }} className="flex h-10 items-end justify-center overflow-visible">
        {children}
      </div>
    </motion.div>
  );
}

function NavSeparator({
  show,
  reducedMotion,
}: {
  show: boolean;
  reducedMotion: boolean | null;
}) {
  return (
    <CollapsibleSlot
      show={show}
      width={SEPARATOR_WIDTH}
      reducedMotion={reducedMotion}
    >
      <div className="flex h-10 items-end">
        <Separator orientation="vertical" className="h-2/3 w-px bg-border" />
      </div>
    </CollapsibleSlot>
  );
}

function NavToggle({
  open,
  onOpen,
  onClose,
  reducedMotion,
}: {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  reducedMotion: boolean | null;
}) {
  return (
    <DockIconButton
      label={open ? "Back" : "Contact"}
      onClick={open ? onClose : onOpen}
    >
      <span className="relative block size-full">
        <AnimatePresence mode="sync" initial={false}>
          {open ? (
            <motion.span
              key="close"
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={reducedMotion ? { duration: 0.1 } : FADE}
            >
              <XIcon className="size-full rounded-sm object-contain" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={reducedMotion ? { duration: 0.1 } : FADE}
            >
              <UserIcon className="size-full rounded-sm object-contain" />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </DockIconButton>
  );
}

export default function Navbar() {
  const [showSocial, setShowSocial] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const mainNavLinks = DATA.navbar.filter((item) => item.href !== "#");

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-30">
      <LayoutGroup id="navbar-dock">
        <Dock className="z-50 pointer-events-auto relative h-14 items-end p-2 w-fit mx-auto flex overflow-visible border bg-card/90 backdrop-blur-3xl shadow-[0_0_10px_3px] shadow-primary/5">
          <motion.div
            layout
            transition={{ layout: LAYOUT_SPRING }}
            className="flex items-end gap-2 overflow-visible"
          >
            {mainNavLinks.map((item) => {
              const isExternal = item.href.startsWith("http");
              return (
                <CollapsibleSlot
                  key={item.label}
                  show={!showSocial}
                  reducedMotion={prefersReducedMotion}
                >
                  <DockIconLink
                    href={item.href}
                    label={item.label}
                    external={isExternal}
                  >
                    <item.icon className="size-full rounded-sm object-contain" />
                  </DockIconLink>
                </CollapsibleSlot>
              );
            })}

            {SOCIAL_LINKS.map((item) => (
              <CollapsibleSlot
                key={item.label}
                show={showSocial}
                reducedMotion={prefersReducedMotion}
              >
                <DockIconLink
                  href={item.href}
                  label={item.label}
                  external={item.href.startsWith("http")}
                >
                  <item.icon className="size-full rounded-sm object-contain" />
                </DockIconLink>
              </CollapsibleSlot>
            ))}

            <NavSeparator show={showSocial} reducedMotion={prefersReducedMotion} />

            <CollapsibleSlot show reducedMotion={prefersReducedMotion}>
              <NavToggle
                open={showSocial}
                onOpen={() => setShowSocial(true)}
                onClose={() => setShowSocial(false)}
                reducedMotion={prefersReducedMotion}
              />
            </CollapsibleSlot>

            <NavSeparator show={!showSocial} reducedMotion={prefersReducedMotion} />

            <CollapsibleSlot show={!showSocial} reducedMotion={prefersReducedMotion}>
              <NavTooltip label="Theme">
                <DockIcon className="rounded-3xl cursor-pointer size-full bg-background p-0 text-muted-foreground can-hover:hover:text-foreground can-hover:hover:bg-muted backdrop-blur-3xl border border-border can-hover:transition-colors">
                  <ModeToggle className="size-full cursor-pointer" />
                </DockIcon>
              </NavTooltip>
            </CollapsibleSlot>
          </motion.div>
        </Dock>
      </LayoutGroup>
    </div>
  );
}
