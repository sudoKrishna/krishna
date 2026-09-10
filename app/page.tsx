"use client";

import Link from "next/link";
import { Geist_Mono } from "next/font/google";
import { GitBranch } from "lucide-react";

import Build from "./components/Build";
import Pack from "./components/Pack";
import GithubPage from "./components/Github";
import Rest from "./components/Rest";
import ThemeToggle from "./components/ThemeToggle";
import Pet from "./components/Pet";

const mono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function Home() {
  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto max-w-4xl px-6 pt-16 pb-8">
        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className={`${mono.className} text-2xl font-bold text-[var(--foreground)]`}>
              Krishna Chaudhary
            </h1>
            <p className={`${mono.className} mt-1 text-sm text-[var(--muted)]`}>
              Full Stack Developer
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/sudoKrishna"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--accent)]"
            >
              <GitBranch size={18} />
              <span className={mono.className}>GitHub</span>
            </a>

            <ThemeToggle />
          </div>
        </div>

        {/* BIO */}
        <div className={`${mono.className} mt-8 space-y-4 text-sm leading-relaxed text-[var(--foreground-soft)]`}>
          <p>Hi, I&apos;m Krishna, a full stack developer who enjoys building end to end.</p>

          <p>
            I&apos;ve recently been building{" "}
            <a
              href="https://github.com/sudoKrishna/shy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent-cyan)] hover:text-[var(--accent)] hover:underline"
            >
              shy
            </a>
            , a coding agent harness benchmarked against SWE-bench, and{" "}
            <a
              href="https://github.com/sudoKrishna/golt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent-cyan)] hover:text-[var(--accent)] hover:underline"
            >
              golt
            </a>
            , a self-hosted AI app-builder.
          </p>

          <p>
            Currently exploring full-stack and real-time systems work. I care about clean
            architecture and shipping things that feel fast and polished.
          </p>

          <p>
            Want to talk?{" "}
            <a
              href="mailto:krishnachaudhary2007gt@gmail.com"
              className="text-[var(--accent-cyan)] hover:text-[var(--accent)] hover:underline"
            >
              Email me
            </a>{" "}
            or view{" "}
            <Link href="/resume" className="text-[var(--accent-cyan)] hover:text-[var(--accent)] hover:underline">
              my resume
            </Link>
            .
          </p>
        </div>
      </div>

      <Build />
      <Pack />
      <GithubPage />
      <Rest />

      <Pet />
    </div>
  );
}
