"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

import { GitHubAtmCard } from "./GitHubAtmCard";
import { LinkedInAtmCard } from "./LinkedInAtmCard";

export function MoreLinks() {
  const [open, setOpen] = useState<null | "github" | "linkedin">(null);

  return (
    <span className="relative inline-block" onMouseLeave={() => setOpen(null)}>
      You can see more of my work on{" "}
      <a
        href="https://github.com/sudoKrishna"
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setOpen("github")}
        className="text-[var(--accent-cyan)] hover:text-[var(--accent)] hover:underline"
      >
        GitHub
      </a>{" "}
      and{" "}
      <a
        href="https://www.linkedin.com/in/krishna-chaudhary-1b287526b/"
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setOpen("linkedin")}
        className="text-[var(--accent-cyan)] hover:text-[var(--accent)] hover:underline"
      >
        LinkedIn
      </a>
      , or view my{" "}
      <Link
        href="/resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[var(--accent-cyan)] hover:text-[var(--accent)] hover:underline"
      >
        Resume
      </Link>
      .

      <AnimatePresence>
        {open && (
          // pb-4 bridges the gap up to the card, and being a descendant of the
          // hover wrapper keeps it open (and interactive) while you move onto it
          <motion.span
            className="absolute bottom-full left-1/2 z-50 block pb-4"
            initial={{ opacity: 0, x: "-50%", y: 14, scale: 0.94, filter: "blur(6px)" }}
            animate={{ opacity: 1, x: "-50%", y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: "-50%", y: 10, scale: 0.96, filter: "blur(4px)" }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            <span className="block" style={{ zoom: 0.5 }}>
              {open === "github" ? <GitHubAtmCard /> : <LinkedInAtmCard />}
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
