"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { AtmCard } from "./AtmCard";
import { EmailCard } from "./EmailCard";

export function ContactChip() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <span
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="relative inline-block"
      >
        <span className="inline-flex items-center rounded-md bg-neutral-100 px-2.5 py-0.5 text-[15px] text-neutral-600">
          @cha73066
        </span>

        <AnimatePresence>
          {open && (
            // pb-4 bridges the gap to the chip so moving up into the cards
            // keeps them open (they're descendants of the hover wrapper)
            <span className="absolute bottom-full left-1/2 z-[80] -translate-x-1/2 pb-4">
              <motion.span
                className="flex origin-bottom gap-4"
                initial={{ opacity: 0, y: 18, scale: 0.44 }}
                animate={{ opacity: 1, y: 0, scale: 0.54 }}
                exit={{ opacity: 0, y: 12, scale: 0.44 }}
                transition={{ type: "spring", stiffness: 240, damping: 24 }}
              >
                <AtmCard />
                <EmailCard />
              </motion.span>
            </span>
          )}
        </AnimatePresence>
      </span>

      {/* blurred backdrop behind the popup */}
      <AnimatePresence>
        {open && (
          <motion.span
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[70] bg-white/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
