import { createFileRoute } from "@tanstack/react-router";
import { SecurityPage } from "@/features/dashboard/pages/security";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/app/security")({
  head: () => pageHead({ title: "Security — Dockier", description: "Security scans and findings." }),
  component: SecurityPage,
});