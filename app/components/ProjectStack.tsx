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

export function ProjectStack() {
  const [active, setActive] = useState<string | null>(null);

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

  const select = (slug: string) => {
    setActive(slug);
    try {
      window.sessionStorage.setItem(KEY, slug);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="relative mx-auto h-[380px] w-full max-w-[560px]">
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
  );
}
