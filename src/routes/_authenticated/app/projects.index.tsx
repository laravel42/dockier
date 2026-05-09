import { createFileRoute } from "@tanstack/react-router";
import { ProjectsPage } from "@/features/dashboard/pages/projects";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/app/projects/")({
  head: () => pageHead({ title: "Projects — Dockier", description: "All connected repositories." }),
  component: ProjectsPage,
});