"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { playSound, SOUNDS } from "@/app/lib/sound";

/* ---------- icons ---------- */
const XLogo = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-5 w-5 sm:h-[22px] sm:w-[22px]",
};

const CommentIcon = () => (
  <svg {...iconProps}>
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
  </svg>
);

const RepostIcon = () => (
  <svg {...iconProps}>
    <path d="m17 2 4 4-4 4" />
    <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
    <path d="m7 22-4-4 4-4" />
    <path d="M21 13v1a4 4 0 0 1-4 4H3" />
  </svg>
);

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg {...iconProps} fill={filled ? "currentColor" : "none"}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

/* ---------- rolling counter (slides like x.com) ---------- */
function Count({ value, up }: { value: number; up: boolean }) {
  const label = new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  })
    .format(value)
    .toLowerCase();

  return (
    <span className="relative inline-flex h-[1.4em] items-center overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false} custom={up}>
        <motion.span
          key={value}
          custom={up}
          variants={{
            enter: (u: boolean) => ({ y: u ? 14 : -14, opacity: 0 }),
            center: { y: 0, opacity: 1 },
            exit: (u: boolean) => ({ y: u ? -14 : 14, opacity: 0 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 500, damping: 34 }}
          className="inline-block"
        >
          {label}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ---------- like burst particles ---------- */
const burstColors = [
  "#f91880",
  "#ff7a59",
  "#ffd400",
  "#a855f7",
  "#f91880",
  "#ff7a59",
  "#ffd400",
  "#a855f7",
];

function LikeBurst() {
  return (
    <>
      <motion.span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#f91880]"
        initial={{ scale: 0.2, opacity: 0.8 }}
        animate={{ scale: 1.6, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      {burstColors.map((color, i) => {
        const angle = (i / burstColors.length) * Math.PI * 2;
        return (
          <motion.span
            key={i}
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -mt-[3px] -ml-[3px] h-[6px] w-[6px] rounded-full"
            style={{ background: color }}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{
              x: Math.cos(angle) * 22,
              y: Math.sin(angle) * 22,
              scale: [0, 1, 0],
              opacity: [1, 1, 0],
            }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          />
        );
      })}
    </>
  );
}

/* ---------- card ---------- */
export default function TwitterCard() {
  const [hovered, setHovered] = useState(false);
  const [posted, setPosted] = useState("");

  // Today's date + time, X-style (set on the client to avoid a hydration mismatch).
  useEffect(() => {
    const id = window.setTimeout(() => {
      const now = new Date();
      const time = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      const date = now.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      setPosted(`${time} · ${date}`);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  const [liked, setLiked] = useState(false);
  const likes = 1243;

  const [reposted, setReposted] = useState(false);
  const [reposts, setReposts] = useState(132);
  const [spin, setSpin] = useState(0);

  const toggleLike = () => {
    setLiked((v) => !v);
  };

  const toggleRepost = () => {
    setReposted((v) => !v);
    setReposts((n) => (reposted ? n - 1 : n + 1));
    setSpin((s) => s + 360);
  };

  // X logo center as % of the card (so it scales with width)
  const origin = "84% 16%";
  const strong = hovered ? "text-[#1a1a1a]" : "text-white";

  return (
    <div
      className="relative w-[496px] max-w-full overflow-hidden rounded-[32px] bg-[#1a1a1a]"
    >
      {/* light fill that grows out of the X logo */}
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-[#f4f4f4]"
        initial={false}
        animate={{
          clipPath: hovered ? `circle(150% at ${origin})` : `circle(0% at ${origin})`,
        }}
        transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
      />

      <div className="relative z-10 p-6 sm:p-[45px]">
        {/* header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <img
              src="/avatar.png"
              alt="Krishna"
              className="h-14 w-14 rounded-full bg-white object-cover sm:h-[70px] sm:w-[70px]"
            />
            <div>
              <div
                className={`flex items-center gap-2 text-xl font-medium transition-colors duration-500 sm:text-[26px] ${strong}`}
              >
                Krishna
              </div>
              <div className="text-sm text-[#8a8a8a] sm:text-[21px]">@cha73066</div>
            </div>
          </div>

          {/* X logo -> black tile on hover */}
          <motion.a
            href="https://x.com/cha73066"
            target="_blank"
            rel="noreferrer"
            aria-label="Open on X"
            className="flex h-14 w-14 items-center justify-center rounded-2xl text-white sm:h-[70px] sm:w-[70px]"
            animate={{
              backgroundColor: hovered ? "#000000" : "rgba(0,0,0,0)",
              boxShadow: hovered ? "0 6px 16px rgba(0,0,0,.3)" : "0 0 0 rgba(0,0,0,0)",
              scale: hovered ? 1 : 0.9,
            }}
            transition={{ duration: 0.45 }}
          >
            <XLogo className="h-7 w-7 sm:h-9 sm:w-9" />
          </motion.a>
        </div>

        {/* tweet */}
        <p
          className={`mt-8 text-lg leading-7 transition-colors duration-500 sm:mt-10 sm:text-[24px] sm:leading-9 ${strong}`}
        >
          accidently stepped into design.
        </p>

        <div className="mt-6 text-sm text-[#8a8a8a] sm:text-[20px]">{posted}</div>

        {/* stats / actions */}
        <div className="mt-6 flex items-center gap-6 text-sm text-[#8a8a8a] sm:gap-8 sm:text-[20px]">
          {/* comment */}
          <button
            type="button"
            className="flex cursor-pointer items-center gap-2 transition-colors hover:text-[#1d9bf0]"
            aria-label="Reply"
          >
            <CommentIcon />
            <span>48</span>
          </button>

          {/* repost */}
          <button
            type="button"
            onClick={toggleRepost}
            aria-pressed={reposted}
            aria-label="Repost"
            className="flex cursor-pointer items-center gap-2 transition-colors hover:text-[#00ba7c]"
            style={{ color: reposted ? "#00ba7c" : undefined }}
          >
            <motion.span
              className="inline-flex"
              animate={{
                rotate: spin,
                scale: reposted ? [1, 1.25, 1] : [1, 0.9, 1],
              }}
              transition={{
                rotate: { type: "spring", stiffness: 160, damping: 14 },
                scale: { duration: 0.4 },
              }}
              whileTap={{ scale: 0.8 }}
            >
              <RepostIcon />
            </motion.span>
            <Count value={reposts} up={reposted} />
          </button>

          {/* like */}
          <button
            type="button"
            onClick={toggleLike}
            aria-pressed={liked}
            aria-label="Like"
            className="flex cursor-pointer items-center gap-2 transition-colors hover:text-[#f91880]"
            style={{ color: liked ? "#f91880" : undefined }}
          >
            <span className="relative inline-flex">
              <motion.span
                className="inline-flex"
                animate={liked ? { scale: [0.6, 1.35, 1] } : { scale: 1 }}
                transition={
                  liked
                    ? { duration: 0.45, times: [0, 0.55, 1], ease: "easeOut" }
                    : { duration: 0.15 }
                }
                whileTap={{ scale: 0.75 }}
              >
                <HeartIcon filled={liked} />
              </motion.span>
              {liked && <LikeBurst />}
            </span>
            <Count value={likes} up={liked} />
          </button>
        </div>

        {/* button */}
        <a
          href="https://x.com/cha73066"
          target="_blank"
          rel="noreferrer"
          onMouseEnter={() => {
            playSound(SOUNDS.pop, 0.5);
            setHovered(true);
          }}
          onMouseLeave={() => setHovered(false)}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
          className={`mt-8 flex h-14 items-center justify-center gap-3 rounded-full border-2 text-lg transition-colors duration-500 sm:mt-10 sm:h-[70px] sm:text-[24px] ${
            hovered ? "border-[#cfcfcf] text-[#1a1a1a]" : "border-[#333] text-white"
          }`}
        >
          Go read stuff <span aria-hidden>↗</span>
        </a>
      </div>
    </div>
  );
}
