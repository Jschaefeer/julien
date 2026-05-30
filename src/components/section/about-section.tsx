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
  Briefcase,
  Calendar,
  GraduationCap,
  Trophy,
  type LucideIcon,
} from "lucide-react";

import { ExpandableDescription } from "@/components/expandable-description";
import BlurFade from "@/components/magicui/blur-fade";
import { DATA } from "@/data/resume";
import { BLUR_FADE_DELAY } from "@/lib/blur-fade";
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
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-md border",
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

export function ExperienceEducationSection() {
  const experienceStartDelay = BLUR_FADE_DELAY * 7;
  const educationStartDelay =
    experienceStartDelay + DATA.experience.length * BLUR_FADE_DELAY + BLUR_FADE_DELAY;
  const sportsStartDelay =
    educationStartDelay + DATA.education.length * BLUR_FADE_DELAY + BLUR_FADE_DELAY;

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
      </SectionGroup>
    </section>
  );
}
