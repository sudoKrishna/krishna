"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { TocItem } from "./BlogLayout";
import styles from "./ReadingControls.module.css";

type Theme = "light" | "dark";

function tickHeight(index: number) {
  const seed = Math.sin(index * 12.9898) * 43758.5453;
  return 7 + Math.round((seed - Math.floor(seed)) * 8);
}

export function ReadingControls({ toc, active, theme, onThemeChange }: { toc: TocItem[]; active: string; theme: Theme; onThemeChange: () => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const index = Math.max(0, toc.findIndex((item) => item.id === active));
  const ticks = useMemo(() => Array.from({ length: toc.length }, (_, itemIndex) => tickHeight(itemIndex)), [toc.length]);
  const activeTick = index;
  const showCounter = index === 0 || index === toc.length - 1;

  const goTo = useCallback((nextIndex: number) => {
    const safeIndex = Math.max(0, Math.min(toc.length - 1, nextIndex));
    const target = toc[safeIndex];
    setMenuOpen(false);
    document.getElementById(target.id)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  }, [reducedMotion, toc]);

  const setFromClientX = useCallback((clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    goTo(Math.round(Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)) * (toc.length - 1)));
  }, [goTo, toc.length]);

  return <>
    <AnimatePresence>
      {menuOpen && <motion.div className={styles.listPanel} initial={reducedMotion ? false : { opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} exit={reducedMotion ? undefined : { opacity: 0, y: 18 }} transition={{ type: "spring", stiffness: 340, damping: 30 }}>
        {toc.map((item, itemIndex) => <button key={item.id} type="button" className={styles.listRow} data-active={itemIndex === index || undefined} onClick={() => { goTo(itemIndex); setMenuOpen(false); }}>
          <span>{String(itemIndex + 1).padStart(2, "0")}</span><strong>{item.label}</strong>
        </button>)}
      </motion.div>}
    </AnimatePresence>
    <div className={styles.controls} aria-label="Reading controls">
      <button type="button" className={styles.themeButton} onClick={onThemeChange} aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"} title="Toggle theme">
        {theme === "light" ? <span aria-hidden="true">☾</span> : <span aria-hidden="true">☀</span>}
      </button>
      <button type="button" className={styles.counter} data-visible={showCounter || undefined} onClick={() => setMenuOpen((value) => !value)} aria-label="Open article sections" aria-expanded={menuOpen}>
        <b>{showCounter ? String(index + 1).padStart(2, "0") : "\u00a0"}</b><span>/{String(toc.length).padStart(2, "0")}</span>
      </button>
      <div ref={trackRef} className={styles.scrubber} role="slider" aria-label="Article section" aria-valuemin={1} aria-valuemax={toc.length} aria-valuenow={index + 1} tabIndex={0} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); setFromClientX(event.clientX); }} onPointerMove={(event) => { if (event.buttons === 1) setFromClientX(event.clientX); }} onKeyDown={(event) => { if (event.key === "ArrowRight") goTo(index + 1); if (event.key === "ArrowLeft") goTo(index - 1); }}>
        {ticks.map((height, tickIndex) => { const distance = Math.abs(tickIndex - activeTick); return <motion.span key={tickIndex} className={styles.tick} data-active={tickIndex === activeTick || undefined} data-near={(distance === 1) || undefined} animate={{ height: tickIndex === activeTick ? height + 5 : height, opacity: tickIndex === activeTick ? 1 : distance === 1 ? .65 : .35 }} transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 28 }} />; })}
      </div>
    </div>
  </>;
}