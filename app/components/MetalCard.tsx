"use client";

import { useRef, useState } from "react";
import { Inter } from "next/font/google";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

import { ScrambleText } from "./ScrambleText";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500"] });

export type MetalTone = "silver" | "black" | "blue";

type ToneStyle = {
  surface: string;
  ring: string;
  inner: string;
  name: string;
  text: React.CSSProperties;
};

// Engraved text — dark shadow below + light highlight above, so the text
// reads as pressed INTO the surface.
const engraved = (
  backgroundImage: string,
  highlight: string,
  shadow: string,
): React.CSSProperties => ({
  color: "transparent",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  backgroundImage,
  textShadow: `0px 1px 1px ${highlight}, 0px -1px 1px ${shadow}`,
  filter: "none",
});

const TONES: Record<MetalTone, ToneStyle> = {
  silver: {
    surface:
      "linear-gradient(135deg,#e4e4e4 0%,#c6c6c6 20%,#f1f1f1 36%,#c2c2c2 52%,#dedede 70%,#bdbdbd 86%,#d4d4d4 100%)",
    ring: "ring-white/40",
    inner: "ring-white/30",
    name: "#1C1C1C",
    text: engraved(
      "linear-gradient(180deg, #a8a8a8 0%, #b8b8b8 100%)",
      "rgba(255,255,255,0.75)",
      "rgba(0,0,0,0.30)",
    ),
  },
  black: {
    surface:
      "linear-gradient(135deg,#242424 0%,#0d0d0d 20%,#333333 38%,#0a0a0a 55%,#2a2a2a 72%,#111111 88%,#1c1c1c 100%)",
    ring: "ring-white/12",
    inner: "ring-white/10",
    name: "#EDEDED",
    text: engraved(
      "linear-gradient(180deg, #6f6f6f 0%, #9a9a9a 100%)",
      "rgba(255,255,255,0.10)",
      "rgba(0,0,0,0.65)",
    ),
  },
  blue: {
    surface:
      "linear-gradient(135deg,#2f86e0 0%,#0A66C2 22%,#5aa0ee 42%,#0A66C2 60%,#2f86e0 80%,#0A66C2 100%)",
    ring: "ring-white/30",
    inner: "ring-white/25",
    name: "#FFFFFF",
    text: engraved(
      "linear-gradient(180deg, #dbeeff 0%, #a9d0f5 100%)",
      "rgba(255,255,255,0.35)",
      "rgba(0,0,0,0.35)",
    ),
  },
};

type MetalCardProps = {
  /** contact line — scrambles to reveal itself on hover */
  contact: string;
  contactClassName?: string;
  href: string;
  ariaLabel: string;
  /** big mark on the right (icon / logo) */
  right?: React.ReactNode;
  /** show only the contact, centered — no avatar/name/bio/mark */
  minimal?: boolean;
  /** metal finish */
  tone?: MetalTone;
};

export function MetalCard({
  contact,
  contactClassName,
  href,
  ariaLabel,
  right,
  minimal = false,
  tone = "silver",
}: MetalCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const [hovered, setHovered] = useState(false);
  const [shone, setShone] = useState(false);

  const skin = TONES[tone];

  const rotateX = useSpring(useTransform(my, [0, 1], [7, -7]), {
    stiffness: 150,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-9, 9]), {
    stiffness: 150,
    damping: 18,
  });

  const sheenLeft = useTransform(mx, [0, 1], ["20%", "80%"]);
  const sheenTop = useTransform(my, [0, 1], ["20%", "80%"]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };

  const handleEnter = () => {
    setHovered(true);
    setShone(true);
  };

  const handleLeave = () => {
    setHovered(false);
    mx.set(0.5);
    my.set(0.5);
  };

  const external = !href.startsWith("mailto:");

  return (
    <div className="[perspective:1600px]">
      <motion.div
        ref={ref}
        onMouseEnter={handleEnter}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d", background: skin.surface }}
        className={`${inter.className} relative grid aspect-[550/320] w-[460px] max-w-full grid-cols-[40%_60%] overflow-hidden rounded-[16px] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_1px_rgba(0,0,0,0.18)] ring-1 ${skin.ring}`}
      >
        {/* soft glass sheen */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur-3xl"
          style={{ left: sheenLeft, top: sheenTop }}
        />
        {/* frosted inner edge */}
        <div
          className={`pointer-events-none absolute inset-0 rounded-[16px] ring-1 ${skin.inner} ring-inset`}
        />

        {/* brushed-metal texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, rgba(255,255,255,0.6) 0 1px, rgba(0,0,0,0.08) 1px 2px)",
          }}
        />

        {/* metallic shine sweep — plays once on first hover */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-30 w-1/3 bg-gradient-to-r from-transparent via-white/55 to-transparent"
          initial={{ x: "-150%", skewX: -12, opacity: 0 }}
          animate={
            shone
              ? { x: "450%", skewX: -12, opacity: [0, 1, 0] }
              : { x: "-150%", skewX: -12, opacity: 0 }
          }
          transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
        />

        {minimal ? (
          <div
            className="relative z-10 col-span-2 flex items-center justify-center p-6"
            style={{ transform: "translateZ(30px)" }}
          >
            <a
              href={href}
              aria-label={ariaLabel}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="flex items-center justify-center"
            >
              <span
                className={`font-normal tracking-wide text-[18px] ${contactClassName ?? ""}`}
                style={skin.text}
              >
                <ScrambleText text={contact} active={hovered} />
              </span>
            </a>
          </div>
        ) : (
          <>
            {/* LEFT — info zone */}
            <div
              className="relative z-10 flex flex-col p-6"
              style={{ transform: "translateZ(30px)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/luffy.jpg"
                alt="krishna"
                className="mt-1 h-[76px] w-[76px] rounded-[10px] object-cover"
              />

              <p
                className="mt-4 text-[22px] leading-none font-medium"
                style={{ color: skin.name }}
              >
                krishna.
              </p>

              <p
                className={`mt-1.5 font-normal tracking-wide whitespace-nowrap ${
                  contactClassName ?? "text-[14px]"
                }`}
                style={skin.text}
              >
                <ScrambleText text={contact} active={hovered} />
              </p>

              <p
                className="mt-auto mb-4 text-[15px] font-normal tracking-wide whitespace-nowrap"
                style={skin.text}
              >
                fullstack engineer.
              </p>
            </div>

            {/* RIGHT — big mark zone */}
            <div
              className="relative z-10 flex h-full items-end justify-end"
              style={{ transform: "translateZ(30px)" }}
            >
              <a
                href={href}
                aria-label={ariaLabel}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex h-full w-full items-end justify-end overflow-hidden"
              >
                {right}
              </a>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
