"use client";

import { useEffect, useRef, useState } from "react";
import { Geist_Mono } from "next/font/google";
import { GitBranch } from "lucide-react";

const mono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

// GitHub dark-mode contribution scale
const contributionLevels = [
  "bg-[var(--surface-alt)] border border-[var(--border)]",
  "bg-[var(--level-1)]",
  "bg-[var(--level-2)]",
  "bg-[var(--level-3)]",
  "bg-[var(--accent)]",
];

const FALLBACK_WEEKS = 53;
const FALLBACK_DAYS = 7;
const FALLBACK_TOTAL = 900;

// deterministic pseudo-random, used only if the live fetch fails
function seededLevel(seed: number) {
  const x = Math.sin(seed * 999.7) * 10000;
  const frac = x - Math.floor(x);
  return Math.floor(frac * contributionLevels.length);
}

const fallbackGrid = Array.from({ length: FALLBACK_WEEKS }, (_, weekIndex) =>
  Array.from({ length: FALLBACK_DAYS }, (_, dayIndex) =>
    seededLevel(weekIndex * FALLBACK_DAYS + dayIndex)
  )
);

export default function GithubPage() {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [count, setCount] = useState(0);

  const [grid, setGrid] = useState<number[][]>(fallbackGrid);
  const [total, setTotal] = useState(FALLBACK_TOTAL);
  const [isLive, setIsLive] = useState(false);

  // fetch the real contribution calendar; silently keep the fallback pattern on failure
  useEffect(() => {
    let cancelled = false;

    fetch("/api/github-contributions")
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data: { weeks: number[][]; total: number }) => {
        if (cancelled) return;
        setGrid(data.weeks);
        setTotal(data.total);
        setIsLive(true);
      })
      .catch(() => {
        // keep the fallback grid already in state
      });

    return () => {
      cancelled = true;
    };
  }, []);

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
      setCount(Math.floor(progress * total));

      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, total]);

  return (
    <section className="px-6 py-10 bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto max-w-4xl">
        <h2 className={`${mono.className} text-lg font-semibold text-[var(--foreground)]`}>
          Contributions
        </h2>

        {/* CONTRIBUTION CARD */}
        <div
          ref={gridRef}
          className="mt-4 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_0_40px_rgba(57,211,83,0.04)]"
        >
          {/* TOP */}
          <div className="flex flex-col justify-between gap-6 border-b border-[var(--border)] px-8 py-6 md:flex-row md:items-center">
            <p className={`${mono.className} text-sm text-[var(--muted)]`}>
              {isLive
                ? "Live from GitHub — consistent commits, experiments, and open-source crafting."
                : "Consistent commits, experiments, and open-source crafting."}
            </p>

            <a
              href="https://github.com/sudoKrishna"
              target="_blank"
              rel="noopener noreferrer"
              className="animate-glow-pulse flex w-fit items-center gap-3 rounded-full border border-[var(--accent-dim)] bg-[var(--accent-solid)] px-5 py-3 text-white transition-all duration-200 hover:-translate-y-1 hover:bg-[var(--accent-dim)]"
            >
              <GitBranch size={18} />
              <span className={`${mono.className} text-sm`}>Visit GitHub</span>
            </a>
          </div>

          {/* CONTRIBUTION GRID */}
          <div className="px-4 py-8 sm:px-8">
            <div
              className="grid w-full gap-[3px] sm:gap-[4px]"
              style={{ gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))` }}
            >
              {grid.map((week, weekIndex) => (
                <div key={weekIndex} className="grid gap-[3px] sm:gap-[4px]">
                  {week.map((level, dayIndex) => {
                    const delay = (weekIndex * 7 + dayIndex) * 6;

                    return (
                      <div
                        key={dayIndex}
                        className={`aspect-square w-full rounded-[2px] sm:rounded-[3px] ${contributionLevels[level]} ${
                          inView ? "animate-cell-pop" : "opacity-0"
                        } hover:scale-125 hover:ring-1 hover:ring-[var(--accent)] transition-transform`}
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
                <span className={`${mono.className} text-2xl font-bold text-[var(--accent)]`}>
                  {count}
                </span>

                <span className={`${mono.className} text-sm text-[var(--muted)]`}>
                  contributions in the last year
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`${mono.className} text-xs text-[var(--muted)]`}>Less</span>

                {contributionLevels.map((color, index) => (
                  <div key={index} className={`h-3.5 w-3.5 rounded-[3px] ${color}`} />
                ))}

                <span className={`${mono.className} text-xs text-[var(--muted)]`}>More</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
