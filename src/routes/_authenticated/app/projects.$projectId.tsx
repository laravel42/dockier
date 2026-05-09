import { createFileRoute } from "@tanstack/react-router";
import { ProjectDetailPage } from "@/features/dashboard/pages/project-detail";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/app/projects/$projectId")({
  head: () => pageHead({ title: "Project — Dockier", description: "Project detail." }),
  component: ProjectDetailRoute,
});

function ProjectDetailRoute() {
  const { projectId } = Route.useParams();
  return <ProjectDetailPage projectId={projectId} />;
}