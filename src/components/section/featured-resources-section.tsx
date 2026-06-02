import BlurFade from "@/components/magicui/blur-fade";
import { FileCabinet } from "@/components/file-cabinet";
import {
  SectionBlock,
  SectionContent,
  SectionHeading,
} from "@/components/section/section-block";
import { BLUR_FADE_DELAY } from "@/lib/blur-fade";

export default function FeaturedResourcesSection({
  baseDelay = BLUR_FADE_DELAY * 5,
}: {
  baseDelay?: number;
}) {
  return (
    <SectionBlock id="resources">
      <BlurFade delay={baseDelay}>
        <SectionHeading>Featured Resources</SectionHeading>
      </BlurFade>

      <BlurFade delay={baseDelay + BLUR_FADE_DELAY}>
        <SectionContent>
          <FileCabinet />
        </SectionContent>
      </BlurFade>
    </SectionBlock>
  );
}
