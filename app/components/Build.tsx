"use client";

import { Geist_Mono } from "next/font/google";

const mono = Geist_Mono({
    subsets: ["latin"],
    weight: ["400", "700"],
});

type BuildItem = {
    id: number;
    title: string;
    description: string;
    tech: string[];
    image: string;
    live: string;
    github: string;
};

const builds: BuildItem[] = [
    {
        id: 1,
        title: "shy",
        description:
            "A coding agent harness built from scratch — a tool-calling loop that gives an LLM bash/read/write/edit/grep tools and lets it work autonomously toward a task, with every step traced. Benchmarked against SWE-bench Lite.",
        tech: ["TypeScript", "Bun", "OpenAI SDK", "SWE-bench"],
        image: "/shy.png",
        live: "https://shy-lake.vercel.app/",
        github: "https://github.com/sudoKrishna/shy",
    },
    {
        id: 2,
        title: "golt",
        description:
            "An AI app-builder: chat with an agent, it plans and writes a real project into a live sandbox, and you watch it run — with GitHub push and full project persistence. Self-hosted, Turborepo monorepo.",
        tech: ["Next.js", "Express", "WebSockets", "Prisma", "E2B"],
        image: "/golt.png",
        live: "https://golt-web-tau.vercel.app/",
        github: "https://github.com/sudoKrishna/golt",
    },
];

export default function Build() {
    return (
        <div className="px-6 py-10 bg-[var(--background)] text-[var(--foreground)]">
            <div className="mx-auto max-w-4xl">
                {/* HEADER */}
                <h2 className={`${mono.className} text-lg font-semibold text-[var(--foreground)]`}>
                    Projects
                </h2>

                {/* GRID */}
                <div className="mt-4 grid gap-5 md:grid-cols-2">
                    {builds.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/40"
                        >
                            {/* THUMBNAIL — opens the live deploy */}
                            <a
                                href={item.live}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block h-40 w-full overflow-hidden bg-black"
                            >
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="h-full w-full object-cover"
                                />
                            </a>

                            {/* CONTENT */}
                            <div className="p-5">
                                <a
                                    href={item.live}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`${mono.className} text-base font-medium text-[var(--foreground)] hover:text-[var(--accent)]`}
                                >
                                    {item.title}
                                </a>

                                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                                    {item.description}
                                </p>

                                {/* TECH */}
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {item.tech.map((t) => (
                                        <span
                                            key={t}
                                            className={`${mono.className} rounded-full border border-[var(--border)] bg-[var(--surface-alt)] px-2.5 py-1 text-xs text-[var(--muted)]`}
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>

                                {/* LINKS */}
                                <div className={`${mono.className} mt-4 flex gap-4 text-sm`}>
                                    <a
                                        href={item.live}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[var(--accent-cyan)] hover:text-[var(--accent)] hover:underline"
                                    >
                                        Live
                                    </a>
                                    <a
                                        href={item.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[var(--accent-cyan)] hover:text-[var(--accent)] hover:underline"
                                    >
                                        GitHub
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
