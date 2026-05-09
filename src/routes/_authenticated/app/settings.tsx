import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/features/dashboard/pages/settings";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/app/settings")({
  head: () => pageHead({ title: "Settings — Dockier", description: "Workspace settings." }),
  component: SettingsPage,
});
