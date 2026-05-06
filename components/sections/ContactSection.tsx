"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Mail, MessageSquare, Github, MapPin, Copy, Check } from "lucide-react";
import { DottedGlow } from "@/components/ui/dotted-glow";
import { profile } from "@/data/profile";

type Item = {
  key: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  href?: string;
  copyable?: boolean;
};

export function ContactSection() {
  const [copied, setCopied] = useState<string | null>(null);

  const items: Item[] = [
    {
      key: "email",
      label: "Email",
      value: profile.contact.email,
      icon: <Mail className="h-4 w-4" />,
      href: `mailto:${profile.contact.email}`,
      copyable: true,
    },
    {
      key: "wechat",
      label: "WeChat",
      value: profile.contact.wechat,
      icon: <MessageSquare className="h-4 w-4" />,
      copyable: true,
    },
    {
      key: "github",
      label: "GitHub",
      value: `@${profile.contact.github}`,
      icon: <Github className="h-4 w-4" />,
      href: profile.contact.githubUrl,
    },
    {
      key: "location",
      label: "Location",
      value: profile.contact.location,
      icon: <MapPin className="h-4 w-4" />,
    },
  ];

  const handleCopy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      /* ignore */
    }
  };

  return (
    <section id="contact" className="relative">
      <DottedGlow className="py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-500"
          >
            Contact
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-4 text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl md:text-6xl"
          >
            让我们聊聊你的想法。
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto mt-5 max-w-xl text-base text-neutral-600 md:text-lg"
          >
            无论是想法验证、MVP 开发,还是 AI Agent 集成,欢迎直接联系我。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-10"
          >
            <a
              href={`mailto:${profile.contact.email}`}
              className="inline-flex items-center gap-2 rounded-full bg-black px-7 py-3.5 text-sm font-medium text-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] transition-transform hover:-translate-y-0.5"
            >
              <Mail className="h-4 w-4" />
              开始合作
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            {items.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-white/70 p-4 text-left backdrop-blur"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-700">
                    {item.icon}
                  </span>
                  <div className="min-w-0">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                      {item.label}
                    </div>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="block truncate text-sm font-medium text-neutral-900 hover:underline"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <span className="block truncate text-sm font-medium text-neutral-900">
                        {item.value}
                      </span>
                    )}
                  </div>
                </div>

                {item.copyable && (
                  <button
                    type="button"
                    onClick={() => handleCopy(item.key, item.value)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                    aria-label={`复制 ${item.label}`}
                  >
                    {copied === item.key ? (
                      <Check className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </DottedGlow>
    </section>
  );
}
