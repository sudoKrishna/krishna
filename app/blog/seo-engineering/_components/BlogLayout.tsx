"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { FloatingDock } from "./FloatingDock";

export type TocItem = { id: string; label: string };

export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }} viewport={{ once: true, amount: 0.15 }}>{children}</motion.div>;
}

export function BlogLayout({ children, toc }: { children: ReactNode; toc: TocItem[] }) {
  const [active, setActive] = useState(toc[0]?.id ?? "");
  useEffect(() => {
    const nodes = toc.map(({ id }) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(entries => {
      const seen = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (seen?.target.id) setActive(seen.target.id);
    }, { rootMargin: "-20% 0px -65% 0px", threshold: 0 });
    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, [toc]);

  return <div className="min-h-screen bg-white text-[#111827] [--seo-accent:#5E6AD2]">
    <div className="mx-auto grid max-w-[1120px] grid-cols-1 gap-10 px-5 py-10 lg:grid-cols-[220px_minmax(0,680px)] lg:gap-16 lg:px-8 lg:py-16">
      <aside className="hidden self-start lg:block">
        <div className="sticky top-12 h-fit">
          <Link href="/#blog" className="text-[13px] text-[#6B7280] transition-colors hover:text-[#111827]">← Case studies</Link>
          <p className="mt-8 text-sm font-semibold leading-5">SEO engineering: a system for being found</p>
          <nav aria-label="Article table of contents" className="mt-7">
            {toc.map(item => <a key={item.id} href={"#" + item.id} className={"relative block py-1.5 pl-4 text-[13px] transition-colors " + (active === item.id ? "font-semibold text-[#111827]" : "text-[#6B7280] hover:text-[#374151]")}>
              {active === item.id && <motion.span layoutId="active-toc-dot" aria-hidden="true" className="absolute left-0 top-2.5 h-1.5 w-1.5 rounded-full bg-[var(--seo-accent)]" transition={{ type: "spring", stiffness: 520, damping: 32 }} />}
              {item.label}
            </a>)}
          </nav>
        </div>
      </aside>
      <main className="min-w-0 pb-24">{children}</main>
    </div>
    <FloatingDock toc={toc} active={active} />
  </div>;
}

export function SectionTitle({ number, children }: { number: string; children: ReactNode }) {
  return <h2 className="flex items-baseline gap-2 text-[23px] font-semibold tracking-[-0.025em] text-[#111827] sm:text-2xl"><span className="font-mono text-sm font-normal text-[#9CA3AF]">{number}</span>{children}</h2>;
}
