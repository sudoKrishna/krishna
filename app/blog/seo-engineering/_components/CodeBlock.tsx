"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CodeBlock({ path, code }: { path: string; code: string }) {
 const [copied, setCopied] = useState(false);
 const onCopy = async () => { await navigator.clipboard?.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1400); };
 return <div className="overflow-hidden rounded-xl border border-gray-200 bg-[#FAFAFA]">
   <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2.5"><span className="font-mono text-xs text-[#6B7280]">{path}</span><button onClick={onCopy} className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-[#6B7280] transition hover:bg-white hover:text-[#111827]">{copied ? <Check size={14}/> : <Copy size={14}/>} {copied ? "Copied" : "Copy"}</button></div>
   <pre className="overflow-x-auto p-4 text-[13px] leading-6 text-[#374151]"><code>{code}</code></pre>
 </div>;
}