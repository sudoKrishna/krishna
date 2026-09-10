"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";

import { Geist_Mono } from "next/font/google";

import MenuBar from "./components/Menubar";
import Build from "./components/Build";
import Pack from "./components/Pack";
import GithubPage from "./components/Github";
import Rest from "./components/Rest";

const mono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function Home() {
  const router = useRouter();

  // BUILD SECTION REF
  const buildRef = useRef<HTMLDivElement | null>(null);

  // SCROLL TO BUILD SECTION
  const handleLifeClick = () => {
    buildRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // MOVE TO /WORK PAGE
  const handleWorkClick = () => {
    router.push("/work");
  };

  // MOVE TO /WOWS PAGE
  const handleWowsClick = () => {
    router.push("/wows");
  };

  return (
    <div className="overflow-hidden">
      <main className="relative w-screen h-screen">

        {/* BACKGROUND */}
        <div className="absolute inset-0 bg-[#0a0e14]" />
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(57,211,83,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(57,211,83,0.4) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0e14]/40 to-[#0a0e14]" />

        {/* HERO TEXT */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center -translate-y-32 gap-6">

          <h2
            className={`${mono.className} text-5xl md:text-7xl font-bold text-[#e6edf3] drop-shadow-lg`}
          >
            Hi, I&apos;m{" "}
            <span className="text-[#39d353]">Krishna</span>
            <span className="animate-pulse text-[#39d353]">_</span>
          </h2>

          <h1
            className={`${mono.className} text-lg md:text-xl text-[#8b949e] drop-shadow-lg text-center`}
          >
            {"// a focused full stack developer"}
          </h1>
        </div>

        {/* PATH SECTION */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center translate-y-24 gap-8">

          <h3 className={`${mono.className} text-[#8b949e] text-sm md:text-base flex items-center gap-4`}>
            <span className="h-[1px] w-10 bg-[#262c36]" />
            CHOOSE YOUR PATH
            <span className="h-[1px] w-10 bg-[#262c36]" />
          </h3>

          {/* TABS */}
          <div className="flex gap-8 mt-2">

            {/* LIFE TAB */}
            <div
              onClick={handleLifeClick}
              className="
                relative
                w-80
                h-52
                rounded-2xl
                bg-[#0d1117]/60
                backdrop-blur-md
                border
                border-[#262c36]
                shadow-lg
                hover:bg-[#0d1117]/90 hover:border-[#39d353]/50
                hover:scale-105
                transition-all
                duration-300
                cursor-pointer
              "
            >
              <p className={`${mono.className} absolute top-4 left-5 text-sm text-[#8b949e]`}>
                01
              </p>

              <p className="absolute top-4 right-5 text-[#39d353] text-2xl">
                →
              </p>

              <p className={`${mono.className} absolute bottom-4 right-5 text-xl font-semibold text-[#e6edf3]`}>
                The Life
              </p>
            </div>

            {/* WORK TAB */}
            <div
              onClick={handleWorkClick}
              className="
                relative
                w-80
                h-52
                rounded-2xl
                bg-[#0d1117]/60
                backdrop-blur-md
                border
                border-[#262c36]
                shadow-lg
                hover:bg-[#0d1117]/90 hover:border-[#39d353]/50
                hover:scale-105
                transition-all
                duration-300
                cursor-pointer
              "
            >
              <p className={`${mono.className} absolute top-4 left-5 text-sm text-[#8b949e]`}>
                02
              </p>

              <p className="absolute top-4 right-5 text-[#39d353] text-2xl">
                →
              </p>

              <p className={`${mono.className} absolute bottom-4 right-5 text-xl font-semibold text-[#e6edf3]`}>
                The Work
              </p>
            </div>

            {/* WOWS TAB */}
            <div
              onClick={handleWowsClick}
              className="
                relative
                w-80
                h-52
                rounded-2xl
                bg-[#0d1117]/60
                backdrop-blur-md
                border
                border-[#262c36]
                shadow-lg
                hover:bg-[#0d1117]/90 hover:border-[#39d353]/50
                hover:scale-105
                transition-all
                duration-300
                cursor-pointer
              "
            >
              <p className={`${mono.className} absolute top-4 left-5 text-sm text-[#8b949e]`}>
                03
              </p>

              <p className="absolute top-4 right-5 text-[#39d353] text-2xl">
                →
              </p>

              <p className={`${mono.className} absolute bottom-4 right-5 text-xl font-semibold text-[#e6edf3]`}>
                The Wows
              </p>
            </div>

          </div>
        </div>
      </main>

      {/* MENU */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-99">
        <MenuBar />
      </div>

      {/* BUILD SECTION */}
      <div ref={buildRef}>
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
    </div>
  );
}