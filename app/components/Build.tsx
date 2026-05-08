"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Pixelify_Sans } from "next/font/google";

const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
});


gsap.registerPlugin(ScrollTrigger);

type BuildItem = {
  id: number;
  title: string;
  description: string;
  tech: string[];
  image?: string;
  video?: string;
  viewLink: string;
  codeLink: string;
};

const builds: BuildItem[] = [
  {
    id: 1,
    title: "Pixel Portfolio",
    description: "Retro-inspired developer portfolio with modern motion.",
    tech: ["Next.js", "GSAP", "SVG"],
    image: "/download.png",
    viewLink: "#",
    codeLink: "#",
  },
  {
    id: 2,
    title: "Arcade Dashboard",
    description: "Gamified UI dashboard with pixel UI elements.",
    tech: ["React", "Node"],
    image: "/download.png",
    viewLink: "#",
    codeLink: "#",
  },
  
];

export default function Build() {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // 1. Pixel-style masked text reveal
  useEffect(() => {
    if (!titleRef.current) return;

    gsap.fromTo(
      titleRef.current,
      {
        y: 40,
        opacity: 0,
        filter: "blur(4px)",
      },
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.2,
        ease: "power3.out",
      }
    );
  }, []);


useEffect(() => {
  gsap.set(cardsRef.current, {
    opacity: 1,
    y: 0,
    scale: 1,
  });
}, []);

  return (
    <div className="min-h-screen px-6 py-10 relative overflow-hidden"
      style={{ background: "#F5F3EB" }}
    >

{/* HEADER */}
<div className="flex items-center gap-170 mb-8">

  <h1
    ref={titleRef}
    className={`text-7xl ${pixelify.className} text-[#4A5D23] tracking-widest `}
  >
    Builds
  </h1>

  {/* GIF */}
  <img
    src="/Enchanting_Table.gif"
    alt="decorative gif"
    className="h-32 w-auto object-contain"
  />

</div>
    

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 grid">
        {builds.map((item, i) => (
         <div
             key={item.id}
             ref={(el) => {
               cardsRef.current[i] = el;
             }}
             className="bg-white border border-black/10 rounded-none shadow-[4px_4px_0px_black] transition-transform duration-300 ease-out hover:-translate-y-2 hover:shadow-[6px_6px_0px_black] scale-[1.08]"
            >
            {/* MEDIA */}
           <div className="h-56 bg-black/5 border-b border-black/10">
              <img
                src={item.image}
                className="w-full h-full object-cover pixelated"
              />
              </div>

            {/* CONTENT */}
            <div className="p-4 bg-[#EAE9E0]">

              {/* TITLE */}
              <h3
                 className={`text-xl font-light ${pixelify.className} text-[#4A5D23] uppercase tracking-widest`}
               >
                 {item.title}
              </h3>

              {/* TECH */}
              <div className="flex flex-wrap gap-2 mt-2">
                {item.tech.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-1 border border-gray-400 text-gray-400 uppercase"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* DESCRIPTION */}
              <p className="text-sm mt-3 text-gray-400 leading-relaxed">
                 {item.description}
                </p>

              {/* BUTTONS */}
              <div className="flex gap-2 mt-4">

                <a
                  href={item.viewLink}
                  className="flex-1 text-center text-xs bg-[#4a5d23] uppercase border border-black py-2 hover:bg-black hover:text-white transition"
                >
                  View
                </a>

                <a
                  href={item.codeLink}
                  className="flex-1 text-center text-xs uppercase border border-black py-2 hover:bg-black hover:text-white transition"
                >
                  Code
                </a>

              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}