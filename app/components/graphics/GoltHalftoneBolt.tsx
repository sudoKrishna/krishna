"use client";

import { useId } from "react";
import { motion } from "motion/react";

import { useShine } from "./useShine";

type Dot = { x: number; y: number; r: number; fill: string };

const DARK: [number, number, number] = [15, 10, 40];
const MID: [number, number, number] = [99, 70, 220];
const LIGHT: [number, number, number] = [216, 199, 255];

function lerp(a: [number, number, number], b: [number, number, number], t: number) {
  return `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)}, ${Math.round(
    a[1] + (b[1] - a[1]) * t,
  )}, ${Math.round(a[2] + (b[2] - a[2]) * t)})`;
}

function duotone(t: number) {
  return t < 0.5 ? lerp(DARK, MID, t / 0.5) : lerp(MID, LIGHT, (t - 0.5) / 0.5);
}

const BOLT = [
  [143, 110],
  [143, 33],
  [44, 154],
  [121, 154],
  [121, 231],
  [220, 110],
] as const;

function pointInPolygon(x: number, y: number, poly: readonly (readonly [number, number])[]) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function halftoneFill(poly: readonly (readonly [number, number])[], spacing: number): Dot[] {
  const xs = poly.map((p) => p[0]);
  const ys = poly.map((p) => p[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const dots: Dot[] = [];
  for (let y = minY; y <= maxY; y += spacing) {
    for (let x = minX; x <= maxX; x += spacing) {
      if (pointInPolygon(x, y, poly)) {
        const t = (y - minY) / (maxY - minY);
        dots.push({ x, y, r: 1.1 + t * 1.6, fill: duotone(t) });
      }
    }
  }
  return dots;
}

const dots = halftoneFill(BOLT, 5.5);

export function GoltHalftoneBolt({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const shine = useShine();
  const gradId = `golt-grad-${uid}`;
  const maskId = `golt-mask-${uid}`;

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

      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={d.fill} />
      ))}

      <g mask={`url(#${maskId})`}>
        {dots.map((d, i) => (
          <circle key={`s-${i}`} cx={d.x} cy={d.y} r={d.r * 1.25} fill="#ffffff" opacity={0.9} />
        ))}
      </g>
    </svg>
  );
}
