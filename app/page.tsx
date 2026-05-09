"use client";

import Image from "next/image";
import { Pixelify_Sans } from "next/font/google";
import { Edu_AU_VIC_WA_NT_Guides } from "next/font/google";
import { Edu_NSW_ACT_Cursive } from "next/font/google";
import MenuBar from "./components/Menubar";
import Build from "./components/Build";
import Pack from "./components/Pack";
import GithubPage from "./components/Github";
import Rest from "./components/Rest";
import { useCodeMode } from "./context/CodeModeContext";

const cursiveFont = Edu_NSW_ACT_Cursive({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const toBinary = (text: string) =>
  text
    .split("")
    .map((c) => c.charCodeAt(0).toString(2))
    .join(" ");

export default function Home() {
  const { codeMode } = useCodeMode();

  return (
    <div
      className={`transition-all duration-700 ${
        codeMode ? "bg-black text-green-400" : ""
      }`}
    >
      <main className="relative w-screen h-screen overflow-hidden">

        {/* BACKGROUND */}
        <Image
          src="/download.png"
          alt="Background"
          fill
          className={`object-cover transition-all duration-700 ${
            codeMode ? "brightness-0 contrast-200" : "brightness-50"
          }`}
          priority
        />

        <div
          className={`absolute inset-0 transition-all duration-700 ${
            codeMode ? "bg-black/80" : "bg-black/30"
          }`}
        />

        {/* HERO TEXT */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center -translate-y-15 gap-6">
          
          <h2
            className={`${pixelify.className} text-6xl md:text-8xl drop-shadow-lg`}
          >
            {codeMode
              ? toBinary("Hi! I am Krishna")
              : "Hi! I am Krishna"}
          </h2>

          <h1
            className={`${cursiveFont.className} text-2xl drop-shadow-lg`}
          >
            {codeMode
              ? toBinary("A focused Full Stack Developer.")
              : "A focused Full Stack Developer."}
          </h1>
        </div>

        {/* PATH SECTION */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center translate-y-30 gap-6">

          <h3 className={`${pixelify.className} text-gray-300 text-xl`}>
            {codeMode
              ? toBinary("CHOOSE YOUR PATH")
              : "------ CHOOSE YOUR PATH ------"}
          </h3>

          {/* TABS (UNCHANGED STYLE) */}
          <div className="flex gap-6 mt-4">

            {/* TAB 1 */}
            <div className="relative px-25 py-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/20 transition cursor-pointer">

              <p className={`${cursiveFont.className} absolute top-3 left-4 text-sm text-white/70`}>
                01
              </p>

              <p className="absolute top-3 right-4 text-white/70 text-lg">
                →
              </p>

              <p className={`${pixelify.className} absolute bottom-3 right-4 text-lg`}>
                {codeMode ? toBinary("The Life") : "The Life"}
              </p>
            </div>

            {/* TAB 2 */}
            <div className="relative px-25 py-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/20 transition cursor-pointer">

              <p className={`${cursiveFont.className} absolute top-3 left-4 text-sm text-white/70`}>
                02
              </p>

              <p className="absolute top-3 right-4 text-white/70 text-lg">
                →
              </p>

              <p className={`${pixelify.className} absolute bottom-3 right-4 text-lg`}>
                {codeMode ? toBinary("The Work") : "The Work"}
              </p>
            </div>

          </div>
        </div>
      </main>

      {/* MENU */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-99">
        <MenuBar />
      </div>

      {/* SECTIONS (AUTO INHERIT CODE MODE INSIDE THEM) */}
      <div>
        <Build />
      </div>
      <div>
        <Pack />
      </div>
      <div>
        <GithubPage />
      </div>
      <div>
        <Rest />
      </div>

      {/* OPTIONAL GLOBAL HACK OVERLAY */}
      {codeMode && (
        <div className="pointer-events-none fixed inset-0 z-50 opacity-10 text-green-400 text-[10px] whitespace-pre-wrap">
          {Array.from({ length: 100 })
            .map(() =>
              Math.random().toString(2).slice(2, 120)
            )
            .join("\n")}
        </div>
      )}
    </div>
  );
}