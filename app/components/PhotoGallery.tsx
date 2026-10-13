"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { playSound, SOUNDS } from "@/app/lib/sound";

const EASE = [0.16, 1, 0.3, 1] as const;
const CROSSFADE = 0.35;
const SWIPE_THRESHOLD = 50;
const SWIPE_LOCK = 400;

type GalleryProps = {
  images: string[];
  className?: string;
};

export function PhotoGallery({ images, className }: GalleryProps) {
  const [index, setIndex] = useState(0);

  const wheel = useRef(0);
  const locked = useRef(false);
  const touchStart = useRef<number | null>(null);

  const goTo = (next: number) => {
    playSound(SOUNDS.switch, 0.5);
    setIndex(((next % images.length) + images.length) % images.length);
  };

  const step = (dir: number) => {
    playSound(SOUNDS.switch, 0.5);
    setIndex((i) => ((i + dir) % images.length + images.length) % images.length);
  };

  const lock = () => {
    locked.current = true;
    window.setTimeout(() => {
      locked.current = false;
      wheel.current = 0;
    }, SWIPE_LOCK);
  };

  if (images.length === 0) return null;

  return (
    <div
      className={`relative aspect-[16/10] w-[380px] max-w-full touch-pan-y overflow-hidden rounded-[22px] border-4 border-black bg-black shadow-2xl ${className ?? ""}`}
      onWheel={(e) => {
        // two-finger / trackpad horizontal swipe
        if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
        if (locked.current) return;
        wheel.current += e.deltaX;
        if (Math.abs(wheel.current) > SWIPE_THRESHOLD) {
          step(wheel.current > 0 ? 1 : -1);
          lock();
        }
      }}
      onTouchStart={(e) => {
        touchStart.current =
          e.touches.length === 2 ? (e.touches[0].clientX + e.touches[1].clientX) / 2 : null;
      }}
      onTouchMove={(e) => {
        if (e.touches.length !== 2 || touchStart.current === null) return;
        const x = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const dx = x - touchStart.current;
        if (Math.abs(dx) > SWIPE_THRESHOLD) {
          step(dx < 0 ? 1 : -1);
          touchStart.current = x;
        }
      }}
      onTouchEnd={() => {
        touchStart.current = null;
      }}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: CROSSFADE, ease: EASE } }}
          transition={{ duration: CROSSFADE, ease: EASE }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[index]}
            alt=""
            className="pointer-events-none size-full object-cover"
            draggable={false}
          />
        </motion.div>
      </AnimatePresence>

      <div className="pointer-events-none absolute top-3 left-1/2 z-20 h-1.5 w-10 -translate-x-1/2 rounded-full bg-white/30" />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 bg-gradient-to-t from-black/50 to-transparent" />

      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/35 px-2.5 py-1.5 backdrop-blur-sm">
        {images.map((_, dot) => {
          const active = dot === index;
          return (
            <motion.button
              key={dot}
              type="button"
              aria-label={`Go to slide ${String(dot + 1)}`}
              onClick={(e) => {
                e.stopPropagation();
                goTo(dot);
              }}
              className="h-1.5 rounded-[3px] bg-white"
              animate={{
                width: active ? 12 : 5,
                opacity: active ? 1 : 0.4,
              }}
              transition={{ duration: 0.35, ease: EASE }}
            />
          );
        })}
      </div>
    </div>
  );
}
