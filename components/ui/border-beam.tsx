"use client";

import { cn } from "@/lib/utils";

type Props = {
  size?: number;
  duration?: number;
  delay?: number;
  className?: string;
};

export function BorderBeam({
  size = 200,
  duration = 8,
  delay = 0,
  className,
}: Props) {
  return (
    <div
      style={
        {
          "--size": `${size}px`,
          "--duration": `${duration}s`,
          "--delay": `${delay}s`,
        } as React.CSSProperties
      }
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] [border:1px_solid_transparent] [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(white,white)]",
        "after:absolute after:aspect-square after:w-[var(--size)] after:[animation-delay:var(--delay)] after:[background:linear-gradient(to_left,#000,transparent_50%)] after:[offset-anchor:90%_50%] after:[offset-path:rect(0_auto_auto_0_round_var(--size))] after:[animation:beam-spin_var(--duration)_linear_infinite] after:opacity-60",
        className,
      )}
    >
      <style jsx global>{`
        @keyframes beam-spin {
          to {
            offset-distance: 100%;
          }
        }
      `}</style>
    </div>
  );
}
