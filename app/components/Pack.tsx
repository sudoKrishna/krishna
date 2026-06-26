"use client";

import { Jersey_10 } from "next/font/google";
import { Edu_NSW_ACT_Cursive } from "next/font/google";

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
      "SupaBase"
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
    tools: ["TypeScript", "JavaScript"],
  },
];

export default function Pack() {
  return (
    <section className="px-6 py-10 transition-all duration-700 bg-[#F5F3EB]">
      <div className="flex flex-col gap-2">
        {/* HERO */}
        <h1
          className={`${jersey.className} text-[68px] md:text-[88px] leading-[0.95] tracking-wide`}
        >
          <span className="text-[#4A5D23]">Inside the</span>{" "}
          <span className="text-black">Inventory</span>
        </h1>

        {/* SUBTITLE */}
        <h2
          className={`${cursiveFont.className} ml-1 text-lg md:text-xl text-[#6C7B4B]`}
        >
          Everything needed for modern web adventures.
        </h2>

        {/* SECTIONS GRID */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-x-14 gap-y-14">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {/* HEADING */}
              <div className="flex items-center gap-3">
                <h3
                  className={`${jersey.className} text-3xl md:text-4xl tracking-wide whitespace-nowrap text-black`}
                >
                  {section.title}
                </h3>

                <div className="h-[2px] flex-1 bg-black/20" />
              </div>

              {/* BUTTONS */}
              <div className="mt-3 flex flex-wrap gap-2">
                {section.tools.map((tool, index) => (
                  <button
                    key={index}
                    className={`${cursiveFont.className}
                      rounded-full
                      border
                      px-5
                      py-2
                      text-base
                      whitespace-nowrap
                      transition-all
                      duration-200
                      hover:-translate-y-1
                      hover:shadow-lg
                      bg-white/70 border-black/15 text-[#4A5D23] hover:bg-[#4A5D23] hover:text-[#F5F3EB]
                    `}
                  >
                    {tool}
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