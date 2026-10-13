"use client";

import { useId } from "react";
import { motion } from "motion/react";

import { useShine } from "./useShine";

type Dot = { x: number; y: number; r: number; fill: string };

const AMBER: [number, number, number] = [251, 191, 36];
const ROSE: [number, number, number] = [244, 63, 94];

function lerp(a: [number, number, number], b: [number, number, number], t: number) {
  return `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)}, ${Math.round(
    a[1] + (b[1] - a[1]) * t,
  )}, ${Math.round(a[2] + (b[2] - a[2]) * t)})`;
}

function roundedSquareDots(
  x: number,
  y: number,
  size: number,
  spacing: number,
  colorAt: (t: number) => string,
): Dot[] {
  const dots: Dot[] = [];
  for (let dy = 0; dy <= size; dy += spacing) {
    for (let dx = 0; dx <= size; dx += spacing) {
      const t = (dx + dy) / (size * 2);
      dots.push({
        x: x + dx,
        y: y + dy,
        r: 1.3 + (1 - Math.abs(t - 0.5) * 2) * 1.3,
        fill: colorAt(t),
      });
    }
  }
  return dots;
}

const back = roundedSquareDots(28, 24, 86, 6, (t) => lerp(AMBER, [120, 80, 20], t * 0.4));
const front = roundedSquareDots(66, 62, 86, 6, (t) => lerp([180, 30, 60], ROSE, t));
const all = [...back, ...front];

export function GoltUIHalftoneStack({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const shine = useShine();
  const gradId = `goltui-grad-${uid}`;
  const maskId = `goltui-mask-${uid}`;

  return (
    <svg viewBox="0 0 220 210" className={className} aria-hidden>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <mask id={maskId}>
          <motion.rect
            x="0"
            y="-20"
            width="64"
            height="260"
            fill={`url(#${gradId})`}
            initial={{ x: shine.dir === 1 ? -90 : 280 }}
            animate={{ x: shine.dir === 1 ? 280 : -90 }}
            transition={{
              duration: shine.duration,
              repeat: Infinity,
              repeatDelay: shine.repeatDelay,
              ease: "easeInOut",
            }}
          />
        </mask>
      </defs>

      {back.map((d, i) => (
        <circle key={`b-${i}`} cx={d.x} cy={d.y} r={d.r} fill={d.fill} opacity={0.8} />
      ))}
      {front.map((d, i) => (
        <circle key={`f-${i}`} cx={d.x} cy={d.y} r={d.r} fill={d.fill} />
      ))}

      <g mask={`url(#${maskId})`}>
        {all.map((d, i) => (
          <circle key={`s-${i}`} cx={d.x} cy={d.y} r={d.r * 1.25} fill="#ffffff" opacity={0.9} />
        ))}
      </g>
    </svg>
  );
}
