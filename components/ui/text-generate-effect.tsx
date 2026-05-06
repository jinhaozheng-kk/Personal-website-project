"use client";

import { useEffect } from "react";
import { motion, stagger, useAnimate } from "motion/react";
import { cn } from "@/lib/utils";

type Props = {
  words: string;
  className?: string;
  duration?: number;
};

export function TextGenerateEffect({ words, className, duration = 0.5 }: Props) {
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(" ");

  useEffect(() => {
    animate(
      "span",
      { opacity: 1, filter: "blur(0px)", y: 0 },
      { duration, delay: stagger(0.08) },
    );
  }, [animate, duration]);

  return (
    <div className={cn("font-bold", className)}>
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => (
          <motion.span
            key={`${word}-${idx}`}
            className="inline-block opacity-0"
            style={{ filter: "blur(8px)", y: 8 }}
          >
            {word}&nbsp;
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}
