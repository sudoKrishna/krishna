import Image from "next/image";
import Link from "next/link";
import Hero from "./components/Hero";
import { CardRow } from "./components/CardRow";
import { EdgeBlur } from "./components/EdgeBlur";
import { PeaceOut } from "./components/PeaceOut";
import { MoreLinks } from "./components/MoreLinks";
import { InteractiveWorldEmbed } from "./components/InteractiveWorldEmbed";

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
        <div className="mt-2.5 grid max-w-xl gap-3">
          <Link
            href="/blog/llm-inference"
            className="group inline-flex max-w-full items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
          >
            <Image
              src="/blog/llm-inference-cover.jpg"
              width={600}
              height={359}
              alt=""
              sizes="(min-width: 640px) 128px, 104px"
              className="h-auto w-[104px] shrink-0 rounded-md sm:w-32"
            />
            <h3 className="text-sm font-semibold tracking-tight sm:text-[15px]">
              Why is LLM inference so hard?
            </h3>
          </Link>
          <Link
            href="/blog/seo-engineering"
            className="inline-flex max-w-full items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
          >
            <div className="grid h-[70px] w-[104px] shrink-0 place-items-center text-center">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#5E6AD2]">SEO</span>
              <span className="-mt-4 text-[10px] text-[#6B7280]">Engineering</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-tight  sm:text-[15px]">
                SEO engineering: a system for being found
              </h3>
            </div>
          </Link>
        </div>
      </section>

      <InteractiveWorldEmbed />

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
