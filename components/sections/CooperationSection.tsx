"use client";

import { motion } from "motion/react";
import { ArrowUpRight, Check } from "lucide-react";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { BorderBeam } from "@/components/ui/border-beam";
import { SectionHeader } from "./SectionHeader";
import { cooperation } from "@/data/profile";

export function CooperationSection() {
  return (
    <section id="cooperation" className="relative bg-white py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          eyebrow="Cooperation"
          title="与我合作"
          desc="不接堆砌人头的活,只做能交付价值的事。"
        />

        <BentoGrid className="auto-rows-[20rem]">
          {cooperation.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative"
            >
              <BentoCard
                className={
                  item.featured
                    ? "border-neutral-900/10 ring-1 ring-neutral-900/5"
                    : ""
                }
              >
                {item.featured && <BorderBeam size={120} duration={6} />}

                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-neutral-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 space-y-1.5">
                  {item.highlights.map((h) => (
                    <div
                      key={h}
                      className="flex items-center gap-2 text-xs text-neutral-600"
                    >
                      <Check className="h-3.5 w-3.5 text-neutral-900" />
                      {h}
                    </div>
                  ))}
                </div>

                <a
                  href="#contact"
                  className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-neutral-900 transition-colors hover:text-black"
                >
                  了解更多
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </BentoCard>
            </motion.div>
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}
