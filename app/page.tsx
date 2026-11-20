import Link from "next/link";
import Hero from "./components/Hero";
import { CardRow } from "./components/CardRow";
import { EdgeBlur } from "./components/EdgeBlur";
import { PeaceOut } from "./components/PeaceOut";
import { MoreLinks } from "./components/MoreLinks";

export default function Home() {
  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <EdgeBlur />

      <Hero />

      <CardRow />

      <section id="blog" aria-labelledby="blog-heading" className="mx-auto w-full max-w-4xl px-6">
        <h2 id="blog-heading" className="text-[15px] font-medium text-[#1a1a1a]">
          Blog
        </h2>
        <Link
          href="/blog/llm-inference"
          className="group mt-3 flex flex-col gap-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors hover:border-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black sm:flex-row sm:items-center"
        >
          <span
            aria-hidden="true"
            className="flex h-24 shrink-0 items-center justify-center rounded-xl bg-[#212121] bg-[repeating-linear-gradient(0deg,transparent_0_13px,#2a4030_13px_14px),repeating-linear-gradient(90deg,transparent_0_13px,#2a4030_13px_14px)] sm:w-32"
          >
            <span className="flex h-12 w-12 rotate-12 items-center justify-center rounded-md border border-[#9a9a9a] bg-[#383838] shadow-[4px_5px_0_#171717] transition-transform group-hover:rotate-0 motion-reduce:transition-none">
              <span className="h-7 w-7 rounded-sm border border-[#d0d0d0] bg-[#e8e8e8] bg-[repeating-linear-gradient(90deg,transparent_0_5px,#8ab55b_5px_6px),repeating-linear-gradient(0deg,transparent_0_5px,#8ab55b_5px_6px)]" />
            </span>
          </span>
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-[var(--foreground)] group-hover:text-black">
              Why is LLM inference so hard?
            </h3>
            <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
              From prompt to token, with a 3D GPU cutaway, interactive memory and cost
              calculators, and a roadmap to serving models with vLLM.
            </p>
          </div>
        </Link>
      </section>

      <div className="mx-auto w-full max-w-4xl px-6 pt-16">
        <h2 className="text-[15px] font-medium text-[#1a1a1a]">More</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          <MoreLinks />
        </p>
      </div>

      <PeaceOut />
    </div>
  );
}
