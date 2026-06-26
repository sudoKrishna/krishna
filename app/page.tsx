"use client";

import Image from "next/image";
import { useRef } from "react";
import { useRouter } from "next/navigation";

import { Pixelify_Sans } from "next/font/google";
import { Edu_NSW_ACT_Cursive } from "next/font/google";

import MenuBar from "./components/Menubar";
import Build from "./components/Build";
import Pack from "./components/Pack";
import GithubPage from "./components/Github";
import Rest from "./components/Rest";

const cursiveFont = Edu_NSW_ACT_Cursive({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
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
        <Image
          src="/download.png"
          alt="Background"
          fill
          className="object-cover brightness-50"
          priority
        />

        <div className="absolute inset-0 bg-black/30" />

        {/* HERO TEXT */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center -translate-y-32 gap-6">

          <h2
            className={`${pixelify.className} text-6xl md:text-8xl drop-shadow-lg`}
          >
            Hi! I am Krishna
          </h2>

          <h1
            className={`${cursiveFont.className} text-2xl drop-shadow-lg text-center`}
          >
            A focused Full Stack Developer.
          </h1>
        </div>

        {/* PATH SECTION */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center translate-y-24 gap-8">

          <h3 className={`${pixelify.className} text-gray-300 text-xl flex items-center gap-4`}>
            <span className="h-[1px] w-10 bg-gray-300/60" />
            CHOOSE YOUR PATH
            <span className="h-[1px] w-10 bg-gray-300/60" />
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
                bg-white/10
                backdrop-blur-md
                border
                border-white/20
                shadow-lg
                hover:bg-white/20
                hover:scale-105
                transition-all
                duration-300
                cursor-pointer
              "
            >
              <p className={`${cursiveFont.className} absolute top-4 left-5 text-base text-white/70`}>
                01
              </p>

              <p className="absolute top-4 right-5 text-white/70 text-2xl">
                →
              </p>

              <p className={`${pixelify.className} absolute bottom-4 right-5 text-2xl`}>
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
                bg-white/10
                backdrop-blur-md
                border
                border-white/20
                shadow-lg
                hover:bg-white/20
                hover:scale-105
                transition-all
                duration-300
                cursor-pointer
              "
            >
              <p className={`${cursiveFont.className} absolute top-4 left-5 text-base text-white/70`}>
                02
              </p>

              <p className="absolute top-4 right-5 text-white/70 text-2xl">
                →
              </p>

              <p className={`${pixelify.className} absolute bottom-4 right-5 text-2xl`}>
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
                bg-white/10
                backdrop-blur-md
                border
                border-white/20
                shadow-lg
                hover:bg-white/20
                hover:scale-105
                transition-all
                duration-300
                cursor-pointer
              "
            >
              <p className={`${cursiveFont.className} absolute top-4 left-5 text-base text-white/70`}>
                03
              </p>

              <p className="absolute top-4 right-5 text-white/70 text-2xl">
                →
              </p>

              <p className={`${pixelify.className} absolute bottom-4 right-5 text-2xl`}>
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