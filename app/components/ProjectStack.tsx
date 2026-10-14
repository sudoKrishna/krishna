"use client";

import { useEffect, useState } from "react";

import { ProjectStackCard } from "./ProjectStackCard";
import { ShyDotLogo } from "./graphics/ShyDotLogo";
import { GoltHalftoneBolt } from "./graphics/GoltHalftoneBolt";
import { GoltUIHalftoneStack } from "./graphics/GoltUIHalftoneStack";
import { PROJECTS } from "../lib/projects";

const GRAPHICS = {
  goltui: <GoltUIHalftoneStack className="absolute inset-0 h-full w-full" />,
  shy: <ShyDotLogo className="absolute top-2 right-2 h-[150px] w-[150px]" />,
  golt: <GoltHalftoneBolt className="absolute inset-0 h-full w-full" />,
};

const KEY = "project-active";

// the cards are absolutely positioned up to ±185px from center (plus
// their own half-width/rotation), so the stack's real footprint is wider
// than any max-w container around it — these are that true bounding box.
const BASE_WIDTH = 760;
const BASE_HEIGHT = 380;
const SIDE_MARGIN = 24;

export function ProjectStack() {
  const [active, setActive] = useState<string | null>(null);
  const [scale, setScale] = useState(1);

  // restore which card was "brought to the top" when coming back to this page
  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem(KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restore on mount
      if (saved) setActive(saved);
    } catch {
      /* ignore */
    }
  }, []);

  // shrink the whole stack to fit narrower viewports so the side cards
  // never get clipped or pushed off-screen
  useEffect(() => {
    const update = () => {
      const available = window.innerWidth - SIDE_MARGIN * 2;
      setScale(Math.min(1, available / BASE_WIDTH));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const select = (slug: string) => {
    setActive(slug);
    try {
      window.sessionStorage.setItem(KEY, slug);
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      className="mx-auto"
      style={{ width: BASE_WIDTH * scale, height: BASE_HEIGHT * scale }}
    >
      <div
        className="relative h-[380px] w-[760px]"
        style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
      >
        {PROJECTS.map((project) => (
          <ProjectStackCard
            key={project.slug}
            project={project}
            href={`/project/${project.slug}`}
            active={active === project.slug}
            dimmed={active !== null && active !== project.slug}
            onSelect={() => select(project.slug)}
          >
            {GRAPHICS[project.slug]}
          </ProjectStackCard>
        ))}
      </div>
    </div>
  );
}
