"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Geist_Mono } from "next/font/google";

import type { Project } from "../lib/projects";
import { playSound, SOUNDS } from "../lib/sound";
import { ShyDotLogo } from "./graphics/ShyDotLogo";
import { GoltHalftoneBolt } from "./graphics/GoltHalftoneBolt";
import { GoltUIHalftoneStack } from "./graphics/GoltUIHalftoneStack";
import { GoltBoltLogo } from "./graphics/GoltBoltLogo";
import { GoltUIStackLogo } from "./graphics/GoltUIStackLogo";
import { ScreenshotStack } from "./ScreenshotStack";
import { ShyFilmModal, type Rect } from "./ShyFilmModal";
import { MoreToSeeHint } from "./MoreToSeeHint";

const mono = Geist_Mono({ subsets: ["latin"], weight: ["400", "500"] });

const EASE = [0.16, 1, 0.3, 1] as const;

const HERO_GRAPHICS = {
  goltui: <GoltUIHalftoneStack className="absolute inset-0 h-full w-full" />,
  shy: <ShyDotLogo className="absolute top-3 right-3 h-[220px] w-[220px]" />,
  golt: <GoltHalftoneBolt className="absolute inset-0 h-full w-full" />,
};

const ICONS = {
  goltui: <GoltUIStackLogo className="h-full w-full" />,
  shy: <ShyDotLogo className="h-full w-full" />,
  golt: <GoltBoltLogo className="h-full w-full" />,
};

const rise = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: EASE } },
};

export function ProjectDetail({ project }: { project: Project }) {
  const [videoOpen, setVideoOpen] = useState(false);
  const [originRect, setOriginRect] = useState<Rect | null>(null);
  const logoRef = useRef<HTMLButtonElement>(null);
  const isShy = project.slug === "shy";

  const openVideo = () => {
    const rect = logoRef.current?.getBoundingClientRect();
    if (rect) {
      setOriginRect({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
    }
    playSound(SOUNDS.click, 0.5);
    setVideoOpen(true);
  };

  return (
    <div className="mx-auto max-w-[540px] px-5 py-10 sm:px-6 sm:py-16">
      {/* card zooms out of the frame, then everything else settles in */}
      <motion.div
        initial={{ opacity: 0, scale: 1.12, filter: "blur(14px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.75, ease: EASE }}
        className="relative aspect-[540/310] w-full overflow-hidden rounded-[18px] border border-black/[0.06] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.25)]"
        style={{ background: "linear-gradient(160deg, #161616 0%, #0D0D0D 100%)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "repeating-linear-gradient(115deg, #fff 0 1px, transparent 1px 3px)",
          }}
        />
        <div className="absolute inset-0">{HERO_GRAPHICS[project.slug]}</div>
        <motion.div
          className="absolute bottom-0 left-0 p-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.35 }}
        >
          <p
            className={`${mono.className} text-[20px] font-semibold leading-none`}
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            {project.title}
          </p>
          <p
            className={`${mono.className} mt-1.5 text-[11px] tracking-[0.3px]`}
            style={{ color: "rgba(255,255,255,0.28)" }}
          >
            {project.domain}
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { delayChildren: 0.45, staggerChildren: 0.09 } },
        }}
        className="mt-8 flex items-start gap-4 sm:gap-8"
      >
        <motion.div variants={rise} className="mt-1 shrink-0">
          <Link
            href="/project"
            onClick={() => playSound(SOUNDS.click, 0.5)}
            className={`${mono.className} text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]`}
          >
            ← back
          </Link>
        </motion.div>

        <div className="min-w-0 flex-1">
          <motion.div variants={rise} className="relative flex items-center gap-3">
            {isShy ? (
              <motion.button
                ref={logoRef}
                type="button"
                onClick={openVideo}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Watch the shy film"
                className="h-11 w-11 shrink-0 cursor-pointer overflow-hidden rounded-xl bg-[#121212]"
              >
                {ICONS[project.slug]}
              </motion.button>
            ) : (
              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-[#121212]">
                {ICONS[project.slug]}
              </div>
            )}
            {isShy && !videoOpen && (
              <MoreToSeeHint className="hidden sm:block sm:left-[-130px] sm:top-[-70px]" />
            )}
            <div>
              <p className="text-[15px] font-semibold text-[#1a1a1a]">{project.title}</p>
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[13px] text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
              >
                {project.domain}
                <ArrowUpRight size={13} />
              </a>
            </div>
          </motion.div>

          <motion.div variants={rise} className="mt-5 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-black/[0.05] px-3 py-1 text-[12px] text-[#1a1a1a]/70"
              >
                {tag}
              </span>
            ))}
          </motion.div>

          <motion.p
            variants={rise}
            className="mt-5 max-w-[46ch] text-[14.5px] leading-relaxed text-[#1a1a1a]/75"
          >
            {project.description}
          </motion.p>
        </div>
      </motion.div>

      {isShy && <ScreenshotStack />}

      {isShy && (
        <ShyFilmModal
          open={videoOpen}
          originRect={originRect}
          onClose={() => setVideoOpen(false)}
        />
      )}
    </div>
  );
}
