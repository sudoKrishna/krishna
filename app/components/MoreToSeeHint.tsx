"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

const DRAW = [0.16, 1, 0.3, 1] as const;

/**
 * Hand-drawn "more to see" annotation: a single slow squiggly arrow
 * that draws itself pointing down-right, toward whatever sits below
 * and to the right of the hint (e.g. a logo/avatar).
 */
export function MoreToSeeHint({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute select-none", className)}>
      <motion.span
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: DRAW }}
        className="block text-left text-[13px] font-medium tracking-wide text-[#8a8a8a]"
      >
        more to see
      </motion.span>

      <svg width="132" height="66" viewBox="0 0 132 66" fill="none" className="mt-0.5">
        {/* squiggly line, points down-right, slow draw */}
        <motion.path
          d="M6 4C14 20 10 30 24 34C38 38 36 26 48 30C58 33 56 46 72 48C86 50 92 44 106 52"
          stroke="#a3a3a3"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.8, ease: DRAW, delay: 0.3 }}
        />
        {/* arrow head, pointing down-right into the target */}
        <motion.path
          d="M98 44L108 52L98 59"
          stroke="#a3a3a3"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 3.1 }}
        />
      </svg>
    </div>
  );
}