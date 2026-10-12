"use client";

import { useRef, useState } from "react";
import { Inter } from "next/font/google";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500"] });

function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      {/* Fill — white */}
      <path
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
        fill="#F5F5F5"
      />
    </svg>
  );
}

export function AtmCard() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const [shone, setShone] = useState(false);

  const rotateX = useSpring(useTransform(my, [0, 1], [7, -7]), {
    stiffness: 150,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-9, 9]), {
    stiffness: 150,
    damping: 18,
  });

  const sheenLeft = useTransform(mx, [0, 1], ["20%", "80%"]);
  const sheenTop = useTransform(my, [0, 1], ["20%", "80%"]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };

  const handleLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  // play the metallic shine once, on the first hover
  const handleEnter = () => setShone(true);

  // Engraved text style: dark shadow below + white highlight above
  // creates the illusion the text is pressed INTO the surface
  const engravedStyle: React.CSSProperties = {
    color: "transparent",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    backgroundImage: "linear-gradient(180deg, #a8a8a8 0%, #b8b8b8 100%)",
    textShadow:
      "0px 1px 1px rgba(255,255,255,0.75), 0px -1px 1px rgba(0,0,0,0.30)",
    filter: "none",
  };

  return (
    <div className="[perspective:1600px]">
      <motion.div
        ref={ref}
        onMouseEnter={handleEnter}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`${inter.className} relative grid aspect-[550/320] w-[460px] max-w-full grid-cols-[40%_60%] overflow-hidden rounded-[16px] bg-[linear-gradient(135deg,#e4e4e4_0%,#c6c6c6_20%,#f1f1f1_36%,#c2c2c2_52%,#dedede_70%,#bdbdbd_86%,#d4d4d4_100%)] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.65),inset_0_-1px_1px_rgba(0,0,0,0.08)] ring-1 ring-white/40`}
      >
        {/* soft glass sheen */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur-3xl"
          style={{ left: sheenLeft, top: sheenTop }}
        />
        {/* frosted inner edge */}
        <div className="pointer-events-none absolute inset-0 rounded-[16px] ring-1 ring-white/30 ring-inset" />

        {/* brushed-metal texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, rgba(255,255,255,0.6) 0 1px, rgba(0,0,0,0.08) 1px 2px)",
          }}
        />

        {/* metallic shine sweep — plays once on first hover */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-30 w-1/3 bg-gradient-to-r from-transparent via-white/55 to-transparent"
          initial={{ x: "-150%", skewX: -12, opacity: 0 }}
          animate={
            shone
              ? { x: "450%", skewX: -12, opacity: [0, 1, 0] }
              : { x: "-150%", skewX: -12, opacity: 0 }
          }
          transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* LEFT — info zone */}
        <div
          className="relative z-10 flex flex-col p-6"
          style={{ transform: "translateZ(30px)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/luffy.jpg"
            alt="krishna"
            className="mt-1 h-[76px] w-[76px] rounded-[10px] object-cover"
          />

          {/* Name — normal, sits ON top of card */}
          <p className="mt-4 text-[22px] leading-none font-medium text-[#1C1C1C]">
            krishna.
          </p>

          {/* Handle — engraved into card */}
          <p
            className="mt-1.5 text-[14px] font-normal tracking-wide"
            style={engravedStyle}
          >
            @cha73066
          </p>

          {/* Bio — engraved into card */}
          <p
            className="mt-auto mb-4 text-[15px] font-normal tracking-wide whitespace-nowrap"
            style={engravedStyle}
          >
            fullstack engineer.
          </p>
        </div>

        {/* RIGHT — X logo zone, engraved */}
        <div
          className="relative z-10 flex h-full items-end justify-end"
          style={{ transform: "translateZ(30px)" }}
        >
          <a
            href="https://x.com/cha73066"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X profile"
            className="flex h-full w-full items-end justify-end overflow-hidden"
          >
            <XLogo className="h-full w-auto translate-x-5 translate-y-7" />
          </a>
        </div>
      </motion.div>
    </div>
  );
}
