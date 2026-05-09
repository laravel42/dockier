import { createFileRoute } from "@tanstack/react-router";
import { ScanDetailPage } from "@/features/dashboard/pages/scan-detail";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/app/security/$scanId")({
  head: ({ params }) => pageHead({ title: `Scan ${params.scanId} — Dockier`, description: "Security scan findings." }),
  component: RouteComponent,
});

function RouteComponent() {
  const { scanId } = Route.useParams();
  return <ScanDetailPage scanId={scanId} />;
}
