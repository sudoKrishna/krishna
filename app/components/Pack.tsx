"use client";

import { Geist_Mono } from "next/font/google";

const mono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const sections = [
  {
    title: "AI",
    tools:
      "Agentic AI · AI Coding Agents · LLM Tool-Use / Function Calling · OpenAI-Compatible API Integration · Prompt Engineering · Context Management · Conversation Memory · Agent Evals · SWE-bench",
  },
  {
    title: "Frontend",
    tools: "React · Next.js · TypeScript · JavaScript · Tailwind CSS",
  },
  {
    title: "Backend",
    tools: "Node.js · Express · Prisma ORM · REST APIs · WebSocket (ws)",
  },
  {
    title: "Databases",
    tools: "PostgreSQL · MongoDB · Redis",
  },
  {
    title: "DevOps & Tools",
    tools: "Docker · Vercel · Turborepo · Git · GitHub · CI/CD · Automated Testing · Bun",
  },
];

export default function Pack() {
  return (
    <section className="px-6 py-10 bg-[var(--background)]">
      <div className="mx-auto max-w-4xl">
        <h2 className={`${mono.className} text-lg font-semibold text-[var(--foreground)]`}>
          Skills
        </h2>

        <div className="mt-4 flex flex-col gap-3">
          {sections.map((section, index) => (
            <div
              key={index}
              className="flex flex-col gap-1 sm:flex-row sm:gap-6"
            >
              <span
                className={`${mono.className} w-40 shrink-0 text-sm font-semibold text-[var(--foreground)]`}
              >
                {section.title}
              </span>

              <span className="text-sm text-[var(--muted)]">{section.tools}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
