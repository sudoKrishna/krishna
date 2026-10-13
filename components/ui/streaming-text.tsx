"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

/**
 * Reveals text word-by-word as it streams in.
 */
export function StreamingText({ children }: { children: ReactNode }) {
  if (typeof children !== "string") return <>{children}</>;

  const words = children.split(" ");

  return (
    <span>
      {words.map((word, index) => (
        <motion.span
          key={`${String(index)}-${word}`}
          initial={{ opacity: 0, y: 2, filter: "blur(2px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="inline"
        >
          {word}
          {index < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </span>
  );
}
