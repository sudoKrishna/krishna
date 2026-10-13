"use client";

import { useId } from "react";
import { motion } from "motion/react";

import { useShine } from "./useShine";

type Pt = { x: number; y: number; r: number; o: number };

function segment(p1: [number, number], p2: [number, number], count: number): Pt[] {
  return Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1);
    return {
      x: p1[0] + (p2[0] - p1[0]) * t,
      y: p1[1] + (p2[1] - p1[1]) * t,
      r: 2,
      o: 0.9,
    };
  });
}

function wallDots(x1: number, x2: number, y: number, count: number): Pt[] {
  return Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1);
    return { x: x1 + (x2 - x1) * t, y, r: 1.1, o: 0.25 };
  });
}

function peekFill(cx: number, cy: number, r: number, yMax: number, spacing: number): Pt[] {
  const pts: Pt[] = [];
  for (let y = cy - r; y <= yMax; y += spacing) {
    for (let x = cx - r; x <= cx + r; x += spacing) {
      const d = Math.hypot(x - cx, y - cy);
      if (d <= r) {
        const t = 1 - d / r;
        pts.push({ x, y, r: 1.1 + t * 1.6, o: 0.45 + t * 0.55 });
      }
    }
  }
  return pts;
}

const leftBracket = [
  ...segment([47, 34], [30, 60], 6),
  ...segment([30, 60], [47, 86], 6).slice(1),
];
const rightBracket = [
  ...segment([73, 34], [90, 60], 6),
  ...segment([90, 60], [73, 86], 6).slice(1),
];
const wall = wallDots(36, 84, 68, 10);
const head = peekFill(60, 74, 15, 68, 3.6);

const eyes: Pt[] = [
  { x: 54, y: 66, r: 1.6, o: 0.95 },
  { x: 58.5, y: 67.5, r: 1.3, o: 0.8 },
  { x: 61.5, y: 67.5, r: 1.3, o: 0.8 },
  { x: 66, y: 66, r: 1.6, o: 0.95 },
];

export function ShyDotLogo({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const shine = useShine();
  const gradId = `shy-grad-${uid}`;
  const maskId = `shy-mask-${uid}`;
  const all = [...leftBracket, ...rightBracket, ...wall, ...head];

  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <mask id={maskId}>
          <motion.rect
            x="0"
            y="-10"
            width="44"
            height="140"
            fill={`url(#${gradId})`}
            initial={{ x: shine.dir === 1 ? -60 : 140 }}
            animate={{ x: shine.dir === 1 ? 140 : -60 }}
            transition={{
              duration: shine.duration,
              repeat: Infinity,
              repeatDelay: shine.repeatDelay,
              ease: "easeInOut",
            }}
          />
        </mask>
      </defs>

      {all.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="#F5F5F5" opacity={p.o} />
      ))}

      {/* sweeping shine */}
      <g mask={`url(#${maskId})`}>
        {all.map((p, i) => (
          <circle
            key={`s-${i}`}
            cx={p.x}
            cy={p.y}
            r={p.r * 1.2}
            fill="#ffffff"
            opacity={Math.min(1, p.o + 0.35)}
          />
        ))}
      </g>

      {eyes.map((p, i) => (
        <circle key={`eye-${i}`} cx={p.x} cy={p.y} r={p.r} fill="#0D0D0D" opacity={p.o} />
      ))}
    </svg>
  );
}
