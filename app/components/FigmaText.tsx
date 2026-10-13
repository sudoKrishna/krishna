"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bold, Check, ChevronDown, Italic } from "lucide-react";
import { Inter, Lora } from "next/font/google";

import { playSound, SOUNDS } from "../lib/sound";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--f-inter",
});

const lora = Lora({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "700"],
  variable: "--f-lora",
});

const FONTS = [
  { name: "Inter", value: "var(--f-inter)" },
  { name: "Lora", value: "var(--f-lora)" },
  { name: "Georgia", value: "Georgia, 'Times New Roman', serif" },
  { name: "Mono", value: "ui-monospace, SFMono-Regular, Menlo, monospace" },
] as const;

const HANDLE_POS = [
  "-top-[7px] -left-[7px]",
  "-top-[7px] -right-[7px]",
  "-bottom-[7px] -left-[7px]",
  "-bottom-[7px] -right-[7px]",
];

export function FigmaText() {
  const [font, setFont] = useState<(typeof FONTS)[number]>(FONTS[1]);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(true);
  const [active, setActive] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  const show = active || menuOpen;

  // close the dropdown on outside click / Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <span
      ref={ref}
      className={`${inter.variable} ${lora.variable} relative inline-block`}
      onMouseEnter={() => {
        setActive(true);
        playSound(SOUNDS.hover, 0.45);
      }}
      onMouseLeave={() => setActive(false)}
    >
      {/* selection outline */}
      <span
        aria-hidden
        className={`pointer-events-none absolute -inset-[3px] rounded-[2px] border transition-colors duration-150 ${
          show ? "border-[#0d99ff]" : "border-transparent"
        }`}
      />

      {/* the 4 corner boxes */}
      {HANDLE_POS.map((pos) => (
        <span
          key={pos}
          aria-hidden
          className={`pointer-events-none absolute h-[9px] w-[9px] rounded-[1px] border border-[#0d99ff] bg-white transition-opacity duration-150 ${
            show ? "opacity-100" : "opacity-0"
          } ${pos}`}
        />
      ))}

      {/* editable text */}
      <span
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        className="relative cursor-text text-neutral-800 outline-none"
        style={{
          fontFamily: font.value,
          fontWeight: bold ? 700 : 400,
          fontStyle: italic ? "italic" : "normal",
        }}
      >
        full-stack engineer
      </span>

      {/* floating toolbar (white tab below) */}
      <AnimatePresence>
        {show && (
          <motion.span
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
            className="absolute top-full left-0 z-30 mt-3 flex items-center gap-0.5 rounded-lg border border-neutral-200 bg-white p-1 shadow-[0_10px_34px_rgba(0,0,0,0.16)]"
            onMouseEnter={() => setActive(true)}
            onMouseLeave={() => setActive(false)}
          >
            {/* font dropdown */}
            <span className="relative">
              <button
                type="button"
                onClick={() => {
                  playSound(SOUNDS.pop, 0.5);
                  setMenuOpen((o) => !o);
                }}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-[13px] text-neutral-700 transition-colors hover:bg-neutral-100"
              >
                {font.name}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.span
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.16, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute bottom-full left-0 mb-2 block w-44 origin-bottom overflow-hidden rounded-xl border border-neutral-200 bg-white p-1 shadow-[0_12px_40px_rgba(0,0,0,0.18)]"
                  >
                    {FONTS.map((f, i) => (
                      <motion.button
                        key={f.name}
                        type="button"
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.03 + i * 0.035, duration: 0.16 }}
                        onClick={() => {
                          playSound(SOUNDS.pop, 0.5);
                          setFont(f);
                          setMenuOpen(false);
                        }}
                        style={{ fontFamily: f.value }}
                        className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-[13px] text-neutral-700 transition-colors hover:bg-neutral-100"
                      >
                        {f.name}
                        {font.name === f.name && <Check size={14} className="text-[#0d99ff]" />}
                      </motion.button>
                    ))}
                  </motion.span>
                )}
              </AnimatePresence>
            </span>

            <span className="mx-0.5 h-4 w-px bg-neutral-200" />

            {/* bold */}
            <button
              type="button"
              onClick={() => {
                playSound(SOUNDS.pop, 0.5);
                setBold((b) => !b);
              }}
              aria-pressed={bold}
              aria-label="Bold"
              className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
                bold ? "bg-[#0d99ff]/10 text-[#0d99ff]" : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              <Bold size={14} />
            </button>

            {/* italic */}
            <button
              type="button"
              onClick={() => {
                playSound(SOUNDS.pop, 0.5);
                setItalic((v) => !v);
              }}
              aria-pressed={italic}
              aria-label="Italic"
              className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
                italic ? "bg-[#0d99ff]/10 text-[#0d99ff]" : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              <Italic size={14} />
            </button>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
