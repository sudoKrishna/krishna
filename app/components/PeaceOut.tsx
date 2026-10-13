"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { Signature } from "./Signature";

export function PeaceOut() {
  const [time, setTime] = useState({ h: "00", m: "00", s: "00" });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const pad = (value: number) => value.toString().padStart(2, "0");
      setTime({
        h: pad(now.getHours()),
        m: pad(now.getMinutes()),
        s: pad(now.getSeconds()),
      });
    };

    tick();
    const intervalId = setInterval(tick, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <section className="w-full px-6 pb-16 pt-8">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-medium tracking-[0.25em] text-[var(--muted)] uppercase">
            peace out
          </span>

          <span className="inline-flex items-center font-mono text-xs tabular-nums text-[var(--muted)]">
            <span className="inline-flex w-[1.4em] justify-center">{time.h}</span>
            <span className="animate-blink px-px">:</span>
            <span className="inline-flex w-[1.4em] justify-center">{time.m}</span>
            <span className="animate-blink px-px">:</span>
            <span className="relative inline-flex h-[1em] w-[1.4em] items-center justify-center overflow-hidden">
              <motion.span
                key={time.s}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {time.s}
              </motion.span>
            </span>
          </span>
        </div>

        <span className="flex items-center gap-2">
          <span className="text-[10px] tracking-[0.25em] text-[var(--muted)] uppercase">
            by
          </span>
          <Signature className="h-7 w-auto" />
        </span>
      </div>
    </section>
  );
}
