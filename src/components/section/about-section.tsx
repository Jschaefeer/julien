"use client";

import type { ReactNode } from "react";
import Markdown from "react-markdown";
import {
  SectionBlock,
  SectionContent,
  SectionGroup,
  SectionHeading,
} from "@/components/section/section-block";
import {
  ArrowUpRight,
  Briefcase,
  Calendar,
  GraduationCap,
  Instagram,
  MailIcon,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { Icons } from "@/components/icons";

import { ExpandableDescription } from "@/components/expandable-description";
import ExpandableAvatar from "@/components/expandable-avatar";
import BlurFade from "@/components/magicui/blur-fade";
import { Badge } from "@/components/ui/badge";
import { DATA } from "@/data/resume";
import { BLUR_FADE_DELAY } from "@/lib/blur-fade";
import { accentIcon } from "@/lib/accent-classes";
import { cn } from "@/lib/utils";

function MetaItem({
  icon: Icon,
  children,
}: {
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
      <Icon className="size-3.5 shrink-0" aria-hidden />
      {children}
    </span>
  );
}

function EntryLogo({
  src,
  alt,
  fallbackIcon: FallbackIcon,
  wide,
  fillColor,
  className,
  imageClassName,
}: {
  src?: string;
  alt: string;
  fallbackIcon: LucideIcon;
  wide?: boolean;
  fillColor?: string;
  className?: string;
  imageClassName?: string;
}) {
  const fill = Boolean(fillColor);

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl border",
        wide ? "h-10 w-[5.5rem]" : "size-10",
        fill
          ? "p-0 shadow-none"
          : "border-border bg-white p-0 shadow-sm dark:bg-card",
        className
      )}
      style={
        fill
          ? { backgroundColor: fillColor, borderColor: fillColor }
          : undefined
      }
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          aria-hidden
          width={40}
          height={40}
          className={cn(
            "size-full",
            imageClassName ?? (fill ? "object-cover" : "object-contain p-1.5")
          )}
        />
      ) : (
        <FallbackIcon className="size-5 text-muted-foreground" aria-hidden />
      )}
    </span>
  );
}

function ExperienceEntry({
  role,
  company,
  employmentType,
  start,
  end,
  description,
  logo,
  logoFill,
  delay,
}: (typeof DATA.experience)[number] & { delay: number }) {
  return (
    <BlurFade delay={delay}>
      <article className="flex gap-3 sm:gap-4">
        <EntryLogo
          src={logo}
          alt={company}
          fallbackIcon={Briefcase}
          fillColor={logoFill}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="space-y-0.5">
            <h4 className="font-semibold leading-snug tracking-tight">
              {role}
            </h4>
            <p className="text-sm text-muted-foreground">
              {company}
              {employmentType ? (
                <>
                  <span aria-hidden> · </span>
                  {employmentType}
                </>
              ) : null}
            </p>
          </div>
          <MetaItem icon={Calendar}>
            {start} – {end}
          </MetaItem>
          <ExpandableDescription text={description} />
        </div>
      </article>
    </BlurFade>
  );
}

function EducationEntry({
  school,
  degree,
  start,
  end,
  logo,
  logoFill,
  delay,
}: (typeof DATA.education)[number] & { delay: number }) {
  return (
    <BlurFade delay={delay}>
      <article className="flex gap-3 sm:gap-4">
        <EntryLogo
          src={logo}
          alt={school}
          fallbackIcon={GraduationCap}
          fillColor={logoFill}
          className={
            logo ? undefined : "bg-[#881c1c]/10 p-1.5 dark:bg-[#881c1c]/20"
          }
        />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="space-y-0.5">
            <h4 className="font-semibold leading-snug tracking-tight">
              {school}
            </h4>
            <p className="text-sm text-muted-foreground">{degree}</p>
          </div>
          <MetaItem icon={Calendar}>
            {start} – {end}
          </MetaItem>
        </div>
      </article>
    </BlurFade>
  );
}

function SportsEntry({
  name,
  detail,
  logo,
  logoFill,
  logoClassName,
  logoImageClassName,
  delay,
}: {
  name: string;
  detail: string;
  logo: string;
  logoFill?: string;
  logoClassName?: string;
  logoImageClassName?: string;
  delay: number;
}) {
  return (
    <BlurFade delay={delay}>
      <article className="flex gap-3 sm:gap-4">
        <EntryLogo
          src={logo}
          alt={name}
          fallbackIcon={Trophy}
          fillColor={logoFill}
          className={logoClassName}
          imageClassName={logoImageClassName}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="space-y-0.5">
            <h4 className="font-semibold leading-snug tracking-tight">
              {name}
            </h4>
          </div>
          <MetaItem icon={Calendar}>{detail}</MetaItem>
        </div>
      </article>
    </BlurFade>
  );
}

const CONTACT_LINKS = [
  {
    href: DATA.contact.instagram,
    icon: Instagram,
    label: "Instagram",
    external: true,
  },
  {
    href: DATA.contact.linkedin,
    icon: Icons.linkedin,
    label: "LinkedIn",
    external: true,
  },
  {
    href: `mailto:${DATA.contact.email}`,
    icon: MailIcon,
    label: "Email",
    external: false,
  },
] as const;

function ContactLinks({
  baseDelay,
  compact = false,
}: {
  baseDelay: number;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {CONTACT_LINKS.map((link, index) => (
          <BlurFade
            key={link.label}
            delay={baseDelay + index * BLUR_FADE_DELAY}
          >
            <a
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="group inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium transition-colors can-hover:hover:bg-muted/50 can-hover:hover:text-money-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <link.icon className={cn("size-4", accentIcon)} />
              {link.label}
            </a>
          </BlurFade>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-4">
      {CONTACT_LINKS.map((link, index) => (
        <BlurFade
          key={link.label}
          delay={baseDelay + (index + 1) * BLUR_FADE_DELAY}
        >
          <a
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            className="group flex items-center gap-3 rounded-xl border border-border p-4 transition-colors can-hover:hover:bg-muted/50 can-hover:hover:text-money-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <link.icon className={cn("size-4", accentIcon)} />
            <span className="font-medium">{link.label}</span>
          </a>
        </BlurFade>
      ))}
    </div>
  );
}

export function AboutPageHero({ baseDelay }: { baseDelay: number }) {
  const bioDelay = baseDelay + BLUR_FADE_DELAY * 2;
  const contactDelay = baseDelay + BLUR_FADE_DELAY * 3;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6 md:gap-8">
        <BlurFade delay={baseDelay} className="shrink-0 self-start sm:order-2">
          <ExpandableAvatar
            alt={DATA.name}
            srcs={DATA.avatarUrls}
            initials={DATA.initials}
            className="size-28 sm:size-40 md:size-44"
          />
        </BlurFade>
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:order-1">
          <BlurFade delay={baseDelay}>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">About</p>
              <h1 className="text-3xl font-semibold tracking-tighter sm:text-4xl">
                {DATA.name}
              </h1>
            </div>
          </BlurFade>
          <BlurFade delay={baseDelay + BLUR_FADE_DELAY}>
            <div className="flex flex-wrap gap-2">
              {DATA.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </BlurFade>
          <BlurFade delay={bioDelay}>
            <div className="prose prose-sm max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert">
              <Markdown>{DATA.summary}</Markdown>
            </div>
          </BlurFade>
        </div>
      </div>
      <div id="contact">
        <ContactLinks baseDelay={contactDelay} compact />
      </div>
    </div>
  );
}

export function AboutIntroSection() {
  return (
    <SectionBlock id="about" className="-mt-section-hero-pull">
      <BlurFade delay={BLUR_FADE_DELAY * 3}>
        <SectionHeading>About</SectionHeading>
      </BlurFade>
      <BlurFade delay={BLUR_FADE_DELAY * 4}>
        <SectionContent className="prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert">
          <Markdown>{DATA.summary}</Markdown>
        </SectionContent>
      </BlurFade>
    </SectionBlock>
  );
}

export function AboutContactSection({
  baseDelay,
}: {
  baseDelay: number;
}) {
  return (
    <SectionBlock>
      <BlurFade delay={baseDelay}>
        <SectionHeading>Contact</SectionHeading>
      </BlurFade>
      <SectionContent>
        <ContactLinks baseDelay={baseDelay} />
      </SectionContent>
    </SectionBlock>
  );
}

export function ExperienceEducationSection({
  baseDelay = BLUR_FADE_DELAY,
}: {
  baseDelay?: number;
}) {
  const experienceStartDelay = baseDelay;
  const educationStartDelay =
    experienceStartDelay + DATA.experience.length * BLUR_FADE_DELAY + BLUR_FADE_DELAY;
  const sportsStartDelay =
    educationStartDelay + DATA.education.length * BLUR_FADE_DELAY + BLUR_FADE_DELAY;
  const ctaDelay =
    sportsStartDelay + DATA.sports.length * BLUR_FADE_DELAY + BLUR_FADE_DELAY;

  return (
    <section id="experience">
      <SectionGroup>
        <SectionBlock>
          <BlurFade delay={experienceStartDelay}>
            <SectionHeading>Experience</SectionHeading>
          </BlurFade>
          <SectionContent>
            <div className="flex flex-col gap-y-8">
              {DATA.experience.map((entry, index) => (
                <ExperienceEntry
                  key={`${entry.company}-${entry.role}`}
                  {...entry}
                  delay={experienceStartDelay + (index + 1) * BLUR_FADE_DELAY}
                />
              ))}
            </div>
          </SectionContent>
        </SectionBlock>

        <SectionBlock>
          <BlurFade delay={educationStartDelay}>
            <SectionHeading>Education</SectionHeading>
          </BlurFade>
          <SectionContent>
            <div className="flex flex-col gap-y-8">
              {DATA.education.map((entry, index) => (
                <EducationEntry
                  key={entry.school}
                  {...entry}
                  delay={educationStartDelay + (index + 1) * BLUR_FADE_DELAY}
                />
              ))}
            </div>
          </SectionContent>
        </SectionBlock>

        <SectionBlock>
          <BlurFade delay={sportsStartDelay}>
            <SectionHeading>Sports</SectionHeading>
          </BlurFade>
          <SectionContent>
            <div className="flex flex-col gap-y-8">
              {DATA.sports.map((entry, index) => (
                <SportsEntry
                  key={entry.name}
                  {...entry}
                  delay={sportsStartDelay + (index + 1) * BLUR_FADE_DELAY}
                />
              ))}
            </div>
          </SectionContent>
        </SectionBlock>

        <BlurFade delay={ctaDelay}>
          <div className="flex justify-center pt-2">
            <Link
              href={`/resources/${DATA.featuredContent.slug}`}
              className="group inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium transition-colors can-hover:hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span className="relative inline-flex items-center transition-transform duration-200 ease-out group-hover:-translate-x-1.5">
                Read {DATA.featuredContent.title}
                <ArrowUpRight className="absolute left-[calc(100%+2px)] top-1/2 size-4 -translate-x-2 -translate-y-1/2 opacity-0 transition-all duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100" />
              </span>
            </Link>
          </div>
        </BlurFade>
      </SectionGroup>
    </section>
  );
}
