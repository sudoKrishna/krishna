import Image from "next/image";
import Link from "next/link";
import Hero from "./components/Hero";
import { CardRow } from "./components/CardRow";
import { EdgeBlur } from "./components/EdgeBlur";
import { PeaceOut } from "./components/PeaceOut";
import { GitHubContributions } from "./components/GitHubContributions";
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
          className="group mt-2.5 inline-flex max-w-full items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
        >
          <Image
            src="/blog/llm-inference-cover.jpg"
            width={600}
            height={359}
            alt=""
            sizes="(min-width: 640px) 128px, 104px"
            className="h-auto w-[104px] shrink-0 rounded-md sm:w-32"
          />
          <h3 className="text-sm font-semibold tracking-tight group-hover:underline group-focus-visible:underline sm:text-[15px]">
            Why is LLM inference so hard?
          </h3>
        </Link>
      </section>

      <GitHubContributions />

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
