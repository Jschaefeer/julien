import BlurFade from "@/components/magicui/blur-fade";
import { FeaturedResourceCards } from "@/components/featured-resource-cards";
import { FeaturedHeroCard } from "@/components/featured-hero-card";
import { DATA } from "@/data/resume";

const BLUR_FADE_DELAY = 0.04;

export default function FeaturedResourcesSection() {
  const featured = DATA.featuredContent;

  return (
    <section id="resources">
      <div className="flex min-h-0 flex-col gap-y-6">
        <BlurFade delay={BLUR_FADE_DELAY * 5}>
          <h2 className="text-xl font-bold">Featured Resources</h2>
        </BlurFade>

        <BlurFade delay={BLUR_FADE_DELAY * 6}>
          <FeaturedHeroCard
            href={`/resources/${featured.slug}`}
            title={featured.title}
            label={featured.label}
            description={DATA.description}
            audience={featured.audience}
            pillars={featured.pillars}
            readTime={featured.readTime}
            cost={featured.cost}
          />
        </BlurFade>

        <BlurFade delay={BLUR_FADE_DELAY * 7}>
          <FeaturedResourceCards resources={DATA.featuredResources} />
        </BlurFade>
      </div>
    </section>
  );
}
