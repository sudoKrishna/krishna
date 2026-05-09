"use client";

import { Jersey_10 } from "next/font/google";
import { Edu_NSW_ACT_Cursive } from "next/font/google";
import { useCodeMode } from "../context/CodeModeContext";

const jersey = Jersey_10({
  subsets: ["latin"],
  weight: "400",
});

const cursiveFont = Edu_NSW_ACT_Cursive({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sections = [
  {
    title: "Backend & APIs",
    tools: ["Node.js", "Express", "tRPC", "OpenAI SDK"],
  },
  {
    title: "Architecture",
    tools: [
      "System Design",
      "Event-driven Architecture",
      "CQRS",
      "Microservices",
      "REST APIs",
      "WebSockets",
      "Monorepos",
    ],
  },
  {
    title: "Databases & Caching",
    tools: [
      "PostgreSQL",
      "MongoDB",
      "Qdrant",
      "Redis",
      "Redis Streams",
      "Prisma",
      "Drizzle",
    ],
  },
  {
    title: "DevOps & Cloud",
    tools: ["Docker", "Kubernetes", "k3s", "KEDA", "CI/CD", "Vercel", "AWS"],
  },
  {
    title: "Frontend",
    tools: [
      "React",
      "Next.js",
      "Vite",
      "React Query",
      "Zustand",
      "Tailwind CSS",
      "shadcn/ui",
    ],
  },
  {
    title: "Languages",
    tools: ["TypeScript", "JavaScript", "Python"],
  },
];

const toBinary = (text: string) =>
  text
    .split("")
    .map((c) => c.charCodeAt(0).toString(2))
    .join(" ");

export default function Pack() {
  const { codeMode } = useCodeMode();

  return (
    <section
      className={`px-6 py-20 transition-all duration-700 ${
        codeMode ? "bg-black text-green-400" : "bg-[#F5F3EB]"
      }`}
    >
      {/* ⚡ HACK OVERLAY */}
      {codeMode && (
        <div className="pointer-events-none fixed inset-0 z-50 opacity-10 text-green-400 text-[10px] whitespace-pre-wrap">
          {Array.from({ length: 80 })
            .map(() => Math.random().toString(2).slice(2, 120))
            .join("\n")}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {/* HERO */}
        <h1
          className={`${jersey.className} text-[90px] md:text-[120px] leading-[0.9] tracking-wide`}
        >
          <span className={codeMode ? "text-green-400" : "text-[#4A5D23]"}>
            {codeMode ? toBinary("Inside the") : "Inside the"}
          </span>{" "}
          <span className={codeMode ? "text-green-300" : "text-black"}>
            {codeMode ? toBinary("Inventory") : "Inventory"}
          </span>
        </h1>

        {/* SUBTITLE */}
        <h2
          className={`${cursiveFont.className} ml-1 text-lg md:text-xl ${
            codeMode ? "text-green-300" : "text-[#6C7B4B]"
          }`}
        >
          {codeMode
            ? toBinary("Everything needed for modern web adventures.")
            : "Everything needed for modern web adventures."}
        </h2>

        {/* SECTIONS */}
        <div className="mt-20 flex flex-col gap-20">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="max-w-5xl">
              {/* HEADING */}
              <div className="flex items-center gap-4">
                <h3
                  className={`${jersey.className} text-4xl md:text-5xl tracking-wide ${
                    codeMode ? "text-green-400" : "text-black"
                  }`}
                >
                  {codeMode
                    ? toBinary(section.title)
                    : section.title}
                </h3>

                <div className="h-[2px] flex-1 bg-black/20" />
              </div>

              {/* BUTTONS */}
              <div className="mt-8 flex flex-wrap gap-4">
                {section.tools.map((tool, index) => (
                  <button
                    key={index}
                    className={`${cursiveFont.className}
                      rounded-full
                      border
                      px-6
                      py-3
                      text-base
                      transition-all
                      duration-200
                      hover:-translate-y-1
                      hover:shadow-lg
                      ${
                        codeMode
                          ? "bg-black border-green-500 text-green-400"
                          : "bg-white/70 border-black/15 text-[#4A5D23] hover:bg-[#4A5D23] hover:text-[#F5F3EB]"
                      }
                    `}
                  >
                    {codeMode ? toBinary(tool) : tool}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}