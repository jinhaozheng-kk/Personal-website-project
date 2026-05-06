"use client";

import { motion } from "motion/react";
import { FlipCard } from "@/components/ui/flip-card";
import { NumberTicker } from "@/components/ui/number-ticker";
import { SectionHeader } from "./SectionHeader";
import { skills, type Skill } from "@/data/profile";

const LEVEL_BADGE: Record<Skill["details"][number]["level"], string> = {
  精通: "bg-white text-neutral-900",
  熟练: "bg-white/15 text-white border border-white/30",
  了解: "bg-transparent text-white/70 border border-white/20",
};

export function SkillsSection() {
  return (
    <section id="skills" className="relative bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Skills"
          title="专业技能"
          desc="把模型 / 后端 / 前端 / 自动化串成可交付的产品 — 鼠标悬停查看子技能。"
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="h-[26rem]"
            >
              <FlipCard
                front={
                  <div className="relative flex h-full w-full flex-col rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm transition-shadow duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
                    <div className="flex items-baseline gap-1 font-semibold tracking-tight">
                      <NumberTicker
                        value={s.metric}
                        className="text-5xl text-neutral-900 md:text-6xl"
                      />
                      <span className="text-3xl text-neutral-900 md:text-4xl">
                        {s.suffix}
                      </span>
                    </div>
                    <span className="mt-1 text-xs uppercase tracking-widest text-neutral-500">
                      {s.metricLabel}
                    </span>

                    <div className="mt-6 h-px w-10 bg-neutral-300" />

                    <h3 className="mt-6 text-2xl font-semibold tracking-tight text-neutral-900">
                      {s.name}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                      {s.desc}
                    </p>
                  </div>
                }
                back={
                  <div className="relative flex h-full w-full flex-col rounded-2xl border border-neutral-800 bg-neutral-950 p-7 text-white shadow-sm">
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">
                      / {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                      {s.name}
                    </h3>
                    <div className="mt-4 h-px w-10 bg-white/30" />

                    <ul className="mt-6 flex-1 space-y-3">
                      {s.details.map((d) => (
                        <li
                          key={d.name}
                          className="flex items-center justify-between gap-3"
                        >
                          <span className="text-sm text-white/85">{d.name}</span>
                          <span
                            className={
                              "rounded-full px-2.5 py-0.5 text-[11px] font-medium " +
                              LEVEL_BADGE[d.level]
                            }
                          >
                            {d.level}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                }
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
