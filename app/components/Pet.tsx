"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// tiny original pixel-blob mascot, drawn as an 8x8 grid (no external art assets)
// 1 = body, 0 = eye, blank = transparent
const BODY = [
  "........",
  "..1111..",
  ".111111.",
  "1111111.",
  "1101101.",
  "1111111.",
  ".111111.",
  "..1111..",
];

const PIXEL = 5;
const GRID = 8;

type Spark = { id: number; x: number };

export default function Pet() {
  const [blink, setBlink] = useState(false);
  const [hover, setHover] = useState(false);
  const [squish, setSquish] = useState(false);
  const [sparks, setSparks] = useState<Spark[]>([]);

  // blink every few seconds, purely idle
  useEffect(() => {
    const id = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 140);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  const handleClick = () => {
    setSquish(true);
    setTimeout(() => setSquish(false), 260);

    const id = Date.now();
    setSparks((s) => [...s, { id, x: (Math.random() - 0.5) * 24 }]);
    setTimeout(() => {
      setSparks((s) => s.filter((sp) => sp.id !== id));
    }, 700);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 select-none">
      <div className="relative h-12 w-12">
        <AnimatePresence>
          {sparks.map((s) => (
            <motion.span
              key={s.id}
              initial={{ opacity: 1, y: 0, x: s.x, scale: 0.6 }}
              animate={{ opacity: 0, y: -34, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 text-xs text-[var(--accent)]"
            >
              ♥
            </motion.span>
          ))}
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
          <svg
            width={GRID * PIXEL}
            height={GRID * PIXEL}
            shapeRendering="crispEdges"
            style={{ imageRendering: "pixelated" }}
          >
            {BODY.map((row, y) =>
              row.split("").map((cell, x) => {
                if (cell === ".") return null;

                const isEye = cell === "0";
                const eyeShut = isEye && blink;

                return (
                  <rect
                    key={`${x}-${y}`}
                    x={x * PIXEL}
                    y={eyeShut ? y * PIXEL + PIXEL / 2 - 1 : y * PIXEL}
                    width={PIXEL}
                    height={eyeShut ? 2 : PIXEL}
                    fill={isEye ? "var(--surface)" : "var(--accent)"}
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
