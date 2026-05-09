import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { ShieldCheck, RefreshCw, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { SeverityBadge, CleanBadge } from "@/features/dashboard/components/severity-badge";
import { useProjects, useScans } from "@/lib/queries";
import { summaryToCounts } from "@/features/dashboard/lib/types";
import { getRepoSlug, timeAgo } from "@/lib/repo";

export function SecurityPage() {
  const { data: projects = [] } = useProjects();
  const { data: scans = [], isLoading } = useScans();

  const projectMap = useMemo(() => Object.fromEntries(projects.map((p) => [p.id, p])), [projects]);

  const totals = useMemo(() => {
    const acc = { critical: 0, high: 0, medium: 0, low: 0 };
    for (const s of scans) {
      const c = summaryToCounts(s.summary ?? {});
      acc.critical += c.critical;
      acc.high += c.high;
      acc.medium += c.medium;
      acc.low += c.low;
    }
    return acc;
  }, [scans]);

  return (
    <div>
      <PageHeader
        title="Security scans"
        description="Static analysis findings across all connected repositories."
        actions={
          <Button size="sm" variant="outline" className="gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" /> Re-run all
          </Button>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(["critical", "high", "medium", "low"] as const).map((sev) => (
          <Card key={sev} className="bg-card/60">
            <CardContent className="p-4">
              <SeverityBadge severity={sev} />
              <p className="mt-3 font-display text-2xl font-semibold">{totals[sev]}</p>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Open findings
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card/60">
        <CardContent className="p-0">
          <div className="grid grid-cols-12 gap-2 border-b border-border/50 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <div className="col-span-4">Project</div>
            <div className="col-span-2">Branch</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-3">Findings</div>
            <div className="col-span-1 text-right">Date</div>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center px-5 py-12 text-xs text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading scans…
            </div>
          ) : scans.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <ShieldCheck className="mx-auto h-6 w-6 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">No scans yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Trigger a scan from any project page to see results here.
              </p>
            </div>
          ) : (
            <ul>
              {scans.map((s) => {
                const counts = summaryToCounts(s.summary ?? {});
                return (
                  <li key={s.id} className="border-b border-border/40 last:border-0">
                    <Link
                      to="/app/security/$scanId"
                      params={{ scanId: s.id }}
                      className="grid grid-cols-12 items-center gap-2 px-5 py-3 transition-colors hover:bg-muted/30"
                    >
                      <div className="col-span-4 flex items-center gap-2">
                        <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                        <span className="truncate text-sm font-medium">
                          {projectMap[s.projectId]?.name ?? getRepoSlug(s.repo)}
                        </span>
                      </div>
                      <div className="col-span-2 truncate text-xs text-muted-foreground">
                        {s.branch}
                      </div>
                      <div className="col-span-2">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs ${
                            s.status === "running" || s.status === "pending"
                              ? "text-primary"
                              : s.status === "failed"
                                ? "text-destructive"
                                : "text-emerald-400"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              s.status === "running" || s.status === "pending"
                                ? "bg-primary animate-pulse"
                                : s.status === "failed"
                                  ? "bg-destructive"
                                  : "bg-emerald-400"
                            }`}
                          />
                          {s.status}
                        </span>
                      </div>
                      <div className="col-span-3 flex flex-wrap items-center gap-1">
                        {s.status === "completed" && counts.total === 0 && <CleanBadge />}
                        {counts.critical > 0 && (
                          <SeverityBadge severity="critical" count={counts.critical} />
                        )}
                        {counts.high > 0 && <SeverityBadge severity="high" count={counts.high} />}
                        {counts.medium > 0 && (
                          <SeverityBadge severity="medium" count={counts.medium} />
                        )}
                        {counts.low > 0 && <SeverityBadge severity="low" count={counts.low} />}
                      </div>
                      <div className="col-span-1 flex items-center justify-end gap-1 text-[11px] text-muted-foreground">
                        {timeAgo(s.createdAt)}
                        <ChevronRight className="h-3.5 w-3.5" />
                      </div>
                    </Link>
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
