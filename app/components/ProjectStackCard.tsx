"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Geist_Mono } from "next/font/google";

import type { Project } from "../lib/projects";
import { playSound, SOUNDS } from "../lib/sound";

const mono = Geist_Mono({ subsets: ["latin"], weight: ["400", "500"] });

function BinderClip() {
  return (
    <div
      className="stack-sway absolute -top-3 left-5 z-20 h-7 w-10 origin-bottom rounded-[3px] bg-gradient-to-b from-[#3a3a3a] to-[#0a0a0a] shadow-[0_3px_6px_rgba(0,0,0,0.5)]"
      style={{ animationDelay: "0.3s" }}
      aria-hidden
    >
      <div className="absolute inset-x-1 top-1 h-1.5 rounded-sm bg-black/40" />
    </div>
  );
}

function PushPin() {
  return (
    <div
      className="stack-sway absolute -top-3 left-1/2 z-20 -translate-x-1/2 origin-bottom"
      style={{ animationDelay: "0.6s" }}
      aria-hidden
    >
      <div className="mx-auto h-3 w-[3px] bg-gradient-to-b from-[#c7c7c7] to-[#8a8a8a]" />
      <div
        className="-mt-1 h-4 w-4 rounded-full shadow-[0_3px_5px_rgba(0,0,0,0.45)]"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, #ffffff 0%, #d9d9d9 25%, #8a8a8a 60%, #5a5a5a 100%)",
        }}
      />
    </div>
  );
}

type ProjectStackCardProps = {
  project: Project;
  href: string;
  active: boolean;
  dimmed: boolean;
  onSelect: () => void;
  children: ReactNode;
};

export function ProjectStackCard({
  project,
  href,
  active,
  dimmed,
  onSelect,
  children,
}: ProjectStackCardProps) {
  const target = active
    ? {
        x: project.translateX,
        y: project.translateY - 8,
        rotate: project.rotate,
        scale: 1.05,
        opacity: 1,
      }
    : dimmed
      ? {
          x: project.translateX * 1.15,
          y: project.translateY + 70,
          rotate: project.rotate === 0 ? 5 : project.rotate * 1.8,
          scale: 0.95,
          opacity: 1,
        }
      : {
          x: project.translateX,
          y: project.translateY,
          rotate: project.rotate,
          scale: 1,
          opacity: 1,
        };

  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ zIndex: active ? 100 : project.zIndex }}
    >
      <motion.div
        initial={false}
        animate={target}
        transition={{ type: "spring", stiffness: 150, damping: 26, mass: 0.9 }}
      >
        <div
          className="stack-float relative"
          style={{ animationDelay: `${project.floatDelay}s` }}
        >
          {project.accessory === "clip" && <BinderClip />}
          {project.accessory === "pin" && <PushPin />}

          <Link
            href={href}
            onClick={() => {
              playSound(SOUNDS.pop, 0.5);
              onSelect();
            }}
            className="group relative block h-[210px] w-[340px] cursor-pointer overflow-hidden rounded-[8px] border border-white/[0.06] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.35)]"
            style={{
              background: "linear-gradient(160deg, #161616 0%, #0D0D0D 100%)",
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(115deg, #fff 0 1px, transparent 1px 3px)",
              }}
            />

            <div className="absolute inset-0">{children}</div>

            <div className="absolute bottom-0 left-0 p-5">
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
            </div>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
