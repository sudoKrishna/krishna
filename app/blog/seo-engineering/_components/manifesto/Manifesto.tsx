"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import styles from "./Manifesto.module.css";
import Scrubber from "./Scrubber";
import { manifesto } from "./data";
import { ListIcon, MarkIcon } from "./icons";

type Mode = "card" | "list";
type Theme = "dark" | "light";
const pad = (value: number) => String(value + 1).padStart(2, "0");

export default function Manifesto() {
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<Mode>("card");
  const [theme, setTheme] = useState<Theme>("dark");
  const [tooltip, setTooltip] = useState(false);
  const reducedMotion = useReducedMotion();
  const listTrackRef = useRef<HTMLDivElement>(null);
  const total = manifesto.length;
  const current = manifesto[index];

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") setIndex((value) => Math.min(total - 1, value + 1));
      if (event.key === "ArrowLeft") setIndex((value) => Math.max(0, value - 1));
      if (event.key.toLowerCase() === "t") setTheme((value) => value === "dark" ? "light" : "dark");
      if (event.key.toLowerCase() === "l") setMode((value) => value === "card" ? "list" : "card");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [total]);

  useEffect(() => {
    if (mode !== "list") return;
    const row = listTrackRef.current?.children[index] as HTMLElement | undefined;
    row?.scrollIntoView({ block: "nearest", behavior: reducedMotion ? "auto" : "smooth" });
  }, [index, mode, reducedMotion]);

  const transition = reducedMotion ? { duration: 0 } : { type: "spring" as const, stiffness: 300, damping: 30 };

  return <section className={styles.root} data-theme={theme} aria-label="Interactive SEO field notes">
    <div className={styles.halftone} />
    {mode === "card" ? <div className={styles.stage}><AnimatePresence mode="wait"><motion.div key={index} className={styles.card} initial={reducedMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={reducedMotion ? undefined : { opacity: 0, y: -8 }} transition={transition}><div className={styles.cardHead}><span className={styles.cardLabel}>// SEO FIELD NOTE</span><span className={styles.cardIndex}><span>{pad(index)}</span>/{String(total).padStart(2, "0")}</span></div><h3 className={styles.cardTitle}>{current.title}</h3><p className={styles.cardBody}>{current.body}</p></motion.div></AnimatePresence></div> : <div className={styles.listViewport}><div className={styles.listTrack} ref={listTrackRef}>{manifesto.map((item, itemIndex) => <button key={item.title} type="button" className={styles.listRow} data-active={itemIndex === index} onClick={() => { setIndex(itemIndex); setMode("card"); }}><span className={styles.listIndex}>{pad(itemIndex)}</span><span>{item.title}</span></button>)}</div></div>}
    <div className={styles.controls}><div className={styles.iconButton} onMouseEnter={() => setTooltip(true)} onMouseLeave={() => setTooltip(false)}><button type="button" aria-label="Toggle colour theme" onClick={() => setTheme((value) => value === "dark" ? "light" : "dark")}><MarkIcon /></button><AnimatePresence>{tooltip && <motion.div className={styles.tooltip} initial={reducedMotion ? false : { opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={reducedMotion ? undefined : { opacity: 0, y: 4 }} transition={{ duration: .12 }}>Toggle theme <kbd>T</kbd></motion.div>}</AnimatePresence></div><button type="button" className={styles.badge} onClick={() => setMode((value) => value === "card" ? "list" : "card")} aria-label="Toggle note list"><ListIcon /> <span>{pad(index)}</span>/{String(total).padStart(2, "0")}</button>{mode === "card" && <Scrubber count={total} index={index} onChange={setIndex} />}</div>
  </section>;
}