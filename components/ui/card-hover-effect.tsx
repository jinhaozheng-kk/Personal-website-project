"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

type Item = {
  key: string;
  content: ReactNode;
};

type Props = {
  items: Item[];
  className?: string;
  itemClassName?: string;
};

export function HoverEffect({ items, className, itemClassName }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className={cn("grid gap-4", className)}>
      {items.map((item) => (
        <div
          key={item.key}
          className="relative h-full"
          onMouseEnter={() => setHovered(item.key)}
          onMouseLeave={() => setHovered(null)}
        >
          <AnimatePresence>
            {hovered === item.key && (
              <motion.span
                className="absolute inset-0 block h-full w-full rounded-2xl bg-neutral-900/[0.04]"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.15 } }}
                exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.05 } }}
              />
            )}
          </AnimatePresence>
          <div
            className={cn(
              "relative z-10 h-full rounded-2xl border border-neutral-200 bg-white p-6 transition-shadow duration-300",
              hovered === item.key
                ? "shadow-[0_8px_30px_rgba(0,0,0,0.06)] -translate-y-1"
                : "shadow-sm",
              itemClassName,
            )}
            style={{ transitionProperty: "transform, box-shadow" }}
          >
            {item.content}
          </div>
        </div>
      ))}
    </div>
  );
}
