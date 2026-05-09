import { Link } from "@tanstack/react-router";
import { ArrowRight, FolderGit2, Rocket, ShieldCheck, AlertTriangle, CheckCircle2, XCircle, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { SeverityBadge, CleanBadge } from "@/features/dashboard/components/severity-badge";
import { projects, deployments, scans } from "@/features/dashboard/fixtures/data";
import { useAuth } from "@/hooks/use-auth";

function timeAgo(iso: string) {
  const d = new Date(iso).getTime();
  const diff = Date.now() - d;
  const m = Math.round(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

export function OverviewPage() {
  const { user } = useAuth();
  const name = user?.email?.split("@")[0] ?? "there";

  const successDeploys = deployments.filter((d) => d.status === "success").length;
  const failedDeploys = deployments.filter((d) => d.status === "failed").length;
  const totalFindings = scans.reduce((sum, s) => sum + s.summary.total, 0);
  const projectMap = Object.fromEntries(projects.map((p) => [p.id, p]));

  const kpis = [
    { label: "Projects", value: projects.length, icon: FolderGit2, tone: "text-primary", to: "/app/projects" as const },
    { label: "Deployments", value: deployments.length, icon: Rocket, tone: "text-primary", to: "/app/deploy" as const },
    { label: "Successful", value: successDeploys, icon: CheckCircle2, tone: "text-emerald-400", to: "/app/deploy" as const },
    { label: "Failed", value: failedDeploys, icon: XCircle, tone: "text-destructive", to: "/app/deploy" as const },
    { label: "Scans", value: scans.length, icon: ShieldCheck, tone: "text-primary", to: "/app/security" as const },
    { label: "Findings", value: totalFindings, icon: AlertTriangle, tone: totalFindings > 0 ? "text-amber-400" : "text-muted-foreground", to: "/app/security" as const },
  ];

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${name}`}
        description="A quick view of activity across your workspace."
        actions={
          <Button asChild size="sm" className="glow">
            <Link to="/app/projects">New project</Link>
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {kpis.map((k) => (
          <Link
            key={k.label}
            to={k.to}
            className="group rounded-xl border border-border/60 bg-card/50 p-4 transition-all hover:border-primary/40 hover:bg-card/80"
          >
            <div className={`mb-2 flex items-center justify-between ${k.tone}`}>
              <k.icon className="h-4 w-4" />
              <ArrowRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
            </div>
            <p className="font-display text-2xl font-semibold">{k.value}</p>
            <p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">{k.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="bg-card/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-semibold">Recent deployments</CardTitle>
            </div>
            <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
              <Link to="/app/deploy">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border/60">
              {deployments.slice(0, 5).map((d) => {
                const dot =
                  d.status === "success" ? "bg-emerald-400" :
                  d.status === "failed" ? "bg-destructive" :
                  d.status === "building" || d.status === "deploying" ? "bg-primary animate-pulse" :
                  "bg-muted-foreground";
                return (
                  <li key={d.id}>
                    <Link
                      to="/app/deploy"
                      className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/30"
                    >
                      <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{projectMap[d.projectId]?.name ?? d.repo}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {d.branch} · {d.commit} · {timeAgo(d.createdAt)}
                        </p>
                      </div>
                      <span className="rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                        {d.provider}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-card/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-semibold">Recent security scans</CardTitle>
            </div>
            <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
              <Link to="/app/security">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border/60">
              {scans.slice(0, 5).map((s) => {
                const dot =
                  s.status === "running" ? "bg-primary animate-pulse" :
                  s.status === "failed" ? "bg-destructive" :
                  s.summary.total === 0 ? "bg-emerald-400" :
                  s.summary.critical > 0 ? "bg-destructive" : "bg-amber-400";
                return (
                  <li key={s.id}>
                    <Link to="/app/security" className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/30">
                      <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{projectMap[s.projectId]?.name ?? s.repo}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {s.branch} · {timeAgo(s.createdAt)}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        {s.status === "completed" && s.summary.total === 0 && <CleanBadge />}
                        {s.summary.critical > 0 && <SeverityBadge severity="critical" count={s.summary.critical} />}
                        {s.summary.high > 0 && <SeverityBadge severity="high" count={s.summary.high} />}
                        {s.summary.medium > 0 && s.summary.critical === 0 && s.summary.high === 0 && <SeverityBadge severity="medium" count={s.summary.medium} />}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}