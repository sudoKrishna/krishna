"use client";

import { motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";
import { FloatingDock } from "./FloatingDock";
import { ReadingControls } from "./ReadingControls";
import styles from "./ReadingControls.module.css";

export type TocItem = { id: string; label: string };

export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }} viewport={{ once: true, amount: 0.15 }}>{children}</motion.div>;
}

export function BlogLayout({ children, toc }: { children: ReactNode; toc: TocItem[] }) {
  const [active, setActive] = useState(toc[0]?.id ?? "");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    const nodes = toc.map(({ id }) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(entries => {
      const seen = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (seen?.target.id) setActive(seen.target.id);
    }, { rootMargin: "-20% 0px -65% 0px", threshold: 0 });
    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, [toc]);

  return <div className={styles.page} data-theme={theme}>
    <div className="mx-auto w-full max-w-[680px] px-5 py-10 lg:px-0 lg:py-16">
      <main className="min-w-0 pb-24">{children}</main>
    </div>
    <ReadingControls toc={toc} active={active} theme={theme} onThemeChange={() => setTheme((value) => value === "light" ? "dark" : "light")} />
    <FloatingDock toc={toc} active={active} />
  </div>;
}

export function SectionTitle({ number, children }: { number: string; children: ReactNode }) {
  return <h2 className="flex items-baseline gap-2 text-[23px] font-semibold tracking-[-0.025em] text-[#111827] sm:text-2xl"><span className="font-mono text-sm font-normal text-[#9CA3AF]">{number}</span>{children}</h2>;
}