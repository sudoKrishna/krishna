"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

// click a cell, get a fake commit — pure mad-lib, nothing here is a real commit
const VERBS = [
  "fixed",
  "broke then fixed",
  "refactored into oblivion",
  "renamed for the third time",
  "accidentally deleted",
  "heroically rescued",
  "quietly patched",
  "aggressively optimized",
  "reverted, then un-reverted",
  "rewrote in a fit of rage",
];

const SUBJECTS = [
  "the login page",
  "a semicolon",
  "prod",
  "the CSS",
  "a regex",
  "the database",
  "the build pipeline",
  "a merge conflict",
  "the dark mode toggle",
  "an off-by-one error",
  "the loading spinner",
  "a race condition",
];

const EXCUSES = [
  "it worked on my machine",
  "tests were passing, I swear",
  "blame the intern (there is no intern)",
  "Mercury was in retrograde",
  "the coffee ran out",
  "copilot suggested it",
  "it's a feature now",
  "will fix in v2",
  "nobody will notice",
  "past me should've known better",
];

function randomHash() {
  return Math.random().toString(16).slice(2, 9);
}

function randomCommit() {
  const verb = VERBS[Math.floor(Math.random() * VERBS.length)];
  const subject = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
  const excuse = EXCUSES[Math.floor(Math.random() * EXCUSES.length)];
  return `${verb} ${subject} — ${excuse}.`;
}

const RANKS: { min: number; title: string }[] = [
  { min: 30, title: "ships it before coffee ☕🔥" },
  { min: 15, title: "10x engineer (self-reported) ⚡" },
  { min: 5, title: "certified bug whisperer 🐛" },
  { min: 1, title: "fresh committer 🌱" },
];

function rankFor(clicks: number) {
  return RANKS.find((r) => clicks >= r.min)?.title ?? null;
}

type LogLine = { id: number; hash: string; message: string };

export default function GithubPage() {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [count, setCount] = useState(0);

  const [grid, setGrid] = useState<number[][]>(fallbackGrid);
  const [total, setTotal] = useState(FALLBACK_TOTAL);
  const [isLive, setIsLive] = useState(false);

  const [clicks, setClicks] = useState(0);
  const [log, setLog] = useState<LogLine[]>([]);

  const handleCellClick = () => {
    setClicks((c) => c + 1);
    setLog((prev) => [
      { id: Date.now() + Math.random(), hash: randomHash(), message: randomCommit() },
      ...prev,
    ].slice(0, 3));
  };

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
              className="flex w-fit items-center gap-1.5 rounded-full border border-[var(--accent-dim)] bg-[var(--accent-solid)] px-3 py-1.5 text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--accent-dim)]"
            >
              <GitBranch size={13} />
              <span className={`${mono.className} text-xs`}>Visit GitHub</span>
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
                      <button
                        key={dayIndex}
                        type="button"
                        onClick={handleCellClick}
                        aria-label="make a fake commit"
                        className={`aspect-square w-full cursor-pointer rounded-[2px] sm:rounded-[3px] ${contributionLevels[level]} ${
                          inView ? "animate-cell-pop" : "opacity-0"
                        } hover:scale-125 hover:ring-1 hover:ring-[var(--accent)] active:scale-90 transition-transform`}
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

            {/* CLICK-A-CELL COMMIT GAME */}
            <div className="mt-6 rounded-lg border border-[var(--border)] bg-[var(--surface-alt)] p-4">
              <p className={`${mono.className} text-xs text-[var(--muted)]`}>
                {clicks === 0
                  ? "// click a square above to make a fake commit"
                  : `${clicks} fake commit${clicks === 1 ? "" : "s"} made${
                      rankFor(clicks) ? ` · rank: ${rankFor(clicks)}` : ""
                    }`}
              </p>

              <div className="mt-2 flex flex-col gap-1">
                <AnimatePresence initial={false}>
                  {log.map((line) => (
                    <motion.p
                      key={line.id}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`${mono.className} truncate text-xs text-[var(--foreground-soft)]`}
                    >
                      <span className="text-[var(--accent)]">{line.hash}</span>{" "}
                      <span className="text-[var(--muted)]">—</span> {line.message}
                    </motion.p>
                  ))}
                </AnimatePresence>

                {log.length === 0 && (
                  <p className={`${mono.className} text-xs text-[var(--muted)]`}>
                    $ git log -1{" "}
                    <span className="animate-pulse text-[var(--accent)]">_</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
