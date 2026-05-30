import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import ExpandableAvatar from "@/components/expandable-avatar";
import { JsonLd } from "@/components/json-ld";
import { Badge } from "@/components/ui/badge";
import { DATA } from "@/data/resume";
import {
  AboutIntroSection,
  ExperienceEducationSection,
} from "@/components/section/about-section";
import FeaturedResourcesSection from "@/components/section/featured-resources-section";
import { BLUR_FADE_DELAY } from "@/lib/blur-fade";
import { createWebsiteJsonLd } from "@/lib/seo";

export default function Page() {
  return (
    <main className="flex flex-col gap-section relative">
      <JsonLd data={createWebsiteJsonLd()} />
      <section id="hero">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <div className="flex flex-row items-start justify-between gap-3 md:gap-4">
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <BlurFade delay={BLUR_FADE_DELAY}>
                <h1 className="text-3xl font-semibold tracking-tighter sm:text-4xl lg:text-5xl">
                  {DATA.name}
                </h1>
              </BlurFade>
              <BlurFade delay={BLUR_FADE_DELAY * 2}>
                <div className="flex flex-wrap gap-2">
                  {DATA.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </BlurFade>
              <BlurFadeText
                className="text-muted-foreground max-w-[600px] md:text-lg lg:text-xl"
                delay={BLUR_FADE_DELAY * 3}
                text={DATA.description}
              />
            </div>
            <BlurFade delay={BLUR_FADE_DELAY} className="shrink-0">
              <ExpandableAvatar
                alt={DATA.name}
                srcs={DATA.avatarUrls}
                initials={DATA.initials}
              />
            </BlurFade>
          </div>
        </div>
      </section>

      <AboutIntroSection />

      <FeaturedResourcesSection />

      <ExperienceEducationSection />
    </main>
  );
}
