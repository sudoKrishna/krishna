"use client";

import { Geist_Mono } from "next/font/google";
import { Mail, ArrowUpRight } from "lucide-react";

const mono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const socials = [
  {
    icon: "/git.png",
    href: "https://github.com/sudoKrishna",
    label: "GitHub",
  },
  {
    icon: "/x.png",
    href: "https://x.com/cha73066",
    label: "X",
  },
  {
    icon: "/link.png",
    href: "https://www.linkedin.com/in/krishna-chaudhary-1b287526b/",
    label: "LinkedIn",
  },
];

export default function Rest() {
  return (
    <section className="flex min-h-screen items-center justify-center px-6 py-20 bg-[#0a0e14]">
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        {/* TITLE */}
        <h1
          className={`${mono.className} text-6xl md:text-8xl font-bold leading-[0.95] tracking-tight text-[#e6edf3]`}
        >
          <span className="text-[#39d353]">$</span> let&apos;s{" "}
          <span className="text-[#39d353]">connect</span>
        </h1>

        {/* SUBTITLE */}
        <p
          className={`${mono.className} mt-6 max-w-2xl text-base md:text-lg text-[#8b949e]`}
        >
          {"// open to full-stack roles, collabs, and interesting problems"}
        </p>

        {/* EMAIL */}
        <a
          href="mailto:krishnachaudhary2007gt@gmail.com"
          className="mt-12 flex items-center gap-4 rounded-full border px-6 py-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-[#0d1117] border-[#262c36] hover:border-[#39d353]/50"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#238636] text-white">
            <Mail size={20} />
          </div>

          <div className="text-left">
            <p className={`${mono.className} text-xs text-[#8b949e]`}>
              Email
            </p>

            <p className={`${mono.className} text-[#e6edf3]`}>
              krishnachaudhary2007gt@gmail.com
            </p>
          </div>
        </a>

        {/* SOCIALS */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
          {socials.map((social, index) => (
            <a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-16 w-16 items-center justify-center rounded-full border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#39d353]/50 bg-[#0d1117] border-[#262c36] text-[#8b949e]"
              aria-label={social.label}
            >
              <img
                src={social.icon}
                alt={social.label}
                className="h-7 w-7 object-contain transition-all duration-300 invert"
              />
            </a>
          ))}
        </div>

        {/* RESUME BUTTON */}
        <a
          href="/resume"
          target="_blank"
          rel="noopener noreferrer"
          className="animate-glow-pulse mt-14 inline-flex items-center gap-3 rounded-full px-8 py-4 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl bg-[#238636] text-white hover:bg-[#2ea043]"
        >
          <span className={`${mono.className} text-lg`}>
            View Resume
          </span>

          <ArrowUpRight size={20} />
        </a>
      </div>
    </section>
  );
}