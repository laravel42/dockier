import { createFileRoute } from "@tanstack/react-router";
import { DeployPage } from "@/features/dashboard/pages/deploy";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/app/deploy")({
  head: () => pageHead({ title: "Deployments — Dockier", description: "Build and release pipeline." }),
  component: DeployPage,
});