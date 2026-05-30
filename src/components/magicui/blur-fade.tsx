"use client";

import { AnimatePresence, motion, useInView, Variants } from "motion/react";
import { useRef } from "react";

import {
  BLUR_FADE_BLUR,
  BLUR_FADE_Y_OFFSET,
  blurFadeTransition,
} from "@/lib/blur-fade";

interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  variant?: {
    hidden: { y: number };
    visible: { y: number };
  };
  duration?: number;
  delay?: number;
  yOffset?: number;
  inView?: boolean;
  inViewMargin?: string;
  blur?: string;
}
const BlurFade = ({
  children,
  className,
  variant,
  duration,
  delay = 0,
  yOffset = BLUR_FADE_Y_OFFSET,
  inView = false,
  inViewMargin = "-50px",
  blur = BLUR_FADE_BLUR,
}: BlurFadeProps) => {
  const ref = useRef(null);
  const inViewResult = useInView(ref, {
    once: true,
    ...(inViewMargin ? { margin: inViewMargin as any } : {})
  });
  const isInView = !inView || inViewResult;
  const defaultVariants: Variants = {
    hidden: { y: -yOffset, opacity: 0, filter: `blur(${blur})` },
    visible: { y: 0, opacity: 1, filter: `blur(0px)` },
  };
  const combinedVariants = variant || defaultVariants;
  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        exit="hidden"
        variants={combinedVariants}
        transition={{
          ...blurFadeTransition(delay),
          ...(duration !== undefined ? { duration } : {}),
        }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default BlurFade;
