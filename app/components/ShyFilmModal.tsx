"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;
const PAD = 12;
const ASPECT = 878 / 1920;

export type Rect = { top: number; left: number; width: number; height: number };

function getModalRect(): Rect {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let frameWidth = Math.min(vw * 0.92, 900);
  let videoWidth = frameWidth - PAD * 2;
  let videoHeight = videoWidth * ASPECT;
  let frameHeight = videoHeight + PAD * 2;

  // on short/landscape viewports, constrain by height instead so the
  // frame never spills off-screen top-to-bottom
  const maxHeight = vh * 0.88;
  if (frameHeight > maxHeight) {
    frameHeight = maxHeight;
    videoHeight = frameHeight - PAD * 2;
    videoWidth = videoHeight / ASPECT;
    frameWidth = videoWidth + PAD * 2;
  }

  return {
    width: frameWidth,
    height: frameHeight,
    top: (vh - frameHeight) / 2,
    left: (vw - frameWidth) / 2,
  };
}

export function ShyFilmModal({
  open,
  originRect,
  onClose,
}: {
  open: boolean;
  originRect: Rect | null;
  onClose: () => void;
}) {
  const [modalRect, setModalRect] = useState<Rect | null>(null);

  useEffect(() => {
    if (!open) return;
    const update = () => setModalRect(getModalRect());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [open]);

  return (
    <AnimatePresence>
      {open && originRect && modalRect && (
        <motion.div
          className="fixed inset-0 z-[200] bg-black/55 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ ...originRect, borderRadius: 12 }}
            animate={{ ...modalRect, borderRadius: 0 }}
            exit={{ ...originRect, borderRadius: 12 }}
            transition={{ duration: 0.55, ease: EASE }}
            style={{ position: "fixed" }}
            className="overflow-hidden border border-black/[0.1] bg-[#F5F0E6] p-3"
          >
            <video
              src="/shy-film.mp4"
              className="block h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              disablePictureInPicture
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
