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
    image?: string;
    viewLink: string;
    codeLink: string;
};

const builds: BuildItem[] = [
    {
        id: 1,
        title: "API Chaos Tester",
        description:
            "Automatically fuzz your API with malformed inputs and surface validation failures. Upload an OpenAPI spec, run mutation-based attacks, and get reproducible curl commands for every issue found.",
        tech: ["Next.js", "TypeScript", "OpenAPI", "Prisma"],
        image: "/tester.png",
        viewLink: "https://chaos-tester.vercel.app/",
        codeLink: "#",
    },
    {
        id: 2,
        title: "Oran",
        description:
            "A web-based collaborative coding IDE where multiple developers write code together in real time, with AI-assisted coding features similar to GitHub Copilot.",
        tech: ["Next.js", "TypeScript", "WebSockets", "AI"],
        image: "/oran.png",
        viewLink: "https://oran-three.vercel.app/",
        codeLink: "#",
    },
    {
        id: 6,
        title: "Garage Creative Studio",
        description:
            "A UI/UX-focused brand website built with Next.js and GSAP, featuring high-performance animations, immersive transitions, and polished visual storytelling.",
        tech: ["Next.js", "GSAP", "TypeScript", "Tailwind CSS"],
        image: "/download.png",
        viewLink: "https://garage-mu-beige.vercel.app/",
        codeLink: "https://github.com/sudoKrishna/garage",
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
                            {/* THUMBNAIL */}
                            {item.image && (
                                <a
                                    href={item.viewLink}
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
                            )}

                            {/* CONTENT */}
                            <div className="p-5">
                                <h3 className={`${mono.className} text-base font-medium text-[var(--foreground)]`}>
                                    {item.title}
                                </h3>

                                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                                    {item.description}
                                </p>

                                {/* LINKS */}
                                <div className={`${mono.className} mt-4 flex gap-4 text-sm text-[var(--accent-cyan)]`}>
                                    <a
                                        href={item.viewLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-[var(--accent)] hover:underline"
                                    >
                                        Live
                                    </a>
                                    {item.codeLink !== "#" && (
                                        <a
                                            href={item.codeLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-[var(--accent)] hover:underline"
                                        >
                                            GitHub
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
