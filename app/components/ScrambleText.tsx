"use client";

import { useEffect, useState } from "react";

const CHARS = "#@$%&*!?/\\|<>{}[]()~^+=—";

export function ScrambleText({
  text,
  active,
  className,
}: {
  text: string;
  active: boolean;
  className?: string;
}) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!active) return;
    let iteration = 0;
    const id = window.setInterval(() => {
      iteration += 1;
      setDisplay(
        text
          .split("")
          .map((ch, i) => {
            if (ch === " ") return " ";
            return i < iteration ? ch : CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join(""),
      );
      if (iteration >= text.length) window.clearInterval(id);
    }, 32);
    return () => window.clearInterval(id);
  }, [active, text]);

  return <span className={className}>{active ? display : text}</span>;
}
