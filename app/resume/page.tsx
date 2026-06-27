"use client";

import { motion } from "framer-motion";

export default function ResumePreview() {
  return (
    <div className="min-h-screen bg-[#f5f3eb] flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white border border-black shadow-[8px_8px_0px_black] overflow-hidden"
        >
          <div className="p-10">
            <h1 className="text-4xl font-bold uppercase tracking-widest">
              Krishna Chaudhary
            </h1>

            <p className="mt-3 text-sm text-gray-700">
              Delhi, India | +91 8077169879 | krishanchauhdary2007gt@gmail.com
            </p>

            <div className="flex gap-4 mt-3 text-sm">
              <a href="#" className="underline">LinkedIn</a>
              <a href="#" className="underline">GitHub</a>
              <a href="#" className="underline">X</a>
              <a href="#" className="underline">Portfolio</a>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold uppercase tracking-wider border-b border-black pb-2">
                Professional Summary
              </h2>

              <p className="mt-4 text-gray-700 leading-relaxed">
                Passionate Full Stack & Web3 developer with strong expertise
                in JavaScript, TypeScript, React, Next.js, and Solana...
              </p>
            </div>

            <div className="mt-8 flex justify-center">
              <a
                href="https://kkkk-e2731a.tiiny.site"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 bg-black text-white font-semibold uppercase tracking-wider border border-black shadow-[4px_4px_0px_black] hover:shadow-[2px_2px_0px_black] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
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