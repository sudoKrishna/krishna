"use client";

import { motion } from "framer-motion";
import { Great_Vibes } from "next/font/google";

const script = Great_Vibes({ subsets: ["latin"], weight: ["400"] });

const DRAW = { duration: 1.4, ease: [0.16, 1, 0.3, 1] } as const;

export function Signature({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 74"
      role="img"
      aria-label="Krishna signature"
      className={className ?? "h-8 w-auto"}
    >
      <defs>
        <clipPath id="signature-reveal">
          <motion.rect
            x="0"
            y="0"
            width="200"
            height="74"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ ...DRAW, delay: 0.15 }}
            style={{ transformBox: "fill-box", transformOrigin: "left center" }}
          />
        </clipPath>
      </defs>

      {/* handwritten name — revealed left to right like ink being laid down */}
      <motion.text
        x="6"
        y="50"
        className={script.className}
        fontSize="52"
        fill="#1a1a1a"
        clipPath="url(#signature-reveal)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.2 }}
      >
        Krishna
      </motion.text>

      {/* drawn swash underline */}
      <motion.path
        d="M8 60 C 46 52, 96 56, 128 50 C 150 46, 170 44, 192 47"
        fill="none"
        stroke="#1a1a1a"
        strokeWidth="1.6"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 1.2 }}
      />
    </svg>
  );
}
