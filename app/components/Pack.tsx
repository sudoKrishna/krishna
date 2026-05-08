"use client";

import { Jersey_10 } from "next/font/google";
import { Edu_NSW_ACT_Cursive } from "next/font/google";

const jersey = Jersey_10({
  subsets: ["latin"],
  weight: "400",
});

const cursiveFont = Edu_NSW_ACT_Cursive({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const backendTools = [
  "Node.js",
  "Express",
  "tRPC",
  "Django REST Framework",
  "Firebase",
  "OpenAI SDK",
];

export default function Pack() {
  return (
    <section className="bg-[#F5F3EB] px-6 py-20">
      <div className="flex flex-col gap-3">

        {/* HERO */}
        <h1
          className={`${jersey.className} text-[120px] leading-[0.9] tracking-wide font-thin`}
        >
          <span className="text-[#4A5D23]">Inside the</span>{" "}
          <span className="text-black">Inventory</span>
        </h1>

        <h2
          className={`${cursiveFont.className} ml-1 text-lg text-[#6C7B4B] md:text-xl`}
        >
          Everything needed for modern web adventures.
        </h2>

        {/* SECTION */}
        <div className="mt-20 max-w-4xl">

          {/* HEADING */}
          <div className="flex items-center gap-4">
            <h3
              className={`${jersey.className} text-5xl tracking-wide text-black`}
            >
              Backend & APIs
            </h3>

            <div className="h-[2px] flex-1 bg-black/20" />
          </div>

          {/* BUTTONS */}
          <div className="mt-8 flex flex-wrap gap-4">
            {backendTools.map((tool, index) => (
              <button
                key={index}
                className={`${cursiveFont.className}
                  rounded-full
                  border
                  border-black/15
                  bg-white/70
                  px-6
                  py-3
                  text-base
                  text-[#4A5D23]
                  transition-all
                  duration-200
                  hover:-translate-y-1
                  hover:bg-[#4A5D23]
                  hover:text-[#F5F3EB]
                  hover:shadow-lg
                `}
              >
                {tool}
              </button>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}