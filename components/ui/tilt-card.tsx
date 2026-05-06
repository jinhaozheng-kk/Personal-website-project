"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  maxRotate?: number;
};

export function TiltCard({ children, className, maxRotate = 12 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const lift = useMotionValue(0);
  const sRotX = useSpring(rotX, { stiffness: 220, damping: 22, mass: 0.4 });
  const sRotY = useSpring(rotY, { stiffness: 220, damping: 22, mass: 0.4 });
  const sLift = useSpring(lift, { stiffness: 220, damping: 22, mass: 0.4 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const px = (e.clientX - r.left) / r.width; // 0..1
    const py = (e.clientY - r.top) / r.height;
    rotY.set((px - 0.5) * 2 * maxRotate);
    rotX.set(-(py - 0.5) * 2 * maxRotate);
    lift.set(-8);
  };

  const onLeave = () => {
    rotX.set(0);
    rotY.set(0);
    lift.set(0);
  };

  return (
    <div className={cn("h-full w-full", className)} style={{ perspective: 1200 }}>
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{
          rotateX: sRotX,
          rotateY: sRotY,
          y: sLift,
          transformStyle: "preserve-3d",
        }}
        className="h-full w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
