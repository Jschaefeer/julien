import BlurFade from "@/components/magicui/blur-fade";
import { FileCabinet } from "@/components/file-cabinet";
import { SectionBlock, SectionContent } from "@/components/section/section-block";
import { featuredSectionHeading } from "@/lib/accent-classes";
import { BLUR_FADE_DELAY } from "@/lib/blur-fade";

export default function FeaturedResourcesSection({
  baseDelay = BLUR_FADE_DELAY * 5,
}: {
  baseDelay?: number;
}) {
  return (
    <SectionBlock id="resources">
      <BlurFade delay={baseDelay}>
        <h2 className={featuredSectionHeading}>Featured Resources</h2>
      </BlurFade>

      <BlurFade delay={baseDelay + BLUR_FADE_DELAY}>
        <SectionContent>
          <FileCabinet />
        </SectionContent>
      </BlurFade>
    </SectionBlock>
  );
}
