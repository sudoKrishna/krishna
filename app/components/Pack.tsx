"use client";

import { Geist_Mono } from "next/font/google";

const mono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const sections = [
  {
    title: "Frontend",
    tools: "React · Next.js · Vite · React Query · Zustand · Tailwind CSS",
  },
  {
    title: "Backend & APIs",
    tools: "Node.js · Express · tRPC · OpenAI SDK",
  },
  {
    title: "Architecture",
    tools:
      "System Design · Event-driven Architecture · CQRS · Microservices · REST APIs · WebSockets",
  },
  {
    title: "Databases",
    tools: "PostgreSQL · MongoDB · Qdrant · Redis · Prisma · Supabase",
  },
  {
    title: "DevOps & Cloud",
    tools: "Docker · Kubernetes · k3s · CI/CD · Vercel · AWS",
  },
  {
    title: "Languages",
    tools: "TypeScript · JavaScript",
  },
];

export default function Pack() {
  return (
    <section className="px-6 py-10 bg-[#0a0e14]">
      <div className="mx-auto max-w-4xl">
        <h2 className={`${mono.className} text-lg font-semibold text-[#e6edf3]`}>
          Skills
        </h2>

        <div className="mt-4 flex flex-col gap-3">
          {sections.map((section, index) => (
            <div
              key={index}
              className="flex flex-col gap-1 sm:flex-row sm:gap-6"
            >
              <span
                className={`${mono.className} w-40 shrink-0 text-sm font-semibold text-[#e6edf3]`}
              >
                {section.title}
              </span>

              <span className="text-sm text-[#8b949e]">{section.tools}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
