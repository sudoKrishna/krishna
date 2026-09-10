"use client";

import { useEffect, useRef, useState } from "react";
import { Geist_Mono } from "next/font/google";
import { GitBranch, Terminal } from "lucide-react";

const mono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

// GitHub dark-mode contribution scale
const contributionLevels = [
  "bg-[#161b22] border border-[#262c36]",
  "bg-[#0e4429]",
  "bg-[#006d32]",
  "bg-[#26a641]",
  "bg-[#39d353]",
];

const WEEKS = 53;
const DAYS = 7;
const TOTAL_CONTRIBUTIONS = 900;

// deterministic pseudo-random so server/client render match (avoids hydration mismatch)
function seededLevel(seed: number) {
  const x = Math.sin(seed * 999.7) * 10000;
  const frac = x - Math.floor(x);
  return Math.floor(frac * contributionLevels.length);
}

const grid = Array.from({ length: WEEKS }, (_, weekIndex) =>
  Array.from({ length: DAYS }, (_, dayIndex) =>
    seededLevel(weekIndex * DAYS + dayIndex)
  )
);

const pinnedRepos = [
  {
    title: "eventflow",
    description:
      "Scalable event-driven architecture boilerplate with CQRS and Redis Streams.",
    language: "TypeScript",
    color: "bg-blue-500",
    link: "https://github.com/sudoKrishna/eventflow",
  },
  {
    title: "vector-search-ai",
    description:
      "Semantic search engine powered by Qdrant, OpenAI embeddings, and Next.js.",
    language: "Python",
    color: "bg-yellow-500",
    link: "https://github.com/sudoKrishna/vector-search-ai",
  },
  {
    title: "kube-lite",
    description:
      "Minimal Kubernetes deployment templates optimized for k3s environments.",
    language: "Go",
    color: "bg-cyan-500",
    link: "https://github.com/sudoKrishna/kube-lite",
  },
  {
    title: "realtime-chat",
    description:
      "Realtime chat platform using WebSockets, Redis, and React Query.",
    language: "JavaScript",
    color: "bg-yellow-400",
    link: "https://github.com/sudoKrishna/realtime-chat",
  },
];

export default function GithubPage() {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [count, setCount] = useState(0);

  // trigger cell animation + count-up once the grid scrolls into view
  useEffect(() => {
    const node = gridRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;

    let raf: number;
    const start = performance.now();
    const duration = 1200;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.floor(progress * TOTAL_CONTRIBUTIONS));

      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  return (
    <section className="min-h-screen px-6 py-20 bg-[#0a0e14] text-[#e6edf3]">
      <div className="mx-auto max-w-6xl">
        {/* HERO */}
        <div className="flex flex-col gap-3">
          <h1
            className={`${mono.className} flex items-center gap-3 text-4xl md:text-6xl font-bold tracking-tight`}
          >
            <Terminal className="text-[#39d353]" size={36} />
            <span className="text-[#e6edf3]">git</span>
            <span className="text-[#39d353]">log</span>
            <span className="text-[#8b949e]">--author=krishna</span>
          </h1>

          <p className={`${mono.className} ml-1 text-sm md:text-base text-[#8b949e]`}>
            {"// a glimpse into my open-source contributions and pinned projects"}
          </p>
        </div>

        {/* CONTRIBUTION CARD */}
        <div
          ref={gridRef}
          className="mt-14 overflow-hidden rounded-2xl border border-[#262c36] bg-[#0d1117] shadow-[0_0_40px_rgba(57,211,83,0.04)]"
        >
          {/* TOP */}
          <div className="flex flex-col justify-between gap-6 border-b border-[#262c36] px-8 py-6 md:flex-row md:items-center">
            <div>
              <h3 className={`${mono.className} text-2xl font-semibold text-[#e6edf3]`}>
                Contributions
              </h3>

              <p className={`${mono.className} mt-2 text-sm text-[#8b949e]`}>
                Consistent commits, experiments, and open-source crafting.
              </p>
            </div>

            <a
              href="https://github.com/sudoKrishna"
              target="_blank"
              rel="noopener noreferrer"
              className="animate-glow-pulse flex w-fit items-center gap-3 rounded-full border border-[#2ea043] bg-[#238636] px-5 py-3 text-white transition-all duration-200 hover:-translate-y-1 hover:bg-[#2ea043]"
            >
              <GitBranch size={18} />
              <span className={`${mono.className} text-sm`}>Visit GitHub</span>
            </a>
          </div>

          {/* CONTRIBUTION GRID */}
          <div className="overflow-x-auto px-8 py-8">
            <div className="flex min-w-[820px] gap-[4px]">
              {grid.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[4px]">
                  {week.map((level, dayIndex) => {
                    const delay = (weekIndex * DAYS + dayIndex) * 6;

                    return (
                      <div
                        key={dayIndex}
                        className={`h-3.5 w-3.5 rounded-[3px] ${contributionLevels[level]} ${
                          inView ? "animate-cell-pop" : "opacity-0"
                        } hover:scale-125 hover:ring-1 hover:ring-[#39d353] transition-transform`}
                        style={inView ? { animationDelay: `${delay}ms` } : undefined}
                      />
                    );
                  })}
                </div>
              ))}
            </div>

            {/* BOTTOM */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`${mono.className} text-2xl font-bold text-[#39d353]`}>
                  {count}
                </span>

                <span className={`${mono.className} text-sm text-[#8b949e]`}>
                  contributions in the last year
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`${mono.className} text-xs text-[#8b949e]`}>Less</span>

                {contributionLevels.map((color, index) => (
                  <div key={index} className={`h-3.5 w-3.5 rounded-[3px] ${color}`} />
                ))}

                <span className={`${mono.className} text-xs text-[#8b949e]`}>More</span>
              </div>
            </div>
          </div>
        </div>

        {/* PINNED REPOS */}
        <div className="mt-16">
          <h3 className={`${mono.className} text-lg font-semibold text-[#e6edf3]`}>
            Pinned
          </h3>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {pinnedRepos.map((repo) => (
              <a
                key={repo.title}
                href={repo.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-xl border border-[#262c36] bg-[#0d1117] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#39d353]/60 hover:shadow-[0_0_25px_rgba(57,211,83,0.08)]"
              >
                <div className="flex items-center gap-2">
                  <GitBranch size={16} className="text-[#8b949e]" />
                  <span
                    className={`${mono.className} text-base font-medium text-[#58a6ff] group-hover:text-[#39d353]`}
                  >
                    {repo.title}
                  </span>
                </div>

                <p className={`${mono.className} mt-3 text-sm leading-relaxed text-[#8b949e]`}>
                  {repo.description}
                </p>

                <div className="mt-4 flex items-center gap-2">
                  <span className={`h-3 w-3 rounded-full ${repo.color}`} />
                  <span className={`${mono.className} text-xs text-[#8b949e]`}>
                    {repo.language}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
