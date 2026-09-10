"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Geist_Mono } from "next/font/google";

const mono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
});

// original pixel-blob mascot, hand-drawn as an 8x8 grid (no external art assets)
// 1 = body, 2 = shine highlight, 0 = eye, m = mouth, . = transparent
const BODY = [
  "........",
  "..1s11..",
  ".111111.",
  "11111111",
  "10110111",
  "111mm111",
  ".111111.",
  "..1111..",
];

const PIXEL = 6;
const GRID = 8;

const JOKES = [
  "My agent passed 12/18 SWE-bench tasks. The other 6 it fixed by deleting the tests.",
  "Debugging tip: it's always DNS. Except when it's Redis. Then it's also DNS.",
  "I taught my AI to say \"I don't know\" — now it says that about its own name too.",
  "git commit -m \"fix\" — the bravest commit message in the whole repo.",
  "I asked the agent to refactor one function. It refactored the universe.",
  "console.log('why') — the most honest line in every codebase.",
  "My harness has 100% test coverage. The tests just don't check anything important.",
  "The cloud is just someone else's laptop, but better at yoga (uptime).",
];

export default function Pet() {
  const [blink, setBlink] = useState(false);
  const [hover, setHover] = useState(false);
  const [squish, setSquish] = useState(false);
  const [joke, setJoke] = useState<string | null>(null);
  const lastIndex = useRef(-1);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // blink every few seconds, purely idle
  useEffect(() => {
    const id = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 140);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    return () => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
    };
  }, []);

  const handleClick = () => {
    setSquish(true);
    setTimeout(() => setSquish(false), 260);

    let next = Math.floor(Math.random() * JOKES.length);
    if (JOKES.length > 1 && next === lastIndex.current) {
      next = (next + 1) % JOKES.length;
    }
    lastIndex.current = next;
    setJoke(JOKES[next]);

    if (dismissTimer.current) clearTimeout(dismissTimer.current);
    dismissTimer.current = setTimeout(() => setJoke(null), 3200);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 select-none">
      <div className="relative h-12 w-12">
        <AnimatePresence>
          {joke && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`${mono.className} absolute bottom-full right-0 mb-3 w-48 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs leading-relaxed text-[var(--foreground)] shadow-lg`}
            >
              {joke}
              <span className="absolute -bottom-1.5 right-4 h-3 w-3 rotate-45 border-b border-r border-[var(--border)] bg-[var(--surface)]" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={handleClick}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          aria-label="say hi to the mascot"
          animate={
            squish
              ? { y: -10, scaleX: 1.15, scaleY: 0.85 }
              : hover
                ? { y: [0, -3, 0], scaleX: 1, scaleY: 1 }
                : { y: [0, -2, 0], scaleX: 1, scaleY: 1 }
          }
          transition={
            squish
              ? { type: "spring", stiffness: 500, damping: 12 }
              : { duration: hover ? 0.8 : 2.2, repeat: Infinity, ease: "easeInOut" }
          }
          className="flex h-12 w-12 items-center justify-center rounded-full bg-transparent outline-none"
        >
          <svg width={GRID * PIXEL} height={GRID * PIXEL}>
            {BODY.map((row, y) =>
              row.split("").map((cell, x) => {
                if (cell === ".") return null;

                const isEye = cell === "0";
                const isMouth = cell === "m";
                const isShine = cell === "s";
                const eyeShut = isEye && blink;

                let fill = "var(--accent)";
                if (isEye || isMouth) fill = "var(--surface)";
                if (isShine) fill = "rgba(255,255,255,0.4)";

                return (
                  <rect
                    key={`${x}-${y}`}
                    x={x * PIXEL}
                    y={eyeShut ? y * PIXEL + PIXEL / 2 - 1 : y * PIXEL}
                    width={PIXEL}
                    height={eyeShut ? 2 : PIXEL}
                    rx={1.5}
                    fill={fill}
                  />
                );
              })
            )}
          </svg>
        </motion.button>
      </div>
    </div>
  );
}
