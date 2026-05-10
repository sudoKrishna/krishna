"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { Jersey_10, Edu_NSW_ACT_Cursive } from "next/font/google";

const cursiveFont = Edu_NSW_ACT_Cursive({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function ResumePreview() {
  return (
    <div className="min-h-screen bg-[#f5f3eb] flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-4xl">

        {/* RESUME PREVIEW */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white border border-black shadow-[8px_8px_0px_black] overflow-hidden"
        >
          {/* TOP CONTENT */}
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

            {/* SUMMARY */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold uppercase tracking-wider border-b border-black pb-2">
                Professional Summary
              </h2>

              <p className="mt-4 text-gray-700 leading-relaxed">
                Passionate Full Stack & Web3 developer with strong expertise
                in JavaScript, TypeScript, React, Next.js, and Solana...
              </p>
            </div>
          </div>

          {/* LOCK SECTION */}
          <div className="relative h-[420px] bg-gradient-to-b from-white via-[#f5f3eb] to-[#e7e3d5] flex items-center justify-center overflow-hidden">

            {/* BLUR BACKGROUND FAKE TEXT */}
            <div className="absolute inset-0 opacity-30 blur-sm pointer-events-none">
              <div className="space-y-5 px-10 py-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-4 bg-black/20 rounded"
                    style={{
                      width: `${75 + Math.random() * 25}%`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* CENTER LOCK CONTENT */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="relative z-10 text-center"
            >
              <div className="w-20 h-20 rounded-full border-4 border-black bg-white flex items-center justify-center mx-auto shadow-[4px_4px_0px_black]">
                <Lock size={34} />
              </div>

              <h2
                className={`mt-6 text-4xl font-black text-gray-400 tracking-widest ${cursiveFont.className}`}
              >
                Hire To Unlock Full Potential
              </h2>

              <p className="mt-4 text-gray-700 max-w-lg mx-auto leading-relaxed">
                The rest of the resume contains advanced engineering work,
                Web3 systems, scalable architecture, and production-grade builds.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}