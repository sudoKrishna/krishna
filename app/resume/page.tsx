"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Geist_Mono } from "next/font/google";

const mono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function ResumePreview() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-[var(--surface)] border border-[var(--border)] shadow-[0_0_40px_rgba(57,211,83,0.06)] overflow-hidden"
        >
          <div className="p-10">
            <h1
              className={`${mono.className} text-4xl font-bold uppercase tracking-widest text-[var(--foreground)]`}
            >
              Krishna Chaudhary
            </h1>

            <p className={`${mono.className} mt-3 text-sm text-[var(--muted)]`}>
              Delhi, India | +91 8077169879 | krishnachaudhary2007gt@gmail.com
            </p>

            <div className={`${mono.className} flex gap-4 mt-3 text-sm text-[var(--accent-cyan)]`}>
              <a
                href="https://www.linkedin.com/in/krishna-chaudhary-1b287526b/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[var(--accent)]"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/sudoKrishna"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[var(--accent)]"
              >
                GitHub
              </a>
              <a
                href="https://x.com/cha73066"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[var(--accent)]"
              >
                X
              </a>
              <Link href="/" className="underline hover:text-[var(--accent)]">
                Portfolio
              </Link>
            </div>

            <div className="mt-8">
              <h2
                className={`${mono.className} text-xl font-semibold uppercase tracking-wider border-b border-[var(--border)] pb-2 text-[var(--foreground)]`}
              >
                Professional Summary
              </h2>

              <p className="mt-4 text-[var(--muted)] leading-relaxed">
                Passionate Full Stack & Web3 developer with strong expertise
                in JavaScript, TypeScript, React, Next.js, and Solana...
              </p>
            </div>

            <div className="mt-8 flex justify-center">
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className={`${mono.className} inline-block px-8 py-3 bg-[var(--accent-solid)] text-white font-semibold uppercase tracking-wider border border-[var(--accent-solid)] shadow-[0_0_20px_rgba(57,211,83,0.15)] hover:bg-[var(--accent-dim)] hover:-translate-y-0.5 transition-all`}
              >
                View Full Resume
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
