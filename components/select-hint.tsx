"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

const DRAW = [0.16, 1, 0.3, 1] as const;

/**
 * Hand-drawn "select text" annotation with a squiggly arrow that draws itself
 * and points toward the text.
 */
export function SelectHint({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute select-none", className)}>
      <motion.span
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: DRAW }}
        className="block text-right text-[13px] font-medium tracking-wide text-[#8a8a8a]"
      >
        select text
      </motion.span>

      <svg width="132" height="66" viewBox="0 0 132 66" fill="none" className="mt-0.5">
        {/* squiggly line */}
        <motion.path
          d="M126 4C118 20 122 30 108 34C94 38 96 26 84 30C74 33 76 46 60 48C46 50 40 44 26 52"
          stroke="#a3a3a3"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.1, ease: DRAW, delay: 0.3 }}
        />
        {/* arrow head */}
        <motion.path
          d="M34 44L24 52L34 59"
          stroke="#a3a3a3"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.28, ease: "easeOut", delay: 1.32 }}
        />
      </svg>
    </div>
  );
}
