import { Rocket, GitCommitHorizontal, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { deployments, projects } from "@/features/dashboard/fixtures/data";

const statusColor: Record<string, string> = {
  success: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  failed: "text-destructive bg-destructive/10 border-destructive/30",
  building: "text-primary bg-primary/10 border-primary/30",
  deploying: "text-primary bg-primary/10 border-primary/30",
  queued: "text-muted-foreground bg-muted/40 border-border/60",
};

export function DeployPage() {
  const projectMap = Object.fromEntries(projects.map((p) => [p.id, p]));

  return (
    <div>
      <PageHeader
        title="Deployments"
        description="Build and release pipeline status across all environments."
        actions={
          <Button size="sm" className="glow gap-1.5">
            <Rocket className="h-3.5 w-3.5" /> New deployment
          </Button>
        }
      />

      <Card className="bg-card/60">
        <CardContent className="p-0">
          <ul>
            {deployments.map((d) => (
              <li key={d.id} className="flex items-center gap-4 border-b border-border/40 px-5 py-4 transition-colors last:border-0 hover:bg-muted/30">
                <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${statusColor[d.status]}`}>
                  {d.status}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{projectMap[d.projectId]?.name ?? d.repo}</p>
                  <p className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                    <GitCommitHorizontal className="h-3 w-3" />
                    <span>{d.branch} · {d.commit}</span>
                  </p>
                </div>
                <div className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
                  <Clock className="h-3 w-3" /> {d.duration ? `${d.duration}s` : "—"}
                </div>
                <Badge variant="outline" className="text-[10px] uppercase tracking-wider">{d.provider}</Badge>
                <span className="hidden text-[11px] text-muted-foreground md:inline">
                  {new Date(d.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}