"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow: string;
  title: string;
  desc?: string;
  className?: string;
};

export function SectionHeader({ eyebrow, title, desc, className }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn("mx-auto mb-12 max-w-2xl text-center md:mb-16", className)}
    >
      <span className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-500">
        {eyebrow}
      </span>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {desc && (
        <p className="mt-4 text-base text-neutral-600 md:text-lg">{desc}</p>
      )}
    </motion.div>
  );
}
