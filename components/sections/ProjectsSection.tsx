"use client";

import { motion } from "motion/react";
import { PatternBackground } from "@/components/ui/grid-dot-background";
import { TiltCard } from "@/components/ui/tilt-card";
import { SectionHeader } from "./SectionHeader";
import { projects } from "@/data/profile";

export function ProjectsSection() {
  return (
    <section id="projects" className="relative">
      <PatternBackground variant="grid" className="py-24 md:py-32">
        <div className="mx-auto max-w-4xl px-6">
          <SectionHeader
            eyebrow="Projects"
            title="项目经历"
            desc="挑选了几个有代表性的项目,展示我能交付的范围与深度 — 鼠标悬停卡片随之 3D 倾斜。"
          />

          <div className="flex flex-col gap-6">
            {projects.map((p, i) => (
              <motion.div
                key={p.index}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: "easeOut" }}
              >
                <TiltCard maxRotate={16}>
                  <article className="group relative flex h-full w-full flex-col gap-6 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-[0_20px_55px_rgba(0,0,0,0.10)] md:flex-row md:items-stretch md:gap-10 md:p-10">
                    {/* index + year */}
                    <div className="flex items-baseline justify-between gap-4 md:w-32 md:flex-col md:items-start md:justify-start md:gap-3">
                      <span className="font-mono text-4xl font-semibold tracking-tight text-neutral-900 md:text-5xl">
                        /{p.index}
                      </span>
                      <span className="font-mono text-sm text-neutral-400">
                        {p.year}
                      </span>
                    </div>

                    {/* divider on md+ */}
                    <div className="hidden w-px self-stretch bg-neutral-200 md:block" />

                    {/* main */}
                    <div className="flex flex-1 flex-col">
                      <h3 className="text-2xl font-semibold tracking-tight text-neutral-900 md:text-3xl">
                        {p.name}
                      </h3>
                      <p className="mt-3 text-base leading-relaxed text-neutral-600">
                        {p.desc}
                      </p>
                      <div className="mt-auto flex flex-wrap gap-1.5 pt-6">
                        {p.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </PatternBackground>
    </section>
  );
}
