import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/features/dashboard/layout/app-shell";

export const Route = createFileRoute("/_authenticated/app")({
  component: AppShell,
});