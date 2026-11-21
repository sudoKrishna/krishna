import type { Metadata } from "next";
import { CircleCheck, ExternalLink } from "lucide-react";
import { BlogLayout, Reveal, SectionTitle } from "./_components/BlogLayout";
import { Callout } from "./_components/Callout";
import { CodeBlock } from "./_components/CodeBlock";
import { ArchitectureFlow, CommitChart, Comparison } from "./_components/InteractiveBlocks";
import { SeoPipeline } from "./_components/SeoPipeline";

export const metadata: Metadata = {
  title: "SEO, AEO and GEO explained | Krishna Chaudhary",
  description: "An interactive technical guide to SEO, AEO, GEO and implementing search-friendly pages in Next.js.",
};

const toc = [
  { id: "overview", label: "Overview" },
  { id: "search-surfaces", label: "SEO, AEO & GEO" },
  { id: "nextjs", label: "What Next.js does" },
  { id: "case-study", label: "Case study model" },
  { id: "measurement", label: "Measure and improve" },
];

const robots = `export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://your-domain.com/sitemap.xml",
  };
}`;

export default function SeoEngineeringCaseStudy() {
  return (
    <BlogLayout toc={toc}>
      <header id="overview" className="scroll-mt-16">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5E6AD2]">Interactive technical guide</p>
        <h1 className="mt-3 max-w-2xl text-[34px] font-semibold leading-[1.08] tracking-[-0.035em] text-[#111827] sm:text-[44px]">
          How a useful page becomes findable.
        </h1>
        <p className="mt-6 max-w-[680px] text-[17px] leading-8 text-[#374151]">
          SEO is how pages earn a place in traditional search. AEO makes direct answers easy to retrieve. GEO helps trustworthy information become useful in generative search. The shared foundation is simple: publish the best answer, make it technically understandable, then learn from real users.
        </p>
        <div className="mt-9 grid grid-cols-2 gap-5 border-y border-gray-100 py-6 sm:grid-cols-4">
          {[
            ["SEO", "Search results", "discover · index · rank"],
            ["AEO", "Answer systems", "direct · grounded · clear"],
            ["GEO", "Generative search", "entities · evidence · citations"],
            ["NEXT.JS", "Implementation", "HTML · metadata · routes"],
          ].map(([label, value, detail]) => (
            <div key={label}>
              <p className="text-[10px] font-semibold tracking-[0.13em] text-[#9CA3AF]">{label}</p>
              <p className="mt-2 text-lg font-semibold tracking-tight text-[#111827]">{value}</p>
              <p className="mt-1 text-xs text-[#6B7280]">{detail}</p>
            </div>
          ))}
        </div>
      </header>

      <article className="mt-12 space-y-20">
        <section id="search-surfaces" className="scroll-mt-16">
          <Reveal>
            <SectionTitle number="01">SEO, AEO and GEO solve related problems.</SectionTitle>
            <p className="mt-5 max-w-[680px] text-[16.5px] leading-8 text-[#374151]">
              They are not three tricks to rank at the top. They describe three places where people may discover your information. Strong content and solid technical foundations help in all three places.
            </p>
          </Reveal>
          <SeoPipeline />
          <Reveal className="mt-8">
            <Callout>
              <ul className="space-y-2">
                <li>• SEO: help search systems find, understand, and rank a page for a relevant need.</li>
                <li>• AEO: put the concise answer and supporting proof where an answer system can retrieve them.</li>
                <li>• GEO: make claims attributable, accurate, and connected to known people, products, or concepts.</li>
              </ul>
            </Callout>
          </Reveal>
        </section>

        <section id="nextjs" className="scroll-mt-16">
          <Reveal>
            <SectionTitle number="02">What Next.js does—and what it cannot do.</SectionTitle>
            <p className="mt-5 max-w-[680px] text-[16.5px] leading-8 text-[#374151]">
              Next.js is excellent for the engineering side: route-level metadata, server-rendered content, semantic HTML, redirects, sitemaps, robots rules, image optimization, and performance-aware delivery. These remove barriers. They do not make weak content useful or establish trust by themselves.
            </p>
          </Reveal>
          <Reveal className="mt-8"><ArchitectureFlow /></Reveal>
          <Reveal className="mt-8"><CodeBlock path="app/robots.ts" code={robots} /></Reveal>
          <Reveal className="mt-8">
            <Comparison />
          </Reveal>
        </section>

        <section id="case-study" className="scroll-mt-16">
          <Reveal>
            <SectionTitle number="03">How an SEO improvement project actually works.</SectionTitle>
            <p className="mt-5 max-w-[680px] text-[16.5px] leading-8 text-[#374151]">
              Start with diagnosis, not a content calendar. First determine whether the page is discoverable, whether it matches the query’s intent, whether the result earns the click, and whether the visit produces value. The interactive model above shows an illustrative sequence, not results claimed for a real client.
            </p>
          </Reveal>
          <Reveal className="mt-8">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["1. Diagnose", "Inspect coverage, crawl paths, internal links, canonicals, titles, and the live result page."],
                ["2. Improve one bottleneck", "Fix the reason the page cannot be found, understood, clicked, or trusted."],
                ["3. Observe", "Give the change time, compare query groups, and keep a changelog so correlation is not confused with proof."],
              ].map(([title, detail]) => (
                <div key={title} className="rounded-xl border border-gray-200 bg-white p-5">
                  <p className="text-sm font-semibold text-[#111827]">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-[#6B7280]">{detail}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <section id="measurement" className="scroll-mt-16">
          <Reveal>
            <SectionTitle number="04">Measure the whole path, not only position.</SectionTitle>
            <p className="mt-5 max-w-[680px] text-[16.5px] leading-8 text-[#374151]">
              A higher rank is not automatically a better business outcome. Watch index coverage, impressions, click-through rate, qualified sessions, engagement, conversion, and the query clusters behind each number.
            </p>
          </Reveal>
          <Reveal className="mt-8"><CommitChart /></Reveal>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {[
              ["Can it be found?", "Coverage, crawlability, indexation"],
              ["Does it win the click?", "Impressions, titles, snippets, CTR"],
              ["Does it help?", "Engagement, leads, sign-ups, revenue"],
            ].map(([title, detail], index) => (
              <Reveal key={title}>
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <CircleCheck size={17} className="text-[#5E6AD2]" />
                  <p className="mt-3 text-sm font-semibold">{index + 1}. {title}</p>
                  <p className="mt-1 text-xs leading-5 text-[#6B7280]">{detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <a href="https://developers.google.com/search/docs/fundamentals/seo-starter-guide" target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#5E6AD2] hover:underline">
            Read Google’s SEO starter guide <ExternalLink size={14} />
          </a>
        </section>
      </article>
    </BlogLayout>
  );
}
