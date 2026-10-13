"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

import { Dotted } from "./Dotted";

const VIDEO_SRC = "/videos/vishwaroop-krishna.mp4";

export function KrishnaName() {
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const previewRef = useRef<HTMLVideoElement>(null);

  const handleEnter = () => {
    setHovered(true);
    const v = previewRef.current;
    if (!v) return;
    // try to play with sound; if the browser blocks unmuted autoplay,
    // fall back to a muted preview (audio unlocks after any click)
    v.muted = false;
    v.volume = 1;
    v.play().catch(() => {
      v.muted = true;
      v.play().catch(() => {});
    });
  };

  const handleLeave = () => {
    setHovered(false);
    const v = previewRef.current;
    if (v) v.muted = true;
  };

  // keep the preview silent/stopped while the big view is open so the
  // two audio tracks never play at once
  useEffect(() => {
    const v = previewRef.current;
    if (!v) return;
    if (open) {
      v.pause();
    } else {
      v.muted = true;
      v.play().catch(() => {});
    }
  }, [open]);

  // lock scroll + close on Escape while the big view is open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      {/* blurs the whole page while hovering the name */}
      <span
        aria-hidden
        className={`pointer-events-none fixed inset-0 z-40 bg-white/25 backdrop-blur-[3px] transition-opacity duration-300 ${
          hovered ? "opacity-100" : "opacity-0"
        }`}
      />

      <span
        role="button"
        tabIndex={0}
        aria-label="Play Vishwaroop Krishna"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className="relative z-50 inline-block cursor-pointer font-medium text-neutral-800"
      >
        <Dotted>Krishna</Dotted>

        {/* small preview card */}
        <span
          className={`absolute left-1/2 bottom-full z-50 -translate-x-1/2 pb-3 transition-all duration-300 ${
            hovered
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none translate-y-2 opacity-0"
          }`}
        >
          <span className="block w-[240px] overflow-hidden rounded-xl border-[3px] border-neutral-300 bg-gradient-to-b from-white to-neutral-100 p-[3px] shadow-[0_12px_40px_rgba(0,0,0,0.22)]">
            <video
              ref={previewRef}
              src={VIDEO_SRC}
              className="block aspect-video w-full rounded-lg object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          </span>
        </span>
      </span>

      {/* big screen view */}
      {open && (
        <span
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
          onClick={() => setOpen(false)}
        >
          <span
            className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-white/15 shadow-[0_25px_90px_rgba(0,0,0,0.65)]"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={VIDEO_SRC}
              className="block aspect-video w-full bg-black"
              autoPlay
              controls
              playsInline
            />
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/85"
            >
              <X size={18} />
            </button>
          </span>
        </span>
      )}
    </>
  );
}
