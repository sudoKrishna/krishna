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
    <div className="min-h-screen bg-[#0a0e14] flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-[#0d1117] border border-[#262c36] shadow-[0_0_40px_rgba(57,211,83,0.06)] overflow-hidden"
        >
          <div className="p-10">
            <h1
              className={`${mono.className} text-4xl font-bold uppercase tracking-widest text-[#e6edf3]`}
            >
              Krishna Chaudhary
            </h1>

            <p className={`${mono.className} mt-3 text-sm text-[#8b949e]`}>
              Delhi, India | +91 8077169879 | krishnachaudhary2007gt@gmail.com
            </p>

            <div className={`${mono.className} flex gap-4 mt-3 text-sm text-[#58a6ff]`}>
              <a
                href="https://www.linkedin.com/in/krishna-chaudhary-1b287526b/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#39d353]"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/sudoKrishna"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#39d353]"
              >
                GitHub
              </a>
              <a
                href="https://x.com/cha73066"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#39d353]"
              >
                X
              </a>
              <Link href="/" className="underline hover:text-[#39d353]">
                Portfolio
              </Link>
            </div>

            <div className="mt-8">
              <h2
                className={`${mono.className} text-xl font-semibold uppercase tracking-wider border-b border-[#262c36] pb-2 text-[#e6edf3]`}
              >
                Professional Summary
              </h2>

              <p className="mt-4 text-[#8b949e] leading-relaxed">
                Passionate Full Stack & Web3 developer with strong expertise
                in JavaScript, TypeScript, React, Next.js, and Solana...
              </p>
            </div>

            <div className="mt-8 flex justify-center">
              <a
                href="https://kkkk-e2731a.tiiny.site"
                target="_blank"
                rel="noopener noreferrer"
                className={`${mono.className} inline-block px-8 py-3 bg-[#238636] text-white font-semibold uppercase tracking-wider border border-[#238636] shadow-[0_0_20px_rgba(57,211,83,0.15)] hover:bg-[#2ea043] hover:-translate-y-0.5 transition-all`}
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
