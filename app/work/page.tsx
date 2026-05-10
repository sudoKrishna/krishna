"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Edu_NSW_ACT_Cursive } from "next/font/google";

import { Pixelify_Sans } from "next/font/google";
import Rest from "../components/Rest";


const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
});

gsap.registerPlugin(ScrollTrigger);

const cursive = Edu_NSW_ACT_Cursive({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const journey = [
  {
    year: "2022",
    title: "Started with JavaScript",
    description:
      "I started my journey learning core JavaScript fundamentals — closures, async behavior, promises, event loop, APIs, DOM manipulation, and browser internals. I built small apps daily and slowly developed strong frontend fundamentals.",
    tech: ["JavaScript", "HTML", "CSS", "DOM", "REST APIs"],
  },

  {
    year: "2023",
    title: "React Era",
    description:
      "React completely changed how I built interfaces. I learned reusable component architecture, hooks, context API, rendering optimization, animations, and scalable UI systems.",
    tech: ["React", "Hooks", "TailwindCSS", "GSAP", "Framer Motion"],
  },

  {
    year: "2023",
    title: "Next.js + TypeScript",
    description:
      "I moved into full-stack development using Next.js and TypeScript. Learned SSR, app router, API routes, authentication systems, and scalable production architectures.",
    tech: ["Next.js", "TypeScript", "SSR", "Prisma", "PostgreSQL"],
  },

  {
    year: "2024",
    title: "Built DEX Project",
    description:
      "Built a decentralized exchange prototype with wallet connection, token swaps, and blockchain integrations. This introduced me to distributed systems and Web3.",
    tech: ["Solidity", "Web3", "Ethers.js", "Next.js"],
  },

  {
    year: "2024",
    title: "100x Hackathons",
    description:
      "Hackathons improved my rapid execution skills. I learned how to build MVPs quickly, collaborate under pressure, and ship products in very short timelines.",
    tech: ["Firebase", "Node.js", "MongoDB", "Socket.IO"],
  },

  {
    year: "2025",
    title: "Built SaaS — Oran AI",
    description:
      "Built a full SaaS platform with AI integrations, subscriptions, dashboards, Redis caching, PostgreSQL database architecture, and scalable backend systems.",
    tech: [
      "Next.js",
      "Redis",
      "Docker",
      "CI/CD",
      "Prisma",
      "Stripe",
    ],
  },

  {
    year: "2026",
    title: "Binance-like Trading Platform",
    description:
      "Currently engineering a real-time trading platform with websocket architecture, live charts, order books, scalable backend infrastructure, Redis queues, and microservices.",
    tech: [
      "WebSockets",
      "Redis",
      "Docker",
      "Kubernetes",
      "Microservices",
    ],
  },
];

export default function WorkPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero",
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
        }
      );

      gsap.fromTo(
        ".timeline-line",
        {
          scaleY: 0,
          transformOrigin: "top center",
        },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".timeline-wrapper",
            start: "top 80%",
            end: "bottom bottom",
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        ".timeline-item",
        {
          opacity: 0,
          y: 60,
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".timeline-wrapper",
            start: "top 80%",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#F5F3EB] text-[#2F3B1F] overflow-hidden"
    >
      {/* HERO */}
      <section className="hero px-10 pt-24 pb-20">
        <h1
          className={`
            ${cursive.className}
            text-8xl
            font-bold
            tracking-tight
          `}
        >
          Work
        </h1>

        <p
          className="
            mt-5
            max-w-2xl
            text-lg
            leading-relaxed
            text-[#66704D]
          "
        >
          Full engineering journey from learning JavaScript to building
          scalable systems, real-time apps, SaaS products, and trading
          platforms.
        </p>
      </section>

      {/* TIMELINE */}
      <section className="timeline-wrapper relative px-10 pb-40">
        <div className="relative max-w-5xl">
          {/* MAIN LINE */}
          <div
            className="
              timeline-line
              absolute
              left-[32px]
              top-0
              h-full
              w-[2px]
              bg-[#7C8B57]
            "
          />

          <div className="flex flex-col gap-12">
            {journey.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={index}
                  className="
                    timeline-item
                    relative
                    pl-24
                  "
                >
                  {/* POINT */}
                  <button
                    onClick={() =>
                      setOpenIndex(isOpen ? null : index)
                    }
                    className="
                      absolute
                      left-0
                      top-0
                      group
                    "
                  >
                    {/* OUTER CIRCLE */}
                    <div
                      className={`
                        h-16
                        w-16
                        rounded-full
                        border-2
                        border-[#7C8B57]
                        bg-[#F5F3EB]
                        flex
                        items-center
                        justify-center
                        transition-all
                        duration-500
                        ${
                          isOpen
                            ? "scale-110 shadow-xl"
                            : "hover:scale-105"
                        }
                      `}
                    >
                      {/* INNER HOLE */}
                      <div
                        className={`
                          rounded-full
                          bg-[#7C8B57]
                          transition-all
                          duration-500
                          ${
                            isOpen
                              ? "h-6 w-6"
                              : "h-4 w-4"
                          }
                        `}
                      />
                    </div>
                  </button>

                  {/* CONNECTOR */}
                  <div
                    className="
                      absolute
                      left-[64px]
                      top-8
                      h-[2px]
                      w-10
                      bg-[#7C8B57]
                    "
                  />

                  {/* CONTENT */}
                  <div className="pt-3 pl-2">
  {/* HEADING */}
<h2
  className={`
    ${pixelify.className}
    text-4xl
    tracking-tight
    leading-none
    transition-all
    duration-500
  `}
>
    {item.title}
  </h2>

  <span
    className="
      mt-3
      block
      text-sm
      uppercase
      tracking-[4px]
      text-[#7C8B57]
    "
  >
    {item.year}
  </span>

                    {/* EXPANDABLE CARD */}
                    <div
                      className={`
                        overflow-hidden
                        transition-all
                        duration-700
                        ${
                          isOpen
                            ? "max-h-[700px] opacity-100 mt-8"
                            : "max-h-0 opacity-0"
                        }
                      `}
                    >
                      <div
                        className="
                          rounded-[28px]
                          border
                          border-[#DAD6C8]
                          bg-white/60
                          backdrop-blur-xl
                          p-8
                          shadow-[0_10px_50px_rgba(0,0,0,0.05)]
                        "
                      >
                        <p
                          className="
                            text-lg
                            leading-relaxed
                            text-[#5E6846]
                          "
                        >
                          {item.description}
                        </p>

                        {/* TECH STACK */}
                        <div className="mt-8 flex flex-wrap gap-3">
                          {item.tech.map((tech) => (
                            <span
                              key={tech}
                              className="
                                rounded-full
                                border
                                border-[#C8D0B0]
                                bg-[#EEF2E4]
                                px-4
                                py-2
                                text-sm
                                font-medium
                                text-[#55613A]
                              "
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <div>
        <Rest />
      </div>  
    </div>
  );
}