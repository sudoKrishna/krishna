"use client";

import { Jersey_10, Edu_NSW_ACT_Cursive } from "next/font/google";
import { GitBranch } from "lucide-react";

const jersey = Jersey_10({
  subsets: ["latin"],
  weight: "400",
});

const cursiveFont = Edu_NSW_ACT_Cursive({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const contributionLevels = [
  "bg-[#EBEDF0]",
  "bg-[#9BE9A8]",
  "bg-[#40C463]",
  "bg-[#30A14E]",
  "bg-[#216E39]",
];

const pinnedRepos = [
  {
    title: "eventflow",
    description:
      "Scalable event-driven architecture boilerplate with CQRS and Redis Streams.",
    language: "TypeScript",
    color: "bg-blue-500",
    link: "https://github.com/yourusername/eventflow",
  },
  {
    title: "vector-search-ai",
    description:
      "Semantic search engine powered by Qdrant, OpenAI embeddings, and Next.js.",
    language: "Python",
    color: "bg-yellow-500",
    link: "https://github.com/yourusername/vector-search-ai",
  },
  {
    title: "kube-lite",
    description:
      "Minimal Kubernetes deployment templates optimized for k3s environments.",
    language: "Go",
    color: "bg-cyan-500",
    link: "https://github.com/yourusername/kube-lite",
  },
  {
    title: "realtime-chat",
    description:
      "Realtime chat platform using WebSockets, Redis, and React Query.",
    language: "JavaScript",
    color: "bg-yellow-400",
    link: "https://github.com/yourusername/realtime-chat",
  },
];

export default function GithubPage() {
  return (
    <section className="min-h-screen px-6 py-20 transition-all duration-700 bg-[#EBEAE2] text-black">
      <div className="mx-auto max-w-6xl">
        {/* HERO */}
        <div className="flex flex-col gap-3">
          <h1
            className={`${jersey.className} text-[90px] md:text-[120px] leading-[0.9] tracking-wide`}
          >
            <span className="text-[#4A5D23]">GitHub</span>{" "}
            <span className="text-black">Realm</span>
          </h1>

          <h2
            className={`${cursiveFont.className} ml-1 text-lg md:text-xl text-[#6C7B4B]`}
          >
            A glimpse into my open-source contributions and pinned projects.
          </h2>
        </div>

        {/* CONTRIBUTION CARD */}
        <div className="mt-20 overflow-hidden rounded-[32px] border shadow-sm transition-all duration-500 bg-[#F5F3EB] border-black/10">
          {/* TOP */}
          <div className="flex flex-col justify-between gap-6 border-b border-black/10 px-8 py-6 md:flex-row md:items-center">
            <div>
              <h3
                className={`${jersey.className} text-4xl tracking-wide text-black`}
              >
                Contributions
              </h3>

              <p className={`${cursiveFont.className} mt-2 text-[#6C7B4B]`}>
                Consistent commits, experiments, and open-source crafting.
              </p>
            </div>

            <a
              href="https://github.com/sudoKrishna"
              target="_blank"
              className="flex w-fit items-center gap-3 rounded-full border px-5 py-3 transition-all duration-200 hover:-translate-y-1 bg-[#4A5D23] text-[#F5F3EB] border-black/10"
            >
              <GitBranch size={18} />

              <span className={`${cursiveFont.className} text-sm`}>
                Visit GitHub
              </span>
            </a>
          </div>

          {/* CONTRIBUTION GRID */}
          <div className="overflow-x-auto px-8 py-8">
            <div className="flex min-w-[820px] gap-[4px]">
              {Array.from({ length: 53 }).map((_, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[4px]">
                  {Array.from({ length: 7 }).map((_, dayIndex) => {
                    const color =
                      contributionLevels[
                        Math.floor(Math.random() * contributionLevels.length)
                      ];

                    return (
                      <div
                        key={dayIndex}
                        className={`h-3.5 w-3.5 rounded-[3px] ${color}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>

            {/* BOTTOM */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`${jersey.className} text-3xl text-[#4A5D23]`}>
                  900
                </span>

                <span className={`${cursiveFont.className} text-[#6C7B4B]`}>
                  contributions
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`${cursiveFont.className} text-sm`}>
                  Less
                </span>

                {contributionLevels.map((color, index) => (
                  <div
                    key={index}
                    className={`h-3.5 w-3.5 rounded-[3px] ${color}`}
                  />
                ))}

                <span className={`${cursiveFont.className} text-sm`}>
                  More
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}