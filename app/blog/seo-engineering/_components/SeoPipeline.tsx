"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const stages = [
  {
    id: "discover",
    label: "Discover",
    title: "A real question starts the system.",
    copy: "A reader asks a question. The job is not to repeat their keywords, but to understand the decision hiding behind them.",
    signal: "Intent mapped",
    detail: "Query → need → best page format",
  },
  {
    id: "crawl",
    label: "Crawl",
    title: "Can a crawler reach the answer?",
    copy: "Search engines need a stable URL, a crawlable link, useful server-visible text, and no accidental indexing blocks.",
    signal: "Route found",
    detail: "Link → HTML → rendered content",
  },
  {
    id: "index",
    label: "Index",
    title: "The page earns a place in the library.",
    copy: "Canonical signals, semantic structure, and original content help a search engine understand what this page is the best version of.",
    signal: "Meaning understood",
    detail: "Canonical → structure → entity context",
  },
  {
    id: "rank",
    label: "Rank",
    title: "Relevance meets evidence.",
    copy: "For each search, systems compare eligible pages for usefulness, trust, freshness, and the experience they create after the click.",
    signal: "Result earned",
    detail: "Useful answer → click → value",
  },
] as const;

export function SeoPipeline() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const reduceMotion = useReducedMotion();
  const stage = stages[active];

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      setActive((current) => {
        if (current === stages.length - 1) {
          setPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, 1450);
    return () => window.clearTimeout(timer);
  }, [active, playing]);

  const select = (index: number) => {
    setActive(index);
    setPlaying(false);
  };

  return (
    <section aria-label="Interactive SEO journey" className="mt-10 overflow-hidden rounded-2xl border border-gray-200 bg-[#FAFAFA]">
      <div className="border-b border-gray-200 bg-white px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5E6AD2]">Interactive walkthrough</p><p className="mt-1 text-sm text-[#6B7280]">Follow one useful page from question to result.</p></div>
          <div className="flex gap-2">
            <button type="button" onClick={() => { setActive(0); setPlaying(false); }} className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#4B5563] transition hover:border-gray-300 hover:text-[#111827]">Reset</button>
            <button type="button" onClick={() => setPlaying(!playing)} className="rounded-lg bg-[#5E6AD2] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#4F5BBF]">{playing ? "Pause" : active === stages.length - 1 ? "Replay" : "Play journey"}</button>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="grid grid-cols-4 gap-1 rounded-xl bg-white p-1">
          {stages.map((item, index) => (
            <button key={item.id} type="button" onClick={() => select(index)} aria-current={active === index ? "step" : undefined} className={"relative rounded-lg px-2 py-3 text-center text-xs font-semibold transition " + (active === index ? "bg-indigo-50 text-[#4338CA]" : "text-[#6B7280] hover:bg-[#FAFAFA] hover:text-[#374151]")}>
              <span className="mb-1 block font-mono text-[10px] text-[#9CA3AF]">0{index + 1}</span>{item.label}
              {active === index && <motion.span layoutId="seo-active-stage" className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-[#5E6AD2]" transition={{ duration: reduceMotion ? 0 : 0.25 }} />}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={stage.id} initial={reduceMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: -6 }} transition={{ duration: 0.28 }} className="mt-6 grid gap-6 md:grid-cols-[1fr_190px]">
            <div><p className="font-mono text-xs text-[#5E6AD2]">0{active + 1} / {stage.label}</p><h3 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-[#111827]">{stage.title}</h3><p className="mt-3 max-w-[510px] text-[15px] leading-7 text-[#4B5563]">{stage.copy}</p><div className="mt-5 flex items-center gap-2 font-mono text-xs text-[#6B7280]"><span className="h-2 w-2 rounded-full bg-emerald-500" />{stage.detail}</div></div>
            <div className="relative grid min-h-40 place-items-center rounded-xl border border-indigo-100 bg-gradient-to-br from-white to-indigo-50/60 p-5">
              <motion.div key={stage.signal} initial={reduceMotion ? false : { scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 22 }} className="grid h-28 w-28 place-items-center rounded-full border border-indigo-200 bg-white text-center text-xs font-semibold text-[#4338CA] shadow-sm">
                <span>{stage.signal}</span>
              </motion.div>
              <motion.span className="absolute h-36 w-36 rounded-full border border-indigo-200/70" animate={reduceMotion ? undefined : { scale: [0.9, 1.12, 0.9], opacity: [0.25, 0.7, 0.25] }} transition={{ duration: 2.5, repeat: Infinity }} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
