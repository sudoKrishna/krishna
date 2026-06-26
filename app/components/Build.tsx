"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Pixelify_Sans } from "next/font/google";

const pixelify = Pixelify_Sans({
    subsets: ["latin"],
    weight: ["400", "700"],
});

gsap.registerPlugin(ScrollTrigger);

type BuildItem = {
    id: number;
    title: string;
    cardTitle: string; 
    description: string;
    tech: string[];
    image?: string;
    video?: string; 
    viewLink: string;
    codeLink: string;
};

const AVATAR = "/k.jpeg";
const AUTHOR = "Krishna";

const builds: BuildItem[] = [
  {
    id: 1,
    title: "API Chaos Tester",
    cardTitle: "API Chaos Tester – Automated API Fuzzing",
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
    cardTitle: "Oran – Collaborative AI-Assisted IDE",
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
    id: 6,
    title: "Garage Creative Studio",
    cardTitle: "Garage Creative Studio – Brand Website",
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

    // Bold any tech term that appears inside the description text
    const renderDescription = (description: string, tech: string[]) => {
        if (!tech.length) return description;

        const escaped = tech
            .slice()
            .sort((a, b) => b.length - a.length)
            .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

        const pattern = new RegExp(`(${escaped.join("|")})`, "gi");
        const parts = description.split(pattern);

        return parts.map((part, i) =>
            tech.some((t) => t.toLowerCase() === part.toLowerCase()) ? (
                <strong key={i} className="font-semibold text-current">
                    {part}
                </strong>
            ) : (
                <React.Fragment key={i}>{part}</React.Fragment>
            )
        );
    };

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
        <div className="min-h-screen px-6 py-10 relative overflow-hidden transition-all duration-700 bg-[#F5F3EB] text-black">
            {/* HEADER (UNCHANGED STYLE) */}
            <div className="flex items-center gap-170 mb-8">
                <h1
                    ref={titleRef}
                    className={`text-7xl ${pixelify.className} tracking-widest text-[#4A5D23]`}
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
                        className="rounded-2xl transition-all duration-300 ease-out
                        hover:-translate-y-1 hover:shadow-2xl
                        flex flex-col h-full overflow-hidden bg-white shadow-lg"
                    >
                        {/* MEDIA */}
                        <div className="relative h-72 shrink-0 bg-black overflow-hidden">
                            {item.video ? (
                                <iframe
                                    src={item.video}
                                    title={item.title}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <a
                                    href={item.viewLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative block w-full h-full"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    {/* darken overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/40" />

                                    {/* play button */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="flex items-center justify-center w-16 h-12 rounded-md bg-red-600 shadow-lg group-hover:scale-110 transition-transform">
                                            <svg
                                                viewBox="0 0 24 24"
                                                className="w-7 h-7 fill-white ml-0.5"
                                            >
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* watch/view pill */}
                                    <div className="absolute bottom-4 right-4">
                                        <span className="flex items-center gap-2 rounded-full bg-white/30 backdrop-blur-md px-4 py-2 text-sm font-medium text-white">
                                            View Project
                                        </span>
                                    </div>
                                </a>
                            )}

                            {/* avatar + name overlay (top-left) */}
                            <div className="absolute top-0 left-0 right-0 flex items-center gap-3 px-5 py-4 bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
                                <img
                                    src={AVATAR}
                                    alt={AUTHOR}
                                    className="w-9 h-9 rounded-full object-cover border border-white/30"
                                />
                                <div className="flex flex-col leading-tight">
                                    <span className="text-white text-base font-medium">
                                        {item.title}
                                    </span>
                                    <span className="text-white/70 text-xs">
                                        {AUTHOR}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* CONTENT */}
                        <div className="p-6 flex flex-col flex-1 bg-[#EAE9E0]">
                            {/* CARD TITLE */}
                            <h3
                                className="text-2xl text-[#1f1f1f]"
                                style={{ fontFamily: "Georgia, serif" }}
                            >
                                {item.cardTitle}
                            </h3>

                            {/* TECH PILLS */}
                            <div className="flex flex-wrap gap-2 mt-4">
                                {item.tech.map((t, idx) => (
                                    <span
                                        key={idx}
                                        className="text-xs px-3 py-1.5 rounded-full border border-black/15 text-gray-700 bg-white/60"
                                    >
                                        {t}
                                    </span>
                                ))}
                            </div>

                            {/* DESCRIPTION */}
                            <p className="text-base mt-4 leading-relaxed flex-1 text-gray-600">
                                {renderDescription(item.description, item.tech)}
                            </p>

                            {/* BUTTONS */}
                            <div className="mt-6 flex gap-3">
                                <a
                                    href={item.viewLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 text-center text-sm font-medium uppercase py-3 rounded-md transition bg-[#4a5d23] text-white hover:bg-black"
                                >
                                    View Live
                                </a>
                                <a
                                    href={item.codeLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 text-center text-sm font-medium uppercase py-3 rounded-md border transition border-black/20 text-black bg-white hover:bg-black hover:text-white"
                                >
                                    View Code
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}