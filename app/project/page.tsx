import { ProjectStack } from "../components/ProjectStack";
import { PillNav } from "../components/PillNav";
import { PeaceOut } from "../components/PeaceOut";

export const metadata = {
  title: "Projects — Krishna Chaudhary",
  description: "Things Krishna is building.",
};

export default function ProjectPage() {
  return (
    <main className="relative flex min-h-screen flex-col bg-[#FAFAFA]">
      <div className="absolute top-8 left-1/2 -translate-x-1/2">
        <PillNav />
      </div>

      <div className="flex flex-1 items-center justify-center">
        <ProjectStack />
      </div>

      <PeaceOut />
    </main>
  );
}
