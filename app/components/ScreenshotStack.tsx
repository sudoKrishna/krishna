"use client";

import Image from "next/image";
import { motion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

const TILTS = [-2.5, 1.8, -1.6, 2.2];

function FrameCard({
  src,
  rotate,
  index,
}: {
  src: string;
  rotate: number;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: 0 }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      viewport={{ once: true, margin: "-60px" }}
      whileHover={{ rotate: 0, scale: 1.015 }}
      transition={{ duration: 0.55, ease: EASE, delay: index * 0.06 }}
      className="relative mx-auto w-full max-w-[540px] overflow-hidden rounded-[14px] border border-black/[0.06] bg-[#0D0D0D] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.3)]"
    >
      <div className="flex items-center gap-1.5 border-b border-white/[0.06] bg-[#161616] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
      </div>
      <div className="relative aspect-[1903/943] w-full">
        <Image
          src={src}
          alt=""
          fill
          className="object-cover object-top"
          sizes="(min-width: 540px) 540px, 100vw"
        />
      </div>
    </motion.div>
  );
}

const SHOTS = ["/shy-screens/1.png", "/shy-screens/2.png", "/shy-screens/3.png", "/shy-screens/4.png"];

export function ScreenshotStack() {
  return (
    <div className="mt-10 flex flex-col gap-6">
      {SHOTS.map((src, i) => (
        <FrameCard key={src} src={src} rotate={TILTS[i % TILTS.length]} index={i} />
      ))}
    </div>
  );
}
