import { useMemo, useState } from "react";
import { Rocket, GitCommitHorizontal, Clock, ExternalLink, Trash2, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { useDeployments, useProjects, useDestroyDeployment } from "@/lib/queries";
import { getRepoSlug, timeAgo } from "@/lib/repo";
import { toast } from "sonner";
import { DeployWizard } from "@/features/dashboard/components/deploy-wizard";

const statusColor: Record<string, string> = {
  success: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  failed: "text-destructive bg-destructive/10 border-destructive/30",
  building: "text-primary bg-primary/10 border-primary/30",
  deploying: "text-primary bg-primary/10 border-primary/30",
  pending: "text-muted-foreground bg-muted/40 border-border/60",
  destroyed: "text-muted-foreground bg-muted/40 border-border/60",
};

export function DeployPage() {
  const { data: deployments = [], isLoading } = useDeployments();
  const { data: projects = [] } = useProjects();
  const destroy = useDestroyDeployment();
  const [destroying, setDestroying] = useState<string | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);

  const projectMap = useMemo(() => Object.fromEntries(projects.map((p) => [p.id, p])), [projects]);

  const onDestroy = async (id: string) => {
    if (!confirm("Destroy this deployment? Resources will be torn down.")) return;
    setDestroying(id);
    try {
      await destroy.mutateAsync(id);
      toast.success("Destroy queued");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Destroy failed");
    } finally {
      setDestroying(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Deployments"
        description="Build and release pipeline status across all environments."
        actions={
          <Button size="sm" className="glow gap-1.5" onClick={() => setWizardOpen(true)}>
            <Rocket className="h-3.5 w-3.5" /> New deployment
          </Button>
        }
      />

      <DeployWizard open={wizardOpen} onOpenChange={setWizardOpen} />

      <Card className="bg-card/60">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center px-5 py-12 text-xs text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading deployments…
            </div>
          ) : deployments.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <Rocket className="mx-auto h-6 w-6 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">No deployments yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Create one from a project's deploy wizard.
              </p>
            </div>
          ) : (
            <ul>
              {deployments.map((d) => {
                const tone = statusColor[d.status] ?? statusColor.pending;
                return (
                  <li
                    key={d.id}
                    className="flex items-center gap-4 border-b border-border/40 px-5 py-4 transition-colors last:border-0 hover:bg-muted/30"
                  >
                    <span
                      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${tone}`}
                    >
                      {d.status}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {projectMap[d.projectId]?.name ?? getRepoSlug(d.repo)}
                      </p>
                      <p className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                        <GitCommitHorizontal className="h-3 w-3" />
                        <span>
                          {d.branch}
                          {d.commitHash ? ` · ${d.commitHash.slice(0, 7)}` : ""}
                        </span>
                      </p>
                    </div>
                    {d.deployStrategy && (
                      <Badge
                        variant="outline"
                        className="hidden text-[10px] uppercase tracking-wider sm:inline-flex"
                      >
                        {d.deployStrategy}
                      </Badge>
                    )}
                    <span className="hidden text-[11px] text-muted-foreground md:inline">
                      <Clock className="mr-1 inline h-3 w-3" />
                      {timeAgo(d.createdAt)}
                    </span>
                    {d.appUrl && (
                      <a
                        href={d.appUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="hidden text-muted-foreground hover:text-foreground md:inline"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {d.status !== "destroyed" && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => onDestroy(d.id)}
                        disabled={destroying === d.id}
                        aria-label="Destroy deployment"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
