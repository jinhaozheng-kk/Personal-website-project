"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

type Props = {
  value: number;
  className?: string;
  decimalPlaces?: number;
  durationMs?: number;
};

export function NumberTicker({
  value,
  className,
  decimalPlaces = 0,
  durationMs = 1200,
}: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    damping: 30,
    stiffness: 80,
    duration: durationMs,
  });

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, motionValue, value]);

  useEffect(() => {
    return spring.on("change", (latest) => {
      if (!ref.current) return;
      ref.current.textContent = Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      }).format(Number(latest.toFixed(decimalPlaces)));
    });
  }, [spring, decimalPlaces]);

  return (
    <span
      ref={ref}
      className={cn("tabular-nums tracking-tight", className)}
    >
      0
    </span>
  );
}
