"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { navItems, profile } from "@/data/profile";

export function Header() {
  const [active, setActive] = useState<string>(navItems[0]?.id ?? "");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = navItems
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const handleClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-neutral-200/70 bg-white/70 backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a
          href="#about"
          onClick={handleClick("about")}
          className="text-base font-semibold tracking-tight"
        >
          {profile.name}
          <span className="ml-1 text-neutral-400">/</span>
        </a>

        <nav className="hidden items-center gap-1 rounded-full border border-neutral-200/80 bg-white/60 p-1 shadow-sm backdrop-blur md:flex">
          {navItems.map((item) => {
            const isActive = active === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={handleClick(item.id)}
                className={cn(
                  "relative rounded-full px-4 py-1.5 text-sm transition-colors",
                  isActive ? "text-white" : "text-neutral-600 hover:text-neutral-900",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-black"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                {item.label}
              </a>
            );
          })}
        </nav>

        <a
          href="#contact"
          onClick={handleClick("contact")}
          className="hidden rounded-full bg-black px-4 py-1.5 text-sm font-medium text-white transition-transform hover:-translate-y-0.5 sm:inline-flex"
        >
          联系我
        </a>
      </div>

      {/* mobile nav */}
      <nav className="flex items-center justify-center gap-1 border-t border-neutral-200/60 bg-white/70 px-3 py-2 backdrop-blur md:hidden">
        {navItems.map((item) => {
          const isActive = active === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={handleClick(item.id)}
              className={cn(
                "rounded-full px-3 py-1 text-xs transition-colors",
                isActive ? "bg-black text-white" : "text-neutral-600",
              )}
            >
              {item.label}
            </a>
          );
        })}
      </nav>
    </header>
  );
}
