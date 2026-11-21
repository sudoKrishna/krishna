import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { BlogLayout, Reveal, SectionTitle } from "./_components/BlogLayout";
import { Callout } from "./_components/Callout";
import { CodeBlock } from "./_components/CodeBlock";
import { ArchitectureFlow, Comparison, EdgeCaseMatrix } from "./_components/InteractiveBlocks";
import { SeoPipeline } from "./_components/SeoPipeline";

export const metadata: Metadata = { title: "SEO engineering: a system for being found | Krishna Chaudhary", description: "A technical case study on modern SEO, AEO, GEO, and the engineering systems behind durable organic visibility." };

const toc=[{id:"overview",label:"Overview"},{id:"seo-system",label:"Search is a system"},{id:"technical-foundation",label:"Technical foundation"},{id:"answer-engines",label:"AEO & GEO"},{id:"case-study",label:"Case study"},{id:"framework",label:"A practical framework"}];

const robots=`export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://krishna-ten-wheat.vercel.app/sitemap.xml",
  };
}`;

export default function SeoEngineeringCaseStudy() {
 return <BlogLayout toc={toc}>
  <header id="overview" className="scroll-mt-16">
   <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5E6AD2]">Technical case study</p><h1 className="mt-3 max-w-xl text-[34px] font-semibold leading-[1.08] tracking-[-0.035em] text-[#111827] sm:text-[42px]">SEO engineering: a system for being found.</h1></div><div className="flex shrink-0 items-center gap-2 rounded-full border border-[#E5E7EB] bg-[#FAFAFA] px-3 py-2 text-xs text-[#6B7280]"><span className="h-2 w-2 rounded-full bg-emerald-500"/>SEO field notes <span className="text-[#D1D5DB]">•</span> Nov 2026 <span className="text-[#D1D5DB]">•</span> 12 min</div></div>
   <p className="mt-8 max-w-[680px] text-[17px] leading-8 text-[#374151]">Ranking is not a bag of keyword tricks. It is a product and engineering discipline: make the right information easy to discover, easy to understand, and strong enough to earn trust.</p>
  </header>

  <SeoPipeline />

  <article className="mt-16 space-y-20">
   <section id="seo-system" className="scroll-mt-16"><Reveal><SectionTitle number="01">Search is a system, not a checklist.</SectionTitle><p className="mt-5 max-w-[680px] text-[16.5px] leading-8 text-[#374151]">A great page can still fail if it is undiscoverable. A perfectly crawlable page can still fail if it does not meet the searcher’s real need. The work is to connect intent, information architecture, implementation, and feedback into one loop.</p></Reveal><Reveal className="mt-8"><Comparison /></Reveal><Reveal className="mt-8"><Callout><ul className="space-y-2"><li>• Start with the query and the decision it represents.</li><li>• Inspect the live results before selecting a format.</li><li>• Design the page to be the best next step—not merely a keyword container.</li></ul></Callout></Reveal></section>

   <section id="technical-foundation" className="scroll-mt-16"><Reveal><SectionTitle number="02">The technical foundation.</SectionTitle><p className="mt-5 max-w-[680px] text-[16.5px] leading-8 text-[#374151]">Before a page can rank, a search engine needs to fetch it, render it, understand its canonical identity, and decide it is worth indexing. On a Next.js app, that means server-visible text, semantic HTML, stable URLs, and a clear route map.</p></Reveal><Reveal className="mt-8"><ArchitectureFlow /></Reveal><Reveal className="mt-8"><CodeBlock path="app/robots.ts" code={robots} /></Reveal><blockquote className="my-9 border-l-[3px] border-[#5E6AD2] py-1 pl-5 text-[19px] font-semibold leading-8 tracking-[-0.02em] text-[#111827]">“A search engine cannot reward information it cannot reliably reach, render, and interpret.”<footer className="mt-3 text-xs font-medium uppercase tracking-[0.12em] text-[#6B7280]">Krishna Chaudhary · Engineering notes</footer></blockquote></section>

   <section id="answer-engines" className="scroll-mt-16"><Reveal><SectionTitle number="03">AEO and GEO: clarity that can be retrieved.</SectionTitle><p className="mt-5 max-w-[680px] text-[16.5px] leading-8 text-[#374151]">Answer engines reward a familiar quality: content that makes a useful claim, supports it with evidence, and gives the reader enough context to act. AEO helps a page answer directly. GEO extends the same discipline to generative search experiences, where cited evidence and entity clarity matter.</p></Reveal><Reveal className="mt-8"><Callout type="note">There is no magic “AI ranking file.” Build strong SEO fundamentals first, then make primary answers direct, factual, sourced, and easy to scan.</Callout></Reveal><Reveal className="mt-8"><EdgeCaseMatrix /></Reveal></section>

   <section id="case-study" className="scroll-mt-16"><Reveal><SectionTitle number="05">A case study starts with the bottleneck.</SectionTitle><p className="mt-5 max-w-[680px] text-[16.5px] leading-8 text-[#374151]">A useful SEO project is rarely “publish ten articles.” It is usually one focused diagnosis: a strong page is invisible, a result is not earning clicks, or visitors do not reach the next useful action.</p></Reveal><div className="mt-8 grid gap-3 sm:grid-cols-3">{[["1. Find the break","Compare index coverage, query intent, the live result, and the on-page answer before changing anything."],["2. Make one meaningful fix","For example: merge competing pages, add an internal hub link, or replace a vague introduction with a direct answer."],["3. Keep a change log","Record what changed, when it changed, and which query group should respond. This keeps learning honest."]].map(([title,detail])=><Reveal key={title}><div className="rounded-xl border border-gray-200 bg-[#FAFAFA] p-5"><h3 className="text-sm font-semibold text-[#111827]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#6B7280]">{detail}</p></div></Reveal>)}</div></section>

   <section id="framework" className="scroll-mt-16"><Reveal><SectionTitle number="06">A practical framework for every page.</SectionTitle></Reveal><div className="mt-8 divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">{[["1","Inspiration","Observe the user question, SERP, product context, and competing alternatives."],["2","Decode","Translate intent into a page type, content brief, and technical requirements."],["3","Internalize","Build the answer into semantic HTML, metadata, internal links, and supporting evidence."],["4","Refine","Measure behavior, improve the weak step, and document what changed."]].map(([number,title,detail])=><Reveal key={number}><div className="flex gap-4 p-5"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#F3F4F6] font-mono text-xs text-[#5E6AD2]">{number}</span><div><h3 className="font-semibold">{title}</h3><p className="mt-1 text-sm leading-6 text-[#6B7280]">{detail}</p></div></div></Reveal>)}</div><a href="https://developers.google.com/search/docs/fundamentals/seo-starter-guide" target="_blank" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#5E6AD2] hover:underline">Read Google’s SEO starter guide <ExternalLink size={14}/></a></section>
  </article>
 </BlogLayout>;
}