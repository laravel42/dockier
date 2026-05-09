import { createFileRoute } from "@tanstack/react-router";
import { OverviewPage } from "@/features/dashboard/pages/overview";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/app/")({
  head: () => pageHead({ title: "Overview — Dockier", description: "Workspace overview." }),
  component: OverviewPage,
});