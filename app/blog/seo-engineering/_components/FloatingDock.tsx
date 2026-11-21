"use client";

import { Check, Copy, Github, Linkedin, TextCursorInput, Twitter } from "lucide-react";
import { useEffect, useState } from "react";
import type { TocItem } from "./BlogLayout";

export function FloatingDock({ toc, active }: { toc: TocItem[]; active: string }) {
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [largeText, setLargeText] = useState(false);
  useEffect(() => {
    const onScroll = () => setProgress(Math.min(100, Math.round((window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)) * 100)));
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const copy = async () => { await navigator.clipboard?.writeText(window.location.href); setCopied(true); window.setTimeout(() => setCopied(false), 1500); };
  const label = toc.find(item => item.id === active)?.label ?? "Introduction";
  const radius = 11, circumference = 2 * Math.PI * radius;
  const iconClass = "rounded-full p-1.5 text-[#6B7280] transition hover:bg-[#F3F4F6] hover:text-[#111827] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5E6AD2]";
  return <div className="fixed bottom-5 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-fit -translate-x-1/2 items-center gap-2 rounded-full border border-gray-200/80 bg-white/85 px-3 py-2 shadow-lg shadow-slate-900/5 backdrop-blur-md">
    <svg width="28" height="28" viewBox="0 0 28 28" aria-label={progress + "% read"}><circle cx="14" cy="14" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="2"/><circle cx="14" cy="14" r={radius} fill="none" stroke="#5E6AD2" strokeWidth="2" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference - progress / 100 * circumference} transform="rotate(-90 14 14)"/></svg>
    <span className="max-w-28 truncate text-xs font-medium text-[#374151] sm:max-w-40">{label}</span>
    <span className="mx-1 h-5 w-px bg-[#E5E7EB]" />
    <a className={iconClass} href="https://github.com/sudoKrishna/krishna" target="_blank" aria-label="GitHub"><Github size={16}/></a>
    <a className={iconClass} href={"https://twitter.com/intent/tweet?url=" + encodeURIComponent(typeof window === "undefined" ? "" : window.location.href)} target="_blank" aria-label="Share on X"><Twitter size={16}/></a>
    <a className={iconClass} href={"https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(typeof window === "undefined" ? "" : window.location.href)} target="_blank" aria-label="Share on LinkedIn"><Linkedin size={16}/></a>
    <button className={iconClass} onClick={copy} aria-label="Copy link">{copied ? <Check size={16} className="text-emerald-600"/> : <Copy size={16}/>}</button>
    <button className={iconClass} onClick={() => { setLargeText(!largeText); document.documentElement.classList.toggle("seo-reading-large", !largeText); }} aria-label="Toggle reading size"><TextCursorInput size={16}/></button>
  </div>;
}