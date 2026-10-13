import { notFound } from "next/navigation";

import { PROJECTS, getProject } from "../../lib/projects";
import { ProjectDetail } from "../../components/ProjectDetail";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <ProjectDetail project={project} />
    </main>
  );
}
