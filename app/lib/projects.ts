export type ProjectSlug = "goltui" | "shy" | "golt";

export type Project = {
  slug: ProjectSlug;
  title: string;
  domain: string;
  href: string;
  accessory: "pin" | "clip" | "none";
  rotate: number;
  translateX: number;
  translateY: number;
  zIndex: number;
  floatDelay: number;
  tags: string[];
  description: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "goltui",
    title: "goltUI",
    domain: "golt-ui.vercel.app",
    href: "https://golt-ui.vercel.app/",
    accessory: "none",
    rotate: -6,
    translateX: -185,
    translateY: 9,
    zIndex: 10,
    floatDelay: 0.6,
    tags: ["2026", "Component library", "Framer Motion", "shadcn-style"],
    description:
      "goltUI is a copy-paste React and Tailwind component library. Rather than installing a dependency, the CLI writes each component's real source straight into your project — components/goltui/ — so you own and can edit the code. 25+ components, built on Next.js 16, React 19, and Framer Motion: buttons, inputs, hero sections, logo clouds, auth layouts, cursor effects. Add one with npx goltui add <component>.",
  },
  {
    slug: "shy",
    title: "shy",
    domain: "shy-lake.vercel.app",
    href: "https://shy-lake.vercel.app/",
    accessory: "clip",
    rotate: 0,
    translateX: 0,
    translateY: -9,
    zIndex: 30,
    floatDelay: 0,
    tags: ["2026", "Coding agent", "Bun + TypeScript", "SWE-bench"],
    description:
      "shy is an open-source AI coding agent framework, built to show how a coding agent actually works rather than wrap one. It turns a task into orchestrated tool calls — bash, file ops, grep, web fetch — run in parallel, retried, and verified before it calls itself done. Deterministic where it can be, adaptive where it has to be: 12 of 18 SWE-bench Lite tasks resolved, no vendor lock-in.",
  },
  {
    slug: "golt",
    title: "golt",
    domain: "golt-web-tau.vercel.app",
    href: "https://golt-web-tau.vercel.app/",
    accessory: "none",
    rotate: 5,
    translateX: 185,
    translateY: 9,
    zIndex: 20,
    floatDelay: 0.3,
    tags: ["2026", "AI app-builder", "Sandbox", "Self-hosted"],
    description:
      "golt is a self-hosted alternative to Bolt: an AI app-builder you chat with. It plans the project, writes real code, and deploys it into a live Vite + React sandbox you watch run over WebSockets — on Gemini or OpenAI, with everything persisted to Postgres so it survives a refresh. A reaper kills idle sandboxes after 15 minutes of no heartbeat.",
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
