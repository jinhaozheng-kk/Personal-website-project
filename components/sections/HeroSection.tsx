"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { PatternBackground } from "@/components/ui/grid-dot-background";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { AgentCircle } from "@/components/visual/AgentCircle";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

const BALL_SIZE = 200;
const REVEAL_RADIUS = 130;

type BurstKind = "wake" | "sleep";
type Burst = { id: number; x: number; y: number; kind: BurstKind };

const BURST_DURATIONS: Record<BurstKind, number> = { wake: 900, sleep: 1400 };

const WAKE_KEYFRAMES = { scale: [0.7, 1.2, 0.95, 1] };
const SLEEP_KEYFRAMES = { scale: [1, 1.1, 0.9, 1] };

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const titleOffset = useRef({ left: 0, top: 0 });
  const titleSize = useRef({ w: 1, h: 1 });
  const awakeRef = useRef(false);
  const insideRef = useRef(false);

  const [hasFinePointer, setHasFinePointer] = useState(false);
  const [awake, setAwake] = useState(false);
  const [bursts, setBursts] = useState<Burst[]>([]);

  const mxLive = useMotionValue(-9999);
  const myLive = useMotionValue(-9999);

  const heroW = useMotionValue(1);
  const heroH = useMotionValue(1);

  const idleX = useMotionValue(0);
  const idleY = useMotionValue(0);

  // Heavier mass + lower stiffness + slightly under-damped: the ball lags the
  // cursor with a tiny over/undershoot — that lag is what reads as "tug."
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const sx = useSpring(targetX, { damping: 22, stiffness: 130, mass: 1.1 });
  const sy = useSpring(targetY, { damping: 22, stiffness: 130, mass: 1.1 });

  const dxFromTitle = useTransform(
    sx,
    (v) => v - (titleOffset.current.left + titleSize.current.w / 2),
  );
  const dyFromTitle = useTransform(
    sy,
    (v) => v - (titleOffset.current.top + titleSize.current.h / 2),
  );

  const intensity = useMotionValue(0);
  const sIntensity = useSpring(intensity, { damping: 26, stiffness: 180, mass: 0.5 });

  // tanh saturates without cliff-clamping, so rotation/translation keep
  // responding past the reference distance instead of pinning at the edge.
  const useSaturated = (
    d: typeof dxFromTitle,
    refSize: typeof heroW,
    ratio: number,
    minRef: number,
    scale: number,
  ) =>
    useTransform([d, sIntensity], ([v, k]: number[]) =>
      Math.tanh(v / Math.max(refSize.get() * ratio, minRef)) * scale * k,
    );

  const tx = useSaturated(dxFromTitle, heroW, 0.2, 200, 22);
  const ty = useSaturated(dyFromTitle, heroH, 0.15, 150, 18);
  const rotX = useSaturated(dyFromTitle, heroH, 0.15, 150, -14);
  const rotY = useSaturated(dxFromTitle, heroW, 0.2, 200, 16);

  // Second-order spring on translate so the text trails the ball by a beat
  // before catching up — that delta reads as the ball tugging the text along.
  // Rotation stays direct so depth feedback is still precise.
  const txLag = useSpring(tx, { stiffness: 200, damping: 20, mass: 0.55 });
  const tyLag = useSpring(ty, { stiffness: 200, damping: 20, mass: 0.55 });

  // Mask-center subtracts the *lagged* translate so the reveal hole stays
  // anchored to the ball as the title trails behind it.
  const localX = useTransform(
    [sx, txLag],
    ([v, t]: number[]) => v - titleOffset.current.left - t,
  );
  const localY = useTransform(
    [sy, tyLag],
    ([v, t]: number[]) => v - titleOffset.current.top - t,
  );

  const englishMask = useMotionTemplate`radial-gradient(circle ${REVEAL_RADIUS}px at ${localX}px ${localY}px, transparent 55%, black 92%)`;
  const chineseMask = useMotionTemplate`radial-gradient(circle ${REVEAL_RADIUS}px at ${localX}px ${localY}px, black 50%, transparent 90%)`;

  const ballX = useTransform(sx, (v) => v - BALL_SIZE / 2);
  const ballY = useTransform(sy, (v) => v - BALL_SIZE / 2);

  const ballControls = useAnimationControls();
  const burstTimeoutsRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    setHasFinePointer(window.matchMedia("(pointer: fine)").matches);
  }, []);

  useEffect(() => {
    awakeRef.current = awake;
  }, [awake]);

  useEffect(() => {
    if (!hasFinePointer) return;
    const el = heroRef.current;
    if (!el) return;

    const computeIdle = () => {
      const heroRect = el.getBoundingClientRect();
      heroW.set(heroRect.width);
      heroH.set(heroRect.height);
      const titleRect = titleRef.current?.getBoundingClientRect();
      if (titleRect) {
        titleOffset.current = {
          left: titleRect.left - heroRect.left,
          top: titleRect.top - heroRect.top,
        };
        titleSize.current = { w: titleRect.width, h: titleRect.height };
      }
      // idle pos: bottom-right of hero, well clear of the (centered) title
      const ix = heroRect.width * 0.82;
      const iy = heroRect.height * 0.78;
      idleX.set(ix);
      idleY.set(iy);
      if (awakeRef.current && insideRef.current) return;
      targetX.set(ix);
      targetY.set(iy);
    };

    // Tracked on document so we always know the cursor position for re-entry,
    // but the ball only chases the cursor while inside the hero — once the
    // cursor leaves, the spring on targetX/Y carries it back to the idle pos.
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      mxLive.set(x);
      myLive.set(y);
      if (awakeRef.current && insideRef.current) {
        targetX.set(x);
        targetY.set(y);
      }
    };

    const onLeave = () => {
      insideRef.current = false;
      intensity.set(0);
      // Spring on targetX/Y carries the ball smoothly back to its idle anchor.
      targetX.set(idleX.get());
      targetY.set(idleY.get());
      // Leaving the hero is treated as disengagement: drop the awake state so
      // the ball resumes floating at idle and the title reveal/mask clear.
      if (awakeRef.current) {
        setAwake(false);
        awakeRef.current = false;
      }
    };

    const onEnter = () => {
      insideRef.current = true;
      if (awakeRef.current) {
        intensity.set(1);
        const x = mxLive.get();
        const y = myLive.get();
        if (x !== -9999) {
          targetX.set(x);
          targetY.set(y);
        }
      }
    };

    const triggerBurst = (x: number, y: number, kind: BurstKind) => {
      const id = Date.now() + Math.random();
      setBursts((b) => [...b, { id, x, y, kind }]);
      const tid = window.setTimeout(() => {
        burstTimeoutsRef.current.delete(tid);
        setBursts((b) => b.filter((it) => it.id !== id));
      }, BURST_DURATIONS[kind]);
      burstTimeoutsRef.current.add(tid);
    };

    const onClick = (e: MouseEvent) => {
      if (e.button !== 0) return;
      const target = e.target as HTMLElement;
      if (target.closest("a,button")) return;

      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;

      if (!awakeRef.current) {
        setAwake(true);
        awakeRef.current = true;
      }
      insideRef.current = true;
      intensity.set(1);
      targetX.set(x);
      targetY.set(y);

      triggerBurst(x, y, "wake");
      ballControls.start({
        ...WAKE_KEYFRAMES,
        transition: { duration: 0.55, ease: "easeOut" },
      });
    };

    const onContextMenu = (e: MouseEvent) => {
      if (!awakeRef.current) return;
      e.preventDefault();
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;

      triggerBurst(x, y, "sleep");
      ballControls.start({
        ...SLEEP_KEYFRAMES,
        transition: { duration: 0.6, ease: "easeOut" },
      });

      setAwake(false);
      awakeRef.current = false;
      intensity.set(0);
      targetX.set(idleX.get());
      targetY.set(idleY.get());
    };

    computeIdle();
    document.addEventListener("pointermove", onMove);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("click", onClick);
    el.addEventListener("contextmenu", onContextMenu);
    window.addEventListener("resize", computeIdle);

    return () => {
      document.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("click", onClick);
      el.removeEventListener("contextmenu", onContextMenu);
      window.removeEventListener("resize", computeIdle);
      burstTimeoutsRef.current.forEach((tid) => clearTimeout(tid));
      burstTimeoutsRef.current.clear();
    };
  }, [hasFinePointer, ballControls, idleX, idleY, mxLive, myLive, targetX, targetY, heroW, heroH, intensity]);

  const titleClass =
    "text-5xl leading-[1.05] tracking-tight text-neutral-900 sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7rem]";

  return (
    <section
      id="about"
      ref={heroRef}
      className="relative"
      style={hasFinePointer ? { cursor: awake ? "none" : "pointer" } : undefined}
    >
      <PatternBackground variant="dot" className="min-h-[100svh]">
        <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col items-center justify-center px-6 pt-28 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 px-3 py-1 text-xs font-medium text-neutral-600 backdrop-blur"
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                awake ? "bg-emerald-500" : "bg-neutral-400",
              )}
            />
            {awake
              ? "已唤醒 · 移动鼠标控制黑球 · 右键退出"
              : "点击页面唤醒黑球 · " + profile.city}
          </motion.div>

          {/* Title + subtitle share a single transformed group so they rotate
              around one pivot instead of each around its own center. */}
          <motion.div
            className="relative z-40 flex flex-col items-center will-change-transform"
            style={
              hasFinePointer
                ? {
                    x: txLag,
                    y: tyLag,
                    rotateX: rotX,
                    rotateY: rotY,
                    transformPerspective: 1000,
                  }
                : undefined
            }
          >
            <div ref={titleRef} className="relative inline-block">
              <motion.div
                style={
                  hasFinePointer && awake
                    ? { WebkitMaskImage: englishMask, maskImage: englishMask }
                    : undefined
                }
              >
                <TextGenerateEffect
                  words={profile.heroLine}
                  className={titleClass}
                />
              </motion.div>

              {hasFinePointer && awake && (
                <motion.div
                  className="pointer-events-none absolute inset-0 flex items-start justify-center"
                  style={{
                    WebkitMaskImage: chineseMask,
                    maskImage: chineseMask,
                  }}
                  aria-hidden
                >
                  <span
                    className={`${titleClass} text-white! font-bold whitespace-nowrap drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]`}
                  >
                    你好,我是锦浩
                  </span>
                </motion.div>
              )}
            </div>

            {/* Entrance is opacity-only — adding y here would compete with the
                parent group's magnetic transform and unlock the subtitle. */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mx-auto mt-8 max-w-2xl text-base text-neutral-600 sm:text-lg md:text-xl"
            >
              {profile.title} · {profile.heroSubtitle}
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <a
              href="#cooperation"
              className="rounded-full bg-black px-7 py-3 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
              style={{ cursor: "pointer" }}
            >
              与我合作
            </a>
            <a
              href="#projects"
              className="rounded-full border border-neutral-300 px-7 py-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
              style={{ cursor: "pointer" }}
            >
              看我做过的事
            </a>
          </motion.div>
        </div>

        {hasFinePointer && (
          <motion.div
            className="pointer-events-none absolute z-30"
            style={{
              left: ballX,
              top: ballY,
              width: BALL_SIZE,
              height: BALL_SIZE,
            }}
            animate={ballControls}
            aria-hidden
          >
            <AgentCircle fill float={!awake} />
          </motion.div>
        )}

        {hasFinePointer && (
          <AnimatePresence>
            {bursts.map((b) =>
              b.kind === "wake" ? (
                <WakeRipple key={b.id} x={b.x} y={b.y} />
              ) : (
                <SleepRipple key={b.id} x={b.x} y={b.y} />
              ),
            )}
          </AnimatePresence>
        )}
      </PatternBackground>
    </section>
  );
}

type RippleCircleProps = {
  x: number;
  y: number;
  size: number;
  className: string;
  initial: { scale: number; opacity: number };
  animate: { scale: number; opacity: number };
  transition: React.ComponentProps<typeof motion.div>["transition"];
};

function RippleCircle({ x, y, size, className, initial, animate, transition }: RippleCircleProps) {
  return (
    <motion.div
      className={cn("pointer-events-none absolute z-20 rounded-full", className)}
      style={{ left: x, top: y, width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2 }}
      initial={initial}
      animate={animate}
      exit={{ opacity: 0 }}
      transition={transition}
    />
  );
}

function WakeRipple({ x, y }: { x: number; y: number }) {
  return (
    <>
      <RippleCircle
        x={x} y={y} size={60}
        className="border-2 border-black/45"
        initial={{ scale: 0.3, opacity: 0.7 }}
        animate={{ scale: 5.5, opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />
      <RippleCircle
        x={x} y={y} size={60}
        className="border border-black/30"
        initial={{ scale: 0.3, opacity: 0.6 }}
        animate={{ scale: 4, opacity: 0 }}
        transition={{ duration: 0.65, delay: 0.12, ease: "easeOut" }}
      />
      <RippleCircle
        x={x} y={y} size={24}
        className="bg-black/20"
        initial={{ scale: 0.5, opacity: 0.5 }}
        animate={{ scale: 2.5, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </>
  );
}

const SLEEP_Z_GLYPHS = [
  { dx: -8, dy: -32, size: "text-2xl", delay: 0 },
  { dx: 14, dy: -52, size: "text-lg", delay: 0.18 },
  { dx: 28, dy: -76, size: "text-base", delay: 0.36 },
];

function SleepRipple({ x, y }: { x: number; y: number }) {
  return (
    <>
      <RippleCircle
        x={x} y={y} size={200}
        className="bg-[radial-gradient(circle,rgba(0,0,0,0.18),transparent_70%)]"
        initial={{ scale: 0.6, opacity: 0.7 }}
        animate={{ scale: 1.4, opacity: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      {SLEEP_Z_GLYPHS.map((z, i) => (
        <motion.span
          key={i}
          className={`pointer-events-none absolute z-20 select-none font-semibold text-neutral-700 ${z.size}`}
          style={{ left: x + z.dx, top: y + z.dy }}
          initial={{ opacity: 0, y: 0, scale: 0.9 }}
          animate={{ opacity: [0, 0.85, 0], y: -28, scale: 1.05 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, delay: z.delay, ease: "easeOut" }}
        >
          z
        </motion.span>
      ))}
      <RippleCircle
        x={x} y={y} size={120}
        className="border border-black/30"
        initial={{ scale: 1.3, opacity: 0.55 }}
        animate={{ scale: 0.4, opacity: 0 }}
        transition={{ duration: 1, ease: "easeIn" }}
      />
    </>
  );
}
