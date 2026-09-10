"use client";

import Link from "next/link";
import { Geist_Mono } from "next/font/google";
import { GitBranch } from "lucide-react";

import Build from "./components/Build";
import Pack from "./components/Pack";
import GithubPage from "./components/Github";
import Rest from "./components/Rest";

const mono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function Home() {
  return (
    <div className="bg-[#0a0e14] text-[#e6edf3]">
      <div className="mx-auto max-w-4xl px-6 pt-16 pb-8">
        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className={`${mono.className} text-2xl font-bold text-[#e6edf3]`}>
              Krishna Chaudhary
            </h1>
            <p className={`${mono.className} mt-1 text-sm text-[#8b949e]`}>
              Full Stack Developer
            </p>
          </div>

          <a
            href="https://github.com/sudoKrishna"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-[#8b949e] hover:text-[#39d353]"
          >
            <GitBranch size={18} />
            <span className={mono.className}>GitHub</span>
          </a>
        </div>

        {/* BIO */}
        <div className={`${mono.className} mt-8 space-y-4 text-sm leading-relaxed text-[#c9d1d9]`}>
          <p>Hi, I&apos;m Krishna, a full stack developer who enjoys building end to end.</p>

          <p>
            I&apos;ve recently been building{" "}
            <a
              href="https://chaos-tester.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#58a6ff] hover:text-[#39d353] hover:underline"
            >
              API Chaos Tester
            </a>
            , an automated API fuzzer, and{" "}
            <a
              href="https://oran-three.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#58a6ff] hover:text-[#39d353] hover:underline"
            >
              Oran
            </a>
            , a collaborative AI-assisted IDE.
          </p>

          <p>
            Currently exploring full-stack and real-time systems work. I care about clean
            architecture and shipping things that feel fast and polished.
          </p>

          <p>
            Want to talk?{" "}
            <a
              href="mailto:krishnachaudhary2007gt@gmail.com"
              className="text-[#58a6ff] hover:text-[#39d353] hover:underline"
            >
              Email me
            </a>{" "}
            or view{" "}
            <Link href="/resume" className="text-[#58a6ff] hover:text-[#39d353] hover:underline">
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

      <div className="mx-auto max-w-4xl px-6 pb-16 pt-6">
        <Link
          href="/work"
          className={`${mono.className} text-sm text-[#8b949e] hover:text-[#39d353] hover:underline`}
        >
          → see the full journey
        </Link>
      </div>
    </div>
  );
}
