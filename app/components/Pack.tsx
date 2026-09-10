"use client";

import { Geist_Mono } from "next/font/google";

const mono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
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
    <section className="px-6 py-20 bg-[#0a0e14]">
      <div className="flex flex-col gap-2">
        {/* HERO */}
        <h1
          className={`${mono.className} text-4xl md:text-6xl font-bold tracking-tight`}
        >
          <span className="text-[#8b949e]">$</span>{" "}
          <span className="text-[#e6edf3]">cat</span>{" "}
          <span className="text-[#39d353]">stack.json</span>
        </h1>

        {/* SUBTITLE */}
        <h2
          className={`${mono.className} ml-1 text-sm md:text-base text-[#8b949e]`}
        >
          {"// everything needed to ship modern web software"}
        </h2>

        {/* SECTIONS GRID */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-x-14 gap-y-14">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {/* HEADING */}
              <div className="flex items-center gap-3">
                <h3
                  className={`${mono.className} text-xl md:text-2xl font-semibold tracking-tight whitespace-nowrap text-[#e6edf3]`}
                >
                  {section.title}
                </h3>

                <div className="h-[1px] flex-1 bg-[#262c36]" />
              </div>

              {/* BUTTONS */}
              <div className="mt-3 flex flex-wrap gap-2">
                {section.tools.map((tool, index) => (
                  <button
                    key={index}
                    className={`${mono.className}
                      rounded-full
                      border
                      px-5
                      py-2
                      text-sm
                      whitespace-nowrap
                      transition-all
                      duration-200
                      hover:-translate-y-1
                      hover:shadow-lg
                      bg-[#161b22] border-[#262c36] text-[#8b949e] hover:bg-[#238636] hover:border-[#238636] hover:text-white
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