"use client";

import { Expand, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

const items = [
  ["Search intent", "The brief begins with the question—not the keyword."],
  ["Page anatomy", "The important answer is visible in HTML, not hidden in a client-only interaction."],
  ["Evidence", "Original data, clear authorship, and dated updates increase confidence."],
  ["Structure", "Helpful headings make both scanning and extraction easier."],
  ["Next action", "Internal links send readers to the next useful decision."],
];

export function AnnotatedImage() {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  const preview = (
    <div className="relative overflow-hidden rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 border-b border-[#F0F1F3] pb-3 text-[11px] text-[#9CA3AF]">
        <span className="h-2 w-2 rounded-full bg-[#E5E7EB]" /><span className="h-2 w-2 rounded-full bg-[#E5E7EB]" /><span className="h-2 w-2 rounded-full bg-[#E5E7EB]" />
        <span className="ml-2 rounded bg-[#FAFAFA] px-2 py-1">example.com/technical-seo</span>
      </div>
      <div className="grid grid-cols-[1fr_70px] gap-5 py-6">
        <div><div className="h-3 w-20 rounded bg-indigo-100" /><div className="mt-3 h-5 w-4/5 rounded bg-slate-800" /><div className="mt-4 space-y-2"><div className="h-2.5 w-full rounded bg-slate-100" /><div className="h-2.5 w-11/12 rounded bg-slate-100" /><div className="h-2.5 w-2/3 rounded bg-slate-100" /></div><div className="mt-6 h-24 rounded-lg border border-slate-100 bg-[#FAFAFA] p-3"><div className="h-2.5 w-24 rounded bg-slate-200" /><div className="mt-3 h-2 w-full rounded bg-slate-100" /><div className="mt-2 h-2 w-5/6 rounded bg-slate-100" /></div></div>
        <div className="space-y-3 border-l border-slate-100 pl-3"><Search size={15} className="text-[#5E6AD2]" /><div className="h-2 w-full rounded bg-slate-100" /><div className="h-2 w-4/5 rounded bg-slate-100" /><SlidersHorizontal size={15} className="mt-6 text-slate-300" /></div>
      </div>
      {[[24, 36], [44, 51], [31, 78], [67, 44], [72, 88]].map(([top, left], index) => (
        <button key={index} onMouseEnter={() => setActive(index)} onClick={() => setActive(index)} style={{ top: top + "%", left: left + "%" }} className={"absolute grid h-6 w-6 place-items-center rounded-full border-2 border-white text-xs font-bold text-white shadow transition " + (active === index ? "scale-125 bg-[#4338CA]" : "bg-[#5E6AD2]")}>
          {index + 1}
        </button>
      ))}
    </div>
  );

  return <div className="rounded-2xl border border-gray-200/80 bg-[#FAFAFA] p-4 sm:p-6"><div className="relative">{preview}<button onClick={() => setOpen(true)} className="absolute right-3 top-3 rounded-md bg-white p-2 text-[#6B7280] shadow-sm transition hover:text-[#111827]" aria-label="Expand annotated example"><Expand size={16} /></button></div>
    <ol className="mt-5 grid gap-2 sm:grid-cols-2">{items.map(([title, detail], index) => (
      <li key={title} onMouseEnter={() => setActive(index)} className={"cursor-default rounded-lg border p-3 transition " + (active === index ? "border-indigo-200 bg-indigo-50/50" : "border-transparent")}><span className="mr-2 inline-grid h-5 w-5 place-items-center rounded-full bg-[#5E6AD2] text-[11px] font-bold text-white">{index + 1}</span><span className="text-sm font-semibold">{title}</span><p className="mt-1 pl-7 text-xs leading-5 text-[#6B7280]">{detail}</p></li>
    ))}</ol>
    {open && <div role="dialog" aria-modal="true" className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/60 p-5" onClick={() => setOpen(false)}><div className="w-full max-w-4xl rounded-2xl bg-white p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}>{preview}<button onClick={() => setOpen(false)} className="mt-4 text-sm font-medium text-[#5E6AD2]">Close preview</button></div></div>}
  </div>;
}