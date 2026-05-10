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
    title: "API Chaos Tester",
    description:
      "Automatically fuzz your API with malformed inputs and surface validation failures. Upload an OpenAPI spec, run mutation-based attacks, detect validation issues, injection flaws, and server errors with reproducible curl commands.",
    tech: [
      "Next.js",
      "TypeScript",
      "OpenAPI",
      "Prisma",
      "Security Testing",
    ],
    image: "/tester.png",
    viewLink: "https://chaos-tester.vercel.app/",
    codeLink: "#",
  },

  {
    id: 2,
    title: "Oran",
    description:
      "A web-based collaborative coding IDE where multiple developers can write code together in real time with AI-assisted coding features similar to GitHub Copilot.",
    tech: [
      "Next.js",
      "TypeScript",
      "WebSockets",
      "Collaborative Editing",
      "AI",
    ],
    image: "/oran.png",
    viewLink: "https://oran-three.vercel.app/",
    codeLink: "#",
  },

  {
    id: 3,
    title: "Fedis",
    description:
      "A distributed in-memory cache system built from scratch in TypeScript inspired by Redis. Supports LRU/LFU eviction, TTL, persistence snapshots, REST API, RESP protocol, and multi-instance cache synchronization.",
    tech: [
      "TypeScript",
      "Redis",
      "Distributed Systems",
      "Next.js",
      "WebSockets",
      "Docker",
    ],
    image: "/download.png",
    viewLink: "https://github.com/sudoKrishna/fedis",
    codeLink: "https://github.com/sudoKrishna/fedis",
  },

  {
    id: 4,
    title: "SHIFT DEX",
    description:
      "A decentralized exchange built on the Solana ecosystem using Rust and TypeScript. Features token swaps with best-price routing, QR-based payments, wallet transfers, and custom token creation.",
    tech: [
      "Rust",
      "TypeScript",
      "Solana",
      "Blockchain",
      "DEX",
      "Web3",
    ],
    image: "/download.png",
    viewLink: "https://github.com/sudoKrishna/SHIFT",
    codeLink: "https://github.com/sudoKrishna/SHIFT",
  },
  {
  id: 5,
  title: "Donate",
  description:
    "A full-stack donation platform built to connect donors with people in need through a secure and transparent system. Users can apply for financial help, create fundraising requests, and receive donations through integrated Web3 payments and Stripe checkout. The platform includes authentication, campaign management, real-time donation tracking, and a PostgreSQL-powered backend for scalable data handling. Designed with a modern responsive UI and smooth user experience focused on trust, accessibility, and fast onboarding.",
  tech: [
    "Next.js",
    "TypeScript",
    "Web3",
    "Stripe",
    "PostgreSQL",
    "Prisma",
    "Tailwind CSS",
    "REST API",
  ],
  image: "/download.png",
  viewLink: "#",
  codeLink: "https://github.com/sudoKrishna/donate",
},

{
  id: 6,
  title: "Garage Creative Studio",
  description:
    "A modern UI/UX-focused company website built with Next.js and GSAP featuring high-performance animations, immersive transitions, responsive layouts, and polished visual storytelling. The project emphasizes smooth interaction design, scalable component architecture, SEO optimization, and modern frontend engineering practices to deliver a premium digital brand experience.",
  tech: [
    "Next.js",
    "GSAP",
    "TypeScript",
    "Tailwind CSS",
    "UI/UX Design",
    "Responsive Design",
    "Framer Motion",
  ],
  image: "/download.png",
  viewLink: "https://garage-mu-beige.vercel.app/",
  codeLink: "https://github.com/sudoKrishna/garage",
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
<div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 items-stretch">
  {builds.map((item, i) => (
    <div
      key={item.id}
      ref={(el) => {
        cardsRef.current[i] = el;
      }}
      className={`border rounded-none transition-all duration-300 ease-out 
      hover:-translate-y-2 hover:shadow-[6px_6px_0px_black]
      flex flex-col h-full overflow-hidden ${
        codeMode
          ? "bg-black border-green-500 shadow-[0_0_15px_#00ff00]"
          : "bg-white border-black/10 shadow-[4px_4px_0px_black]"
      }`}
    >
      {/* MEDIA */}
      <div className="h-56 border-b border-black/10 shrink-0">
        {codeMode ? (
          <div className="h-full w-full bg-black text-green-400 text-[8px] p-2 overflow-hidden font-mono">
            {Array.from({ length: 8 })
              .map(() => Math.random().toString(2).slice(2, 50))
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
      <div className="p-5 bg-[#EAE9E0] flex flex-col flex-1">
        {/* TITLE */}
        <h3
          className={`text-xl font-light uppercase tracking-widest ${
            pixelify.className
          } ${codeMode ? "text-green-400" : "text-[#4A5D23]"}`}
        >
          {codeMode ? toBinary(item.title) : item.title}
        </h3>

        {/* TECH */}
        <div className="flex flex-wrap gap-2 mt-3">
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
        <p className="text-sm mt-4 text-gray-500 leading-relaxed flex-1">
          {codeMode ? toBinary(item.description) : item.description}
        </p>

        {/* BUTTONS */}
        <div className="flex gap-3 mt-6">
          <a
            href={item.viewLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-xs bg-[#4a5d23] text-white uppercase border border-black py-2 hover:bg-black hover:text-white transition"
          >
            View
          </a>

          <a
            href={item.codeLink}
            target="_blank"
            rel="noopener noreferrer"
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