"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  fill?: boolean;
  float?: boolean;
};

export function AgentCircle({
  className,
  fill = false,
  float = true,
}: Props) {
  return (
    <div
      className={cn(
        "relative aspect-square",
        fill ? "h-full w-full" : "w-56 sm:w-64 md:w-80 lg:w-[22rem]",
        className,
      )}
    >
      <motion.div
        className="absolute inset-0 rounded-full bg-black shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)]"
        animate={float ? { y: [0, -22, 0] } : undefined}
        transition={
          float
            ? { duration: 3.4, ease: "easeInOut", repeat: Infinity }
            : undefined
        }
      >
        {/* 简单内部高光 */}
        <div className="absolute inset-3 rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.16),transparent_55%)]" />
      </motion.div>
    </div>
  );
}
