"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const modes = [
  {
    id: "seo",
    label: "SEO",
    title: "Be eligible for the search result.",
    definition: "Search engine optimization makes a useful page easy for search systems to discover, render, understand, index, and rank for a relevant query.",
    focus: ["Crawlable routes", "Useful content", "Clear internal links"],
  },
  {
    id: "aeo",
    label: "AEO",
    title: "Make the answer easy to extract.",
    definition: "Answer engine optimization structures the direct answer, evidence, and next step so an answer surface can retrieve a precise response without guessing.",
    focus: ["Answer first", "Evidence nearby", "Question-shaped headings"],
  },
  {
    id: "geo",
    label: "GEO",
    title: "Earn a place in generative answers.",
    definition: "Generative engine optimization focuses on clear entities, original evidence, trustworthy citations, and complete context that can support an AI-generated answer.",
    focus: ["Entity clarity", "Original proof", "Citable claims"],
  },
] as const;

const stages = [
  { label: "Question", detail: "A person needs an answer or a decision." },
  { label: "Page", detail: "Your page meets that need clearly." },
  { label: "Fetch", detail: "A crawler reaches real server-rendered HTML." },
  { label: "Understand", detail: "Structure, links, and signals explain its role." },
  { label: "Result", detail: "The system can rank or cite the page." },
] as const;

const nextItems = [
  ["Metadata", "Title, description, canonical URL, robots and sitemap are generated close to the route."],
  ["HTML", "Server-rendered headings and content give crawlers meaningful page text before client JavaScript runs."],
  ["Routes", "Stable App Router URLs make information architecture and internal linking deliberate."],
  ["Performance", "Image, font, and code-splitting tools help delivery—but page usefulness still decides the outcome."],
] as const;

const caseSteps = [
  { label: "Baseline", metric: "18%", copy: "Only a small share of priority pages were indexed; navigation buried the strongest guides." },
  { label: "Fix discovery", metric: "76%", copy: "The team added internal hub links, corrected canonicals, and submitted a clean sitemap." },
  { label: "Fix the answer", metric: "2.1×", copy: "Each guide opened with a direct answer, examples, evidence, and a clear next action." },
  { label: "Measure value", metric: "31%", copy: "Qualified organic sign-ups rose after pages were improved against search intent—not after publishing more pages." },
] as const;

export function SeoPipeline() {
  const [mode, setMode] = useState(0);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [caseStep, setCaseStep] = useState(0);
  const reduceMotion = useReducedMotion();
  const currentMode = modes[mode];

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
    }, 1150);
    return () => window.clearTimeout(timer);
  }, [active, playing]);

  return (
    <div className="mt-10 space-y-8">
      <section aria-label="SEO, AEO and GEO explained" className="overflow-hidden rounded-2xl border border-gray-200 bg-[#FAFAFA]">
        <div className="border-b border-gray-200 bg-white px-5 py-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5E6AD2]">Three search surfaces</p>
          <p className="mt-1 text-sm text-[#6B7280]">They overlap. None is a shortcut around useful work.</p>
        </div>
        <div className="p-5 sm:p-6">
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-white p-1">
            {modes.map((item, index) => (
              <button key={item.id} type="button" onClick={() => setMode(index)} className={"rounded-lg px-3 py-3 text-sm font-semibold transition " + (mode === index ? "bg-indigo-50 text-[#4338CA]" : "text-[#6B7280] hover:bg-[#FAFAFA]")}>
                <span className="font-mono text-xs">0{index + 1}</span> {item.label}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={currentMode.id} initial={reduceMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: -6 }} transition={{ duration: 0.28 }} className="mt-6 grid gap-5 md:grid-cols-[1fr_210px]">
              <div><h3 className="text-xl font-semibold tracking-[-0.025em] text-[#111827]">{currentMode.title}</h3><p className="mt-3 max-w-[530px] text-[15px] leading-7 text-[#4B5563]">{currentMode.definition}</p></div>
              <ul className="space-y-2 rounded-xl border border-indigo-100 bg-white p-4 text-sm text-[#4B5563]">{currentMode.focus.map((item) => <li key={item} className="flex gap-2"><span className="text-[#5E6AD2]">✓</span>{item}</li>)}</ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section aria-label="How a page reaches search" className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-5 py-4 sm:px-6">
          <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5E6AD2]">Play the retrieval flow</p><p className="mt-1 text-sm text-[#6B7280]">Follow one strong page from need to result.</p></div>
          <div className="flex gap-2"><button type="button" onClick={() => { setActive(0); setPlaying(false); }} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-[#4B5563] hover:bg-[#FAFAFA]">Reset</button><button type="button" onClick={() => setPlaying((value) => !value)} className="rounded-lg bg-[#5E6AD2] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#4F5BBF]">{playing ? "Pause" : active === stages.length - 1 ? "Replay" : "Play flow"}</button></div>
        </div>
        <div className="p-5 sm:p-6">
          <div className="grid gap-2 sm:grid-cols-5">{stages.map((stage, index) => <button key={stage.label} type="button" onClick={() => { setActive(index); setPlaying(false); }} className={"relative rounded-xl border p-4 text-left transition " + (active === index ? "border-indigo-300 bg-indigo-50/60" : "border-gray-200 bg-[#FAFAFA] hover:border-gray-300")}><span className="font-mono text-[11px] text-[#9CA3AF]">0{index + 1}</span><p className="mt-2 text-sm font-semibold text-[#111827]">{stage.label}</p>{active === index && <motion.span layoutId="flow-dot" className="absolute right-3 top-3 h-2 w-2 rounded-full bg-[#5E6AD2]" />}</button>)}</div>
          <AnimatePresence mode="wait" initial={false}><motion.div key={stages[active].label} initial={reduceMotion ? false : { opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={reduceMotion ? undefined : { opacity: 0, x: -8 }} className="mt-5 rounded-xl bg-[#FAFAFA] p-5"><p className="font-mono text-xs text-[#5E6AD2]">STEP 0{active + 1}</p><p className="mt-2 text-lg font-semibold text-[#111827]">{stages[active].detail}</p><p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B7280]">{active === 0 ? "Good SEO starts before publishing: identify the actual question, intent, and format the searcher expects." : active === 1 ? "A page needs original, complete information—not a template expanded with keywords." : active === 2 ? "If content only appears after an unreliable client-side request, crawlers may receive less than users do." : active === 3 ? "Semantic HTML, internal linking, canonicals, and clear entities remove ambiguity." : "Ranking and citations are outputs of relevance and trust; they are not settings you switch on."}</p></motion.div></AnimatePresence>
        </div>
      </section>

      <section aria-label="What Next.js solves" className="rounded-2xl border border-gray-200 bg-[#FAFAFA] p-5 sm:p-6">
        <div className="max-w-xl"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5E6AD2]">Next.js: helpful, not magic</p><h3 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-[#111827]">Next.js gives you strong delivery primitives.</h3><p className="mt-2 text-sm leading-6 text-[#6B7280]">It can make SEO implementation cleaner. It cannot invent expertise, evidence, demand, or links from trusted sources.</p></div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">{nextItems.map(([title, copy]) => <div key={title} className="rounded-xl border border-gray-200 bg-white p-4"><p className="text-sm font-semibold text-[#111827]">{title}</p><p className="mt-2 text-sm leading-6 text-[#6B7280]">{copy}</p></div>)}</div>
      </section>

      <section aria-label="Illustrative SEO case study" className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4 sm:px-6"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5E6AD2]">Illustrative case study</p><p className="mt-1 text-sm text-[#6B7280]">A transparent model of how a documentation site could improve. These are teaching numbers, not a client claim.</p></div>
        <div className="p-5 sm:p-6"><div className="grid gap-2 sm:grid-cols-4">{caseSteps.map((step, index) => <button key={step.label} type="button" onClick={() => setCaseStep(index)} className={"rounded-xl border p-4 text-left transition " + (caseStep === index ? "border-indigo-300 bg-indigo-50/60" : "border-gray-200 hover:border-gray-300")}><p className="font-mono text-xs text-[#9CA3AF]">0{index + 1}</p><p className="mt-2 text-sm font-semibold">{step.label}</p><p className="mt-3 text-2xl font-semibold tabular-nums text-[#5E6AD2]">{step.metric}</p></button>)}</div><motion.div key={caseStep} initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5 rounded-xl bg-[#FAFAFA] p-5"><p className="text-sm leading-7 text-[#374151]">{caseSteps[caseStep].copy}</p><p className="mt-3 text-xs text-[#6B7280]">The lesson: fix the bottleneck in sequence—discovery, understanding, usefulness, then business value.</p></motion.div></div>
      </section>
    </div>
  );
}
