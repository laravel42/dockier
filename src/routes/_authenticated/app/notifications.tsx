import { createFileRoute } from "@tanstack/react-router";
import { NotificationsPage } from "@/features/dashboard/pages/notifications";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/app/notifications")({
  head: () => pageHead({ title: "Notifications — Dockier", description: "Workspace notifications." }),
  component: NotificationsPage,
});
