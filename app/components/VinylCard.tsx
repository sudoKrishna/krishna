"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import {
  IconArrowBackUp,
  IconArrowForwardUp,
} from "@tabler/icons-react";

import { playSound, SOUNDS } from "@/app/lib/sound";

const EASE = [0.16, 1, 0.3, 1] as const;
const DEGREES_PER_SECOND = 40; // vinyl speed — tune for realism

type Track = {
  title: string;
  artist: string;
  cover: string;
  src: string;
};

export function VinylCard({ tracks }: { tracks: Track[] }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const autoPlay = useRef(false);

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false); // vinyl slid out
  const [duration, setDuration] = useState(0);
  const [displayTime, setDisplayTime] = useState(0);

  const track = tracks[index] ?? tracks[0];

  // ─── rotation is derived from real playback time, not a loop ──────────────
  const currentTimeMV = useMotionValue(0);
  const rotate = useTransform(currentTimeMV, (t) => (t * DEGREES_PER_SECOND) % 360);

  // keep currentTimeMV in sync with the <audio> element every frame while playing
  useEffect(() => {
    if (!playing) return;
    let raf: number;
    const tick = () => {
      const el = audioRef.current;
      if (el) {
        currentTimeMV.set(el.currentTime);
        setDisplayTime(el.currentTime);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, currentTimeMV]);

  // reload + optionally resume when the track changes
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    setDuration(0);
    el.load();
    if (autoPlay.current) {
      autoPlay.current = false;
      void el
        .play()
        .then(() => {
          setPlaying(true);
          setExpanded(true);
        })
        .catch(() => {});
    }
  }, [index]);

  const toggle = () => {
    playSound(SOUNDS.click1, 0.6);
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
      setExpanded(false); // vinyl slides back into the sleeve
    } else {
      void el.play();
      setPlaying(true);
      setExpanded(true); // vinyl slides out — resumes from wherever it left off
    }
  };

  const changeTrack = (dir: 1 | -1) => {
    playSound(SOUNDS.click1, 0.6);
    const el = audioRef.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
    autoPlay.current = playing;
    setDisplayTime(0);
    setPlaying(false);
    setExpanded(false);
    currentTimeMV.set(0);
    setIndex((i) => (i + dir + tracks.length) % tracks.length);
  };

  const seek = (time: number) => {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = time;
    currentTimeMV.set(time); // vinyl angle snaps to match instantly
    setDisplayTime(time);
  };

  const percent = duration ? (displayTime / duration) * 100 : 0;

  return (
    <div className="group relative w-[240px] select-none">
      {/* vinyl record — pure black, behind the sleeve, slides out + spins */}
      <motion.div
        className="absolute top-1/2 left-1/2 z-0 size-[210px]"
        initial={false}
        animate={{ x: expanded ? "6%" : "-50%", y: "-50%" }}
        transition={{ duration: 0.55, ease: EASE }}
      >
        <motion.div
          className="relative size-full rounded-full"
          style={{
            rotate,
            background:
              "repeating-radial-gradient(circle at center, #000 0px, #000 2px, #0d0d0d 3px, #000 4px)",
            boxShadow: "0 12px 32px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.04)",
          }}
        >
          <div
            className="absolute top-1/2 left-1/2 flex size-[72px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center overflow-hidden rounded-full"
            style={{ backgroundImage: `url(${track.cover})`, backgroundSize: "cover" }}
          >
            <div className="absolute inset-0 bg-black/35" />
          </div>
          <div className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black ring-1 ring-white/20" />
        </motion.div>
      </motion.div>

      {/* sleeve / card — image fills the whole card; click to play/pause */}
      <motion.div
        role="button"
        tabIndex={0}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        }}
        aria-label={playing ? "Pause" : "Play"}
        className="relative z-10 block w-full cursor-pointer overflow-hidden rounded-2xl bg-[#111] shadow-xl outline-none"
        animate={{ x: expanded ? "-6%" : 0, rotate: expanded ? -1.5 : 0 }}
        transition={{ duration: 0.55, ease: EASE }}
      >
        <div
          className="aspect-square w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${track.cover})` }}
        />

        {/* ───── next / previous — right side ───── */}
        <div className="absolute top-1/2 right-2 z-20 flex -translate-y-1/2 flex-col gap-2">
          <button
            type="button"
            aria-label="Previous song"
            onClick={(e) => {
              e.stopPropagation();
              changeTrack(-1);
            }}
            className="flex size-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/75"
          >
            <IconArrowBackUp className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Next song"
            onClick={(e) => {
              e.stopPropagation();
              changeTrack(1);
            }}
            className="flex size-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/75"
          >
            <IconArrowForwardUp className="size-4" />
          </button>
        </div>

        {/* ───── timeline — on the card, pinned to the bottom end ───── */}
        <div
          className="absolute inset-x-0 bottom-0 h-9 cursor-pointer"
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => {
            e.stopPropagation();
            const bar = e.currentTarget;
            const move = (ev: PointerEvent) => {
              const rect = bar.getBoundingClientRect();
              const ratio = Math.min(1, Math.max(0, (ev.clientX - rect.left) / rect.width));
              seek(ratio * duration);
            };
            const up = () => {
              window.removeEventListener("pointermove", move);
              window.removeEventListener("pointerup", up);
            };
            move(e.nativeEvent);
            window.addEventListener("pointermove", move);
            window.addEventListener("pointerup", up);
          }}
        >
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-9 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="absolute inset-x-2.5 bottom-2 h-0.5 rounded-full bg-white/25" />
          <div
            className="absolute bottom-2 left-2.5 h-0.5 rounded-full bg-white"
            style={{ width: `calc((100% - 1.25rem) * ${String(percent / 100)})` }}
          />
          <div
            className="absolute bottom-2 size-2.5 -translate-x-1/2 translate-y-1/2 scale-0 rounded-full bg-white opacity-0 shadow transition-[transform,opacity] duration-300 ease-out group-hover:scale-100 group-hover:opacity-100"
            style={{ left: `calc(0.625rem + (100% - 1.25rem) * ${String(percent / 100)})` }}
          />
        </div>
      </motion.div>

      <audio
        ref={audioRef}
        src={track.src}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => {
          setPlaying(false);
          setExpanded(false);
        }}
      />
    </div>
  );
}
