export const BLUR_FADE_DELAY = 0.04;
export const BLUR_FADE_DURATION = 0.4;
export const BLUR_FADE_Y_OFFSET = 6;
export const BLUR_FADE_BLUR = "6px";
export const BLUR_FADE_EASE = "easeOut" as const;

export function blurFadeTransition(delay = 0) {
  return {
    delay: BLUR_FADE_DELAY + delay,
    duration: BLUR_FADE_DURATION,
    ease: BLUR_FADE_EASE,
  };
}

export const BLUR_FADE_ENTER_EASE = [0.22, 1, 0.36, 1] as const;

export function blurFadeEnterTransition() {
  return {
    opacity: { duration: 0.5, ease: BLUR_FADE_ENTER_EASE },
    y: { duration: 0.5, ease: BLUR_FADE_ENTER_EASE },
    filter: { duration: 0.32, ease: "linear" as const },
  };
}

export const blurFadeExit = {
  opacity: 0,
  y: 4,
  filter: "blur(0px)",
} as const;

export function blurFadeExitTransition() {
  return {
    duration: 0.16,
    ease: [0.4, 0, 1, 1] as const,
  };
}

export const blurFadeHidden = {
  y: -BLUR_FADE_Y_OFFSET,
  opacity: 0,
  filter: `blur(${BLUR_FADE_BLUR})`,
} as const;

export const blurFadeVisible = {
  y: 0,
  opacity: 1,
  filter: "blur(0px)",
} as const;

export const layoutSpring = {
  type: "spring" as const,
  stiffness: 420,
  damping: 38,
  mass: 0.85,
};

export function layoutTransition(reducedMotion = false) {
  return reducedMotion
    ? { layout: { duration: 0.15, ease: BLUR_FADE_EASE } }
    : { layout: layoutSpring };
}
