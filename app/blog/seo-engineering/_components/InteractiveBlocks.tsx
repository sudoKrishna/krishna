"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export function Comparison() {
  return <div className="grid gap-4 md:grid-cols-2">
    <div className="rounded-xl border border-gray-200 bg-white p-5"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">Publishing project</p><div className="mt-5 flex items-center gap-2 text-sm font-medium"><span className="rounded-md border bg-[#FAFAFA] px-2.5 py-2">Research</span><span className="text-[#9CA3AF]">→</span><span className="rounded-md border bg-[#FAFAFA] px-2.5 py-2">Publish</span><span className="text-[#9CA3AF]">→</span><span className="rounded-md border bg-[#FAFAFA] px-2.5 py-2">Ship</span></div><ul className="mt-5 space-y-1.5 text-sm leading-6 text-[#6B7280]"><li>• A clear, complete artifact</li><li>• One-time launch success</li></ul></div>
    <div className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-5"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5E6AD2]">Search product</p><div className="mt-4 flex items-center justify-center"><div className="grid h-28 w-28 place-items-center rounded-full border-2 border-dashed border-indigo-300 p-3 text-center text-xs font-semibold text-[#4338CA]">Ship<br />↓<br />Watch · Learn<br />↓<br />Improve</div></div><ul className="mt-3 space-y-1.5 text-sm leading-6 text-[#6B7280]"><li>• Repeated observation and learning</li><li>• Query, ranking, and conversion feedback</li></ul></div>
  </div>;
}

export function ArchitectureFlow() {
  const [active, setActive] = useState("Web app");
  const stages = [["You", "Search question"], ["Web app", "Semantic HTML"], ["Backend", "Metadata + sitemap"], ["Search", "Crawl, index, retrieve"]];
  return <div className="overflow-x-auto rounded-2xl border border-gray-200/80 bg-[#FAFAFA] p-6"><div className="flex min-w-[580px] items-stretch gap-2">{stages.map(([title, subtitle], index) => (
    <div key={title} className="flex items-center gap-2"><button onClick={() => setActive(title)} className={"w-28 rounded-xl border p-3 text-left transition " + (active === title ? "border-indigo-300 bg-white shadow-sm" : "border-gray-200 bg-white/70 hover:bg-white")}><p className="text-sm font-semibold">{title}</p><p className="mt-1 text-[11px] leading-4 text-[#6B7280]">{subtitle}</p></button>{index < stages.length - 1 && <div className="relative w-10 border-t border-dashed border-[#9CA3AF]"><span className="absolute -top-5 left-0 w-12 text-center text-[9px] text-[#6B7280]">{["Intent", "HTML", "Signals"][index]}</span><span className="absolute -right-0.5 -top-[3px] border-y-4 border-l-4 border-y-transparent border-l-[#9CA3AF]" /></div>}</div>
  ))}</div><p className="mt-5 text-sm text-[#6B7280]"><span className="font-semibold text-[#111827]">{active}</span> is one part of the retrieval system. Make the hand-off explicit, useful, and measurable.</p></div>;
}

const bars = [3, 8, 5, 11, 7, 14, 9, 17, 12, 20, 16, 23];
export function CommitChart() {
  const [active, setActive] = useState(11);
  return <div className="rounded-2xl border border-gray-200/80 bg-[#FAFAFA] p-5"><div className="flex h-36 items-end gap-1.5">{bars.map((value, index) => (
    <button key={index} onMouseEnter={() => setActive(index)} onClick={() => setActive(index)} aria-label={"Day " + (index + 1) + ": " + value + " improvements"} className="group flex h-full flex-1 items-end"><motion.span animate={{ height: value / 24 * 100 + "%" }} transition={{ duration: 0.35 }} className={"w-full rounded-t-sm transition-colors " + (active === index ? "bg-[#5E6AD2]" : "bg-indigo-200 group-hover:bg-indigo-300")} /></button>
  ))}</div><div className="mt-3 flex justify-between text-[11px] text-[#6B7280]"><span>Week 1</span><span className="font-medium text-[#4338CA]">Day {active + 1}: {bars[active]} tracked improvements</span><span>Week 2</span></div></div>;
}

const cases = ["Real user?", "Already a member?", "Link expired?", "Double click?", "Wrong workspace?", "No permission?", "Invite revoked?", "Email typo?"];
export function EdgeCaseMatrix() {
  const [active, setActive] = useState<number | null>(null);
  return <div className="rounded-2xl border border-gray-200/80 bg-[#FAFAFA] p-6"><div className="mx-auto max-w-[220px] rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm"><span className="rounded-lg bg-[#5E6AD2] px-3 py-2 text-sm font-semibold text-white">+ Add collaborator</span><p className="mt-3 text-[11px] text-[#6B7280]">the visible happy path</p></div><div className="mx-auto h-8 w-px border-l border-dashed border-[#9CA3AF]" /><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{cases.map((item, index) => (
    <button key={item} onMouseEnter={() => setActive(index)} onMouseLeave={() => setActive(null)} onFocus={() => setActive(index)} onBlur={() => setActive(null)} className={"rounded-lg border px-3 py-3 text-left text-xs font-medium transition " + (active === index ? "border-indigo-300 bg-indigo-50 text-[#4338CA]" : "border-gray-200 bg-white text-[#4B5563]")}>{item}</button>
  ))}</div><p className="mt-4 text-center text-xs text-[#6B7280]">{active === null ? "Hover an edge case: search systems need the same careful thinking." : "This is where trust is won: predictable behavior for “" + cases[active] + "”."}</p></div>;
}