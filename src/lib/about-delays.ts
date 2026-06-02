import { BLUR_FADE_DELAY } from "@/lib/blur-fade";

const HERO_ANIMATION_STEPS = 6;

export function getAboutExperienceStartDelay(baseDelay = BLUR_FADE_DELAY) {
  return baseDelay + BLUR_FADE_DELAY * HERO_ANIMATION_STEPS;
}
