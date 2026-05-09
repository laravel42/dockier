import { ShieldCheck, RefreshCw, ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { SeverityBadge, CleanBadge } from "@/features/dashboard/components/severity-badge";
import { scans, projects } from "@/features/dashboard/fixtures/data";

export function SecurityPage() {
  const projectMap = Object.fromEntries(projects.map((p) => [p.id, p]));
  const totals = scans.reduce(
    (acc, s) => {
      acc.critical += s.summary.critical;
      acc.high += s.summary.high;
      acc.medium += s.summary.medium;
      acc.low += s.summary.low;
      return acc;
    },
    { critical: 0, high: 0, medium: 0, low: 0 },
  );

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
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Open findings</p>
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
          <ul>
            {scans.map((s) => (
              <li key={s.id} className="border-b border-border/40 last:border-0">
                <Link
                  to="/app/security/$scanId"
                  params={{ scanId: s.id }}
                  className="grid grid-cols-12 items-center gap-2 px-5 py-3 transition-colors hover:bg-muted/30"
                >
                  <div className="col-span-4 flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  <span className="truncate text-sm font-medium">{projectMap[s.projectId]?.name ?? s.repo}</span>
                </div>
                <div className="col-span-2 truncate text-xs text-muted-foreground">{s.branch}</div>
                <div className="col-span-2">
                  <span className={`inline-flex items-center gap-1.5 text-xs ${s.status === "running" ? "text-primary" : s.status === "failed" ? "text-destructive" : "text-emerald-400"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${s.status === "running" ? "bg-primary animate-pulse" : s.status === "failed" ? "bg-destructive" : "bg-emerald-400"}`} />
                    {s.status}
                  </span>
                </div>
                <div className="col-span-3 flex flex-wrap items-center gap-1">
                  {s.status === "completed" && s.summary.total === 0 && <CleanBadge />}
                  {s.summary.critical > 0 && <SeverityBadge severity="critical" count={s.summary.critical} />}
                  {s.summary.high > 0 && <SeverityBadge severity="high" count={s.summary.high} />}
                  {s.summary.medium > 0 && <SeverityBadge severity="medium" count={s.summary.medium} />}
                  {s.summary.low > 0 && <SeverityBadge severity="low" count={s.summary.low} />}
                </div>
                  <div className="col-span-1 flex items-center justify-end gap-1 text-[11px] text-muted-foreground">
                    {new Date(s.createdAt).toLocaleDateString("en-GB")}
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}