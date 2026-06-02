"use client";

import Image from "next/image";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type Transition,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { NIL_PILLARS } from "@/data/pillars";
import { cn } from "@/lib/utils";

const ALBUM_ARCH = [
  { rotate: -15, x: 0, y: 10 },
  { rotate: -7.5, x: 9, y: 4 },
  { rotate: 0, x: 18, y: 0 },
  { rotate: 7.5, x: 27, y: 4 },
  { rotate: 15, x: 36, y: 10 },
] as const;

const CENTER_SLOT = 2;
const CENTER_X = ALBUM_ARCH[CENTER_SLOT].x;
const ROTATE_INTERVAL_MS = 4200;
const AUTO_ROTATE_DURATION = 0.72;

const dealSpring: Transition = {
  type: "spring",
  stiffness: 160,
  damping: 21,
  mass: 1.05,
};

const liftTween: Transition = {
  type: "tween",
  duration: 0.09,
  ease: [0.22, 1, 0.36, 1],
};

const dropTween: Transition = {
  type: "tween",
  duration: 0.045,
  ease: [0.4, 0, 0.6, 1],
};

const autoRotateTween: Transition = {
  type: "tween",
  duration: AUTO_ROTATE_DURATION,
  ease: [0.45, 0.05, 0.2, 1],
};

const CARD_SIZE = 52;
const CARD_SIZE_SM = 60;

function slotFromPointerX(x: number, cardSize: number) {
  let best = 0;
  let min = Number.POSITIVE_INFINITY;

  for (let i = 0; i < ALBUM_ARCH.length; i++) {
    const center = ALBUM_ARCH[i].x + cardSize / 2;
    const dist = Math.abs(x - center);
    if (dist < min) {
      min = dist;
      best = i;
    }
  }

  return best;
}

function isWrapMove(fromSlot: number, toSlot: number) {
  return fromSlot === ALBUM_ARCH.length - 1 && toSlot === 0;
}

/** Smooth 0→1 falloff as a card nears the center slot. */
function centerProximity(x: number) {
  const dist = Math.abs(x - CENTER_X);
  if (dist >= 14) {
    return 0;
  }

  const t = 1 - dist / 14;
  return t * t * (3 - 2 * t);
}

/** Continuous depth from fan position — no integer z-index steps. */
function depthFromXY(x: number, y: number, tieBreak: number) {
  const xDist = Math.abs(x - CENTER_X);
  const xDepth = (18 - xDist) * 1.35;
  const yDepth = (10 - y) * 1.15;
  return xDepth + yDepth + tieBreak * 0.02;
}

function moveKeyframes(fromSlot: number, toSlot: number) {
  const from = ALBUM_ARCH[fromSlot];
  const to = ALBUM_ARCH[toSlot];

  if (isWrapMove(fromSlot, toSlot)) {
    return {
      x: [from.x, 18, to.x] as [number, number, number],
      y: [from.y, 20, to.y] as [number, number, number],
      rotate: [from.rotate, 0, to.rotate] as [number, number, number],
      scale: [1, 0.96, 1] as [number, number, number],
      opacity: [1, 1, 1] as [number, number, number],
      wrap: true,
    };
  }

  if (toSlot === CENTER_SLOT) {
    return {
      x: [from.x, to.x] as [number, number],
      y: [from.y, from.y, to.y] as [number, number, number],
      rotate: [from.rotate, to.rotate] as [number, number],
      scale: [1, 1] as [number, number],
      opacity: [1, 1] as [number, number],
      yTimes: [0, 0.82, 1] as [number, number, number],
      wrap: false,
    };
  }

  if (fromSlot === CENTER_SLOT) {
    return {
      x: [from.x, to.x] as [number, number],
      y: [from.y, to.y, to.y] as [number, number, number],
      rotate: [from.rotate, to.rotate] as [number, number],
      scale: [1, 1] as [number, number],
      opacity: [1, 1] as [number, number],
      yTimes: [0, 0.28, 1] as [number, number, number],
      wrap: false,
    };
  }

  return {
    x: [from.x, to.x] as [number, number],
    y: [from.y, to.y] as [number, number],
    rotate: [from.rotate, to.rotate] as [number, number],
    scale: [1, 1] as [number, number],
    opacity: [1, 1] as [number, number],
    wrap: false,
  };
}

function cardTransition(
  focused: boolean,
  picking: boolean,
  introDone: boolean,
  index: number,
): Transition {
  if (!introDone) {
    return { ...dealSpring, delay: index * 0.07 };
  }

  if (focused) {
    return liftTween;
  }

  if (picking) {
    return dropTween;
  }

  return autoRotateTween;
}

function moveTransitionFor(keys: ReturnType<typeof moveKeyframes>) {
  const wrapTimes = [0, 0.42, 1] as const;

  if (keys.wrap) {
    return {
      x: { ...autoRotateTween, times: [...wrapTimes] },
      y: { ...autoRotateTween, times: [...wrapTimes] },
      rotate: { ...autoRotateTween, times: [...wrapTimes] },
      scale: { ...autoRotateTween, times: [...wrapTimes] },
    };
  }

  if ("yTimes" in keys) {
    return {
      x: autoRotateTween,
      rotate: autoRotateTween,
      scale: autoRotateTween,
      opacity: autoRotateTween,
      y: { ...autoRotateTween, times: keys.yTimes },
    };
  }

  return autoRotateTween;
}

function rotateOrder(order: number[]) {
  return Array.from(
    { length: order.length },
    (_, slot) => order[(slot + 1) % order.length],
  );
}

type MoveKeyframes = ReturnType<typeof moveKeyframes>;

type FanAvatarCardProps = {
  pillar: (typeof NIL_PILLARS)[number];
  pillarIndex: number;
  slot: number;
  moving: boolean;
  keys: MoveKeyframes | null;
  focused: boolean;
  introDone: boolean;
  picking: boolean;
  prefersReducedMotion: boolean;
  onRotateComplete: () => void;
};

function FanAvatarCard({
  pillar,
  pillarIndex,
  slot,
  moving,
  keys,
  focused,
  introDone,
  picking,
  prefersReducedMotion,
  onRotateComplete,
}: FanAvatarCardProps) {
  const arch = ALBUM_ARCH[slot];
  const x = useMotionValue<number>(arch.x);
  const y = useMotionValue<number>(arch.y);
  const depth = useTransform([x, y], ([xv, yv]: number[]) =>
    depthFromXY(xv, yv, pillarIndex),
  );
  const centerGlow = useTransform(x, (xv) =>
    picking || focused ? 0 : centerProximity(xv),
  );
  const introStartedRef = useRef(false);
  const wasFocusedRef = useRef(false);
  const moveTransition = keys ? moveTransitionFor(keys) : autoRotateTween;
  const restTransition = cardTransition(
    focused,
    picking,
    introDone,
    pillarIndex,
  );

  useEffect(() => {
    if (prefersReducedMotion) {
      x.set(arch.x);
      y.set(arch.y);
      return;
    }

    if (!introStartedRef.current) {
      introStartedRef.current = true;
      x.set(18);
      y.set(32);
      const xControls = animate(x, arch.x, {
        ...dealSpring,
        delay: pillarIndex * 0.07,
      });
      const yControls = animate(y, arch.y, {
        ...dealSpring,
        delay: pillarIndex * 0.07,
      });
      return () => {
        xControls.stop();
        yControls.stop();
      };
    }

    if (!introDone) {
      return;
    }

    if (focused) {
      wasFocusedRef.current = true;
      const xControls = animate(x, arch.x, liftTween);
      const yControls = animate(y, arch.y - 22, liftTween);
      return () => {
        xControls.stop();
        yControls.stop();
      };
    }

    if (moving && keys) {
      const xTransition =
        typeof moveTransition === "object" && "x" in moveTransition
          ? moveTransition.x
          : moveTransition;
      const yTransition =
        typeof moveTransition === "object" && "y" in moveTransition
          ? moveTransition.y
          : moveTransition;

      const xControls = animate(x, keys.x, xTransition);
      const yControls = animate(y, keys.y, yTransition);
      xControls.then(onRotateComplete);

      return () => {
        xControls.stop();
        yControls.stop();
      };
    }

    if (wasFocusedRef.current) {
      wasFocusedRef.current = false;
      const yControls = animate(y, arch.y, dropTween);
      return () => yControls.stop();
    }

    if (introDone && !moving) {
      y.set(arch.y);
    }
  }, [
    arch.x,
    arch.y,
    focused,
    introDone,
    keys,
    moveTransition,
    moving,
    onRotateComplete,
    pillarIndex,
    prefersReducedMotion,
    x,
    y,
  ]);

  return (
    <motion.div
      className="absolute top-0 left-0 origin-[50%_100%]"
      style={{
        x,
        y,
        z: focused ? 72 : depth,
        zIndex: focused ? 100 : 1,
        transformStyle: "preserve-3d",
      }}
      initial={
        prefersReducedMotion || introDone
          ? false
          : {
              y: 32,
              rotate: -4 + pillarIndex * 2,
              scale: 0.84,
              opacity: 0,
            }
      }
      animate={
        prefersReducedMotion
          ? {
              rotate: arch.rotate,
              rotateX: 0,
              scale: 1,
              opacity: 1,
            }
          : focused
            ? {
                rotate: arch.rotate,
                rotateX: -11,
                scale: 1.15,
                opacity: 1,
              }
            : moving && keys
              ? {
                  rotate: keys.rotate,
                  rotateX: 0,
                  scale: keys.scale,
                  opacity: keys.opacity,
                }
              : {
                  rotate: arch.rotate,
                  rotateX: 0,
                  scale: 1,
                  opacity: 1,
                }
      }
      transition={
        moving && keys
          ? moveTransition
          : !introDone
            ? { ...dealSpring, delay: pillarIndex * 0.07 }
            : restTransition
      }
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-xl border border-[oklch(0.922_0_0/0.8)] bg-white",
          "size-[3.25rem] shadow-sm sm:size-[3.75rem] dark:shadow-lg",
          focused &&
            "border-[oklch(0.145_0_0/0.2)] shadow-[0_10px_20px_-8px_rgba(0,0,0,0.22)] dark:shadow-[0_22px_44px_-14px_rgba(0,0,0,0.8)]",
        )}
      >
        <Image
          src={pillar.src}
          alt={pillar.title}
          fill
          sizes="60px"
          className="object-contain p-0.5"
          draggable={false}
        />
        {!focused && (
          <>
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-xl border border-[oklch(0.145_0_0/0.15)]"
              style={{ opacity: centerGlow }}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-xl shadow-[0_6px_14px_-6px_rgba(0,0,0,0.14)] dark:shadow-[0_18px_36px_-12px_rgba(0,0,0,0.35)]"
              style={{ opacity: centerGlow }}
            />
          </>
        )}
      </div>
    </motion.div>
  );
}

type PillarFanAvatarsProps = {
  className?: string;
};

export function PillarFanAvatars({ className }: PillarFanAvatarsProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const orderRef = useRef(NIL_PILLARS.map((_, index) => index));
  const pendingOrderRef = useRef<number[] | null>(null);
  const rotateDoneRef = useRef(0);
  const [focusedPillar, setFocusedPillar] = useState<number | null>(null);
  const [introDone, setIntroDone] = useState(false);
  const [order, setOrder] = useState(() => NIL_PILLARS.map((_, index) => index));
  const [pendingOrder, setPendingOrder] = useState<number[] | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const picking = focusedPillar !== null;

  orderRef.current = order;
  pendingOrderRef.current = pendingOrder;

  const commitRotate = useCallback(() => {
    const next = pendingOrderRef.current;
    if (!next) {
      return;
    }

    setOrder(next);
    setPendingOrder(null);
    rotateDoneRef.current = 0;
  }, []);

  const handleRotateComplete = useCallback(() => {
    if (!pendingOrderRef.current) {
      return;
    }

    rotateDoneRef.current += 1;
    if (rotateDoneRef.current >= NIL_PILLARS.length) {
      commitRotate();
    }
  }, [commitRotate]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setIntroDone(true);
      return;
    }

    const timer = window.setTimeout(() => setIntroDone(true), 650);
    return () => window.clearTimeout(timer);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion || !introDone || picking) {
      return;
    }

    const interval = window.setInterval(() => {
      if (pendingOrderRef.current) {
        return;
      }

      rotateDoneRef.current = 0;
      setPendingOrder(rotateOrder(orderRef.current));
    }, ROTATE_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [prefersReducedMotion, introDone, picking]);

  const updateFocusFromEvent = useCallback((clientX: number) => {
    const track = trackRef.current;
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const x = clientX - rect.left;
    const cardSize = window.matchMedia("(min-width: 640px)").matches
      ? CARD_SIZE_SM
      : CARD_SIZE;
    const slot = slotFromPointerX(x, cardSize);

    setFocusedPillar(orderRef.current[slot] ?? null);
  }, []);

  return (
    <div
      className={cn(
        "relative w-[5.75rem] shrink-0 overflow-visible sm:w-[6.75rem]",
        className,
      )}
      aria-label="Five pillars of NIL money management"
    >
      <div
        ref={trackRef}
        className="relative -mx-4 -my-3 px-4 py-3"
        onMouseEnter={(event) => updateFocusFromEvent(event.clientX)}
        onMouseMove={(event) => updateFocusFromEvent(event.clientX)}
        onMouseLeave={() => setFocusedPillar(null)}
      >
        <div
          className="pointer-events-none relative h-[3.75rem] overflow-visible sm:h-[4.25rem]"
          style={{ perspective: 640, transformStyle: "preserve-3d" }}
        >
          {NIL_PILLARS.map((pillar, pillarIndex) => {
            const slot = order.indexOf(pillarIndex);
            const targetSlot = pendingOrder?.indexOf(pillarIndex) ?? slot;
            const rotating = pendingOrder !== null;
            const moving = rotating && slot !== targetSlot;
            const keys = moving ? moveKeyframes(slot, targetSlot) : null;
            const focused = focusedPillar === pillarIndex;

            return (
              <FanAvatarCard
                key={pillar.id}
                pillar={pillar}
                pillarIndex={pillarIndex}
                slot={slot}
                moving={moving}
                keys={keys}
                focused={focused}
                introDone={introDone}
                picking={picking}
                prefersReducedMotion={!!prefersReducedMotion}
                onRotateComplete={handleRotateComplete}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
