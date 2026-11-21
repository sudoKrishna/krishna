"use client";

import { useCallback, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import styles from "./Manifesto.module.css";

interface ScrubberProps { count: number; index: number; onChange: (index: number) => void; }

function tickHeight(index: number) {
  const seed = Math.sin(index * 12.9898) * 43758.5453;
  return 6 + Math.round((seed - Math.floor(seed)) * 9);
}
const TICKS_PER_ITEM = 4;

export default function Scrubber({ count, index, onChange }: ScrubberProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const totalTicks = count * TICKS_PER_ITEM;
  const activeTick = index * TICKS_PER_ITEM;
  const ticks = useMemo(() => Array.from({ length: totalTicks }, (_, i) => tickHeight(i)), [totalTicks]);
  const setFromClientX = useCallback((clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    onChange(Math.round(Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)) * (count - 1)));
  }, [count, onChange]);

  return <div ref={trackRef} className={styles.scrubber} role="slider" aria-label="SEO field note position" aria-valuemin={0} aria-valuemax={count - 1} aria-valuenow={index} tabIndex={0} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); setFromClientX(event.clientX); }} onPointerMove={(event) => { if (event.buttons === 1) setFromClientX(event.clientX); }} onKeyDown={(event) => { if (event.key === "ArrowRight") onChange(Math.min(count - 1, index + 1)); if (event.key === "ArrowLeft") onChange(Math.max(0, index - 1)); }}>
    {ticks.map((height, i) => { const distance = Math.abs(i - activeTick); return <motion.span key={i} className={styles.tick} data-active={i === activeTick || undefined} data-near={(distance <= TICKS_PER_ITEM / 2 && i !== activeTick) || undefined} animate={{ height: i === activeTick ? height + 10 : height, opacity: i === activeTick ? 1 : distance <= TICKS_PER_ITEM / 2 ? .6 : .3 }} transition={{ type: "spring", stiffness: 420, damping: 32 }} />; })}
  </div>;
}