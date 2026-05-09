"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Pixelify_Sans } from "next/font/google";
import { useCodeMode } from "../context/CodeModeContext";

const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
});

gsap.registerPlugin(ScrollTrigger);

type BuildItem = {
  id: number;
  title: string;
  description: string;
  tech: string[];
  image?: string;
  video?: string;
  viewLink: string;
  codeLink: string;
};

const builds: BuildItem[] = [
  {
    id: 1,
    title: "Pixel Portfolio",
    description: "Retro-inspired developer portfolio with modern motion.",
    tech: ["Next.js", "GSAP", "SVG"],
    image: "/download.png",
    viewLink: "#",
    codeLink: "#",
  },
  {
    id: 2,
    title: "Arcade Dashboard",
    description: "Gamified UI dashboard with pixel UI elements.",
    tech: ["React", "Node"],
    image: "/download.png",
    viewLink: "#",
    codeLink: "#",
  },
];

export default function Build() {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { codeMode } = useCodeMode();

  const toBinary = (text: string) =>
    text
      .split("")
      .map((c) => c.charCodeAt(0).toString(2))
      .join(" ");

  useEffect(() => {
    if (!titleRef.current) return;

    gsap.fromTo(
      titleRef.current,
      {
        y: 40,
        opacity: 0,
        filter: "blur(4px)",
      },
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.2,
        ease: "power3.out",
      }
    );
  }, []);

  useEffect(() => {
    gsap.set(cardsRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
    });
  }, []);

  return (
    <div
      className={`min-h-screen px-6 py-10 relative overflow-hidden transition-all duration-700 ${
        codeMode ? "bg-black text-green-400" : "bg-[#F5F3EB] text-black"
      }`}
    >
      {/* 🔥 HACK OVERLAY (only in code mode) */}
      {codeMode && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          <div className="animate-pulse opacity-10 text-green-400 text-[10px] whitespace-pre-wrap">
            {Array.from({ length: 80 })
              .map(() =>
                Math.random().toString(2).slice(2, 120)
              )
              .join("\n")}
          </div>
        </div>
      )}

      {/* HEADER (UNCHANGED STYLE) */}
      <div className="flex items-center gap-170 mb-8">
        <h1
          ref={titleRef}
          className={`text-7xl ${pixelify.className} tracking-widest ${
            codeMode ? "text-green-400" : "text-[#4A5D23]"
          }`}
        >
          Builds
        </h1>

        <img
          src="/Enchanting_Table.gif"
          alt="decorative gif"
          className="h-32 w-auto object-contain"
        />
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 grid">
        {builds.map((item, i) => (
          <div
            key={item.id}
            ref={(el) => {
              cardsRef.current[i] = el;
            }}
            className={`border rounded-none transition-transform duration-300 ease-out hover:-translate-y-2 hover:shadow-[6px_6px_0px_black] scale-[1.08] ${
              codeMode
                ? "bg-black border-green-500 shadow-[0_0_15px_#00ff00]"
                : "bg-white border-black/10 shadow-[4px_4px_0px_black]"
            }`}
          >
            {/* MEDIA */}
            <div className="h-56 border-b border-black/10">
              {codeMode ? (
                <div className="h-full w-full bg-black text-green-400 text-[8px] p-2 overflow-hidden font-mono">
                  {Array.from({ length: 8 })
                    .map(() =>
                      Math.random().toString(2).slice(2, 50)
                    )
                    .join("\n")}
                </div>
              ) : (
                <img
                  src={item.image}
                  className="w-full h-full object-cover pixelated"
                />
              )}
            </div>

            {/* CONTENT */}
            <div className="p-4 bg-[#EAE9E0]">
              {/* TITLE */}
              <h3
                className={`text-xl font-light uppercase tracking-widest ${pixelify.className} ${
                  codeMode ? "text-green-400" : "text-[#4A5D23]"
                }`}
              >
                {codeMode ? toBinary(item.title) : item.title}
              </h3>

              {/* TECH */}
              <div className="flex flex-wrap gap-2 mt-2">
                {item.tech.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-1 border border-gray-400 text-gray-400 uppercase"
                  >
                    {codeMode ? toBinary(t) : t}
                  </span>
                ))}
              </div>

              {/* DESCRIPTION */}
              <p className="text-sm mt-3 text-gray-400 leading-relaxed">
                {codeMode
                  ? toBinary(item.description)
                  : item.description}
              </p>

              {/* BUTTONS */}
              <div className="flex gap-2 mt-4">
                <a
                  href={item.viewLink}
                  className="flex-1 text-center text-xs bg-[#4a5d23] uppercase border border-black py-2 hover:bg-black hover:text-white transition"
                >
                  View
                </a>

                <a
                  href={item.codeLink}
                  className="flex-1 text-center text-xs uppercase border border-black py-2 hover:bg-black hover:text-white transition"
                >
                  Code
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}