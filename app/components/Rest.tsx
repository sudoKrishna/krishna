"use client";

import { Jersey_10, Edu_NSW_ACT_Cursive } from "next/font/google";
import { Mail, ArrowUpRight } from "lucide-react";
import { useCodeMode } from "../context/CodeModeContext";

const jersey = Jersey_10({
  subsets: ["latin"],
  weight: "400",
});

const cursiveFont = Edu_NSW_ACT_Cursive({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const socials = [
  {
    icon: "/git.png",
    href: "https://github.com/yourusername",
    label: "GitHub",
  },
  {
    icon: "/x.png",
    href: "https://x.com/yourusername",
    label: "X",
  },
  {
    icon: "/link.png",
    href: "https://linkedin.com/in/yourusername",
    label: "LinkedIn",
  },
];

const toBinary = (text: string) =>
  text
    .split("")
    .map((c) => c.charCodeAt(0).toString(2))
    .join(" ");

export default function Rest() {
  const { codeMode } = useCodeMode();

  return (
    <section
      className={`flex min-h-screen items-center justify-center px-6 py-20 transition-all duration-700 ${
        codeMode ? "bg-black text-green-400" : "bg-[#F5F3EB]"
      }`}
    >
      {/* ⚡ HACK OVERLAY */}
      {codeMode && (
        <div className="pointer-events-none fixed inset-0 z-50 opacity-10 text-green-400 text-[10px] whitespace-pre-wrap">
          {Array.from({ length: 80 })
            .map(() => Math.random().toString(2).slice(2, 120))
            .join("\n")}
        </div>
      )}

      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        {/* TITLE */}
        <h1
          className={`${jersey.className} text-[80px] md:text-[120px] leading-[0.9] tracking-wide ${
            codeMode ? "text-green-400" : "text-black"
          }`}
        >
          {codeMode
            ? toBinary("Rest at the Camp")
            : (
              <>
                <span className="text-[#4A5D23]">Rest at</span> the Camp
              </>
            )}
        </h1>

        {/* SUBTITLE */}
        <p
          className={`${cursiveFont.className} mt-6 max-w-2xl text-lg md:text-xl ${
            codeMode ? "text-green-300" : "text-[#6C7B4B]"
          }`}
        >
          {codeMode
            ? toBinary(
                "Reach out — our campfire stories need new characters."
              )
            : "Reach out — our campfire stories need new characters."}
        </p>

        {/* EMAIL */}
        <a
          href="mailto:hello@example.com"
          className={`mt-12 flex items-center gap-4 rounded-full border px-6 py-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
            codeMode
              ? "bg-black border-green-500 text-green-400"
              : "bg-white/80 border-black/10 text-black"
          }`}
        >
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full ${
              codeMode ? "bg-green-500 text-black" : "bg-[#4A5D23] text-[#F5F3EB]"
            }`}
          >
            <Mail size={20} />
          </div>

          <div className="text-left">
            <p
              className={`${cursiveFont.className} text-sm ${
                codeMode ? "text-green-300" : "text-[#6C7B4B]"
              }`}
            >
              Email
            </p>

            <p className={codeMode ? "text-green-400" : "text-black"}>
              {codeMode ? toBinary("hello@example.com") : "hello@example.com"}
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
              className={`flex h-16 w-16 items-center justify-center rounded-full border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                codeMode
                  ? "bg-black border-green-500 text-green-400"
                  : "bg-white/80 border-black/10 text-[#4A5D23]"
              }`}
              aria-label={social.label}
            >
              <img
                src={social.icon}
                alt={social.label}
                className="h-7 w-7 object-contain transition-all duration-300 hover:invert"
              />
            </a>
          ))}
        </div>

        {/* RESUME BUTTON */}
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-14 inline-flex items-center gap-3 rounded-full px-8 py-4 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
            codeMode
              ? "bg-green-500 text-black"
              : "bg-[#4A5D23] text-[#F5F3EB]"
          }`}
        >
          <span className={`${cursiveFont.className} text-lg`}>
            {codeMode ? toBinary("View Resume") : "View Resume"}
          </span>

          <ArrowUpRight size={20} />
        </a>
      </div>
    </section>
  );
}