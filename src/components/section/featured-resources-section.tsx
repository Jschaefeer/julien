import BlurFade from "@/components/magicui/blur-fade";
import { FileCabinet } from "@/components/file-cabinet";
import {
  SectionBlock,
  SectionContent,
  SectionHeading,
} from "@/components/section/section-block";

const BLUR_FADE_DELAY = 0.04;

export default function FeaturedResourcesSection() {
  return (
    <SectionBlock id="resources">
      <BlurFade delay={BLUR_FADE_DELAY * 5}>
        <SectionHeading>Featured Resources</SectionHeading>
      </BlurFade>

      <BlurFade delay={BLUR_FADE_DELAY * 6}>
        <SectionContent>
          <FileCabinet />
        </SectionContent>
      </BlurFade>
    </SectionBlock>
  );
}
