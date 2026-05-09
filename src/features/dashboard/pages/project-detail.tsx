import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  GitBranch,
  GitCommit,
  Rocket,
  ShieldCheck,
  ExternalLink,
  RefreshCw,
  Trash2,
  Users,
  Calendar,
  Code2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { SeverityBadge, CleanBadge } from "@/features/dashboard/components/severity-badge";
import {
  projects,
  deployments,
  scans,
  commitsByProject,
  contributorsByProject,
  projectDescriptions,
} from "@/features/dashboard/fixtures/data";

function timeAgo(iso: string) {
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

interface Props {
  projectId: string;
}

export function ProjectDetailPage({ projectId }: Props) {
  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <p className="text-sm text-muted-foreground">Project not found.</p>
        <Button asChild variant="outline" size="sm">
          <Link to="/app/projects">Back to projects</Link>
        </Button>
      </div>
    );
  }

  const projectDeploys = deployments.filter((d) => d.projectId === projectId);
  const projectScans = scans.filter((s) => s.projectId === projectId);
  const commits = commitsByProject[projectId] ?? [];
  const contributors = contributorsByProject[projectId] ?? [];
  const description = projectDescriptions[projectId] ?? "No description provided.";

  const totalFindings = projectScans.reduce((sum, s) => sum + s.summary.total, 0);
  const successDeploys = projectDeploys.filter((d) => d.status === "success").length;
  const failedDeploys = projectDeploys.filter((d) => d.status === "failed").length;
  const totalCommits = contributors.reduce((sum, c) => sum + c.commits, 0);

  const kpis = [
    { label: "Commits", value: totalCommits, icon: GitCommit },
    { label: "Contributors", value: contributors.length, icon: Users },
    { label: "Deployments", value: projectDeploys.length, icon: Rocket },
    { label: "Successful", value: successDeploys, icon: Rocket, tone: "text-emerald-400" },
    { label: "Failed", value: failedDeploys, icon: Rocket, tone: "text-destructive" },
    { label: "Findings", value: totalFindings, icon: ShieldCheck, tone: totalFindings > 0 ? "text-amber-400" : "text-muted-foreground" },
  ];

  return (
    <div>
      <Link
        to="/app/projects"
        className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to projects
      </Link>

      <PageHeader
        title={project.name}
        description={project.repo}
        actions={
          <>
            <Button size="sm" variant="outline" className="gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" /> Pull origin
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" /> Run scan
            </Button>
            <Button size="sm" className="glow gap-1.5">
              <Rocket className="h-3.5 w-3.5" /> Deploy
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive" aria-label="Delete">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </>
        }
      />

      <div className="mb-5 grid gap-4 md:grid-cols-2">
        <Card className="bg-card/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Repository</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Row icon={<Code2 className="h-3.5 w-3.5" />} label="Repo">
              <a
                href={`https://${project.provider}.com/${project.repo}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                {project.repo} <ExternalLink className="h-3 w-3" />
              </a>
            </Row>
            <Row icon={<GitBranch className="h-3.5 w-3.5" />} label="Branch">
              <span className="rounded-md border border-border/60 bg-muted/40 px-1.5 py-0.5 font-mono text-[11px]">
                {project.branch}
              </span>
            </Row>
            <Row icon={<Code2 className="h-3.5 w-3.5" />} label="Language">
              <Badge variant="outline" className="text-[10px]">{project.language}</Badge>
            </Row>
            <Row icon={<Calendar className="h-3.5 w-3.5" />} label="Updated">
              <span className="text-xs text-muted-foreground">
                {new Date(project.updatedAt).toLocaleString()}
              </span>
            </Row>
          </CardContent>
        </Card>

        <Card className="bg-card/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {kpis.map((k) => (
          <Card key={k.label} className="bg-card/60">
            <CardContent className="p-4">
              <k.icon className={`mb-2 h-4 w-4 ${k.tone ?? "text-primary"}`} />
              <p className="font-display text-2xl font-semibold">{k.value}</p>
              <p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">{k.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-5 grid gap-4 lg:grid-cols-3">
        <Card className="bg-card/60 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold">Recent commits</CardTitle>
            <Button variant="ghost" size="sm" className="h-7 text-xs">View on {project.provider}</Button>
          </CardHeader>
          <CardContent className="p-0">
            {commits.length === 0 ? (
              <p className="px-5 py-8 text-center text-xs text-muted-foreground">No commits yet</p>
            ) : (
              <ul className="divide-y divide-border/40">
                {commits.map((c) => (
                  <li key={c.sha} className="flex items-start gap-3 px-5 py-3">
                    <Avatar className="h-7 w-7 border border-border/60">
                      <AvatarFallback className="bg-primary/15 text-[10px] font-semibold text-primary">
                        {initials(c.author)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">{c.message}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {c.author} · <span className="font-mono">{c.sha}</span> · {timeAgo(c.createdAt)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Contributors</CardTitle>
          </CardHeader>
          <CardContent>
            {contributors.length === 0 ? (
              <p className="text-xs text-muted-foreground">No contributors yet</p>
            ) : (
              <ul className="space-y-2.5">
                {contributors.map((c) => (
                  <li key={c.email} className="flex items-center gap-3">
                    <Avatar className="h-7 w-7 border border-border/60">
                      <AvatarFallback className="bg-primary/15 text-[10px] font-semibold text-primary">
                        {initials(c.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium">{c.name}</p>
                      <p className="truncate text-[10px] text-muted-foreground">{c.email}</p>
                    </div>
                    <span className="shrink-0 text-[11px] text-muted-foreground">{c.commits}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="bg-card/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold">Scan history</CardTitle>
            <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
              <Link to="/app/security">All scans</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {projectScans.length === 0 ? (
              <p className="px-5 py-8 text-center text-xs text-muted-foreground">No scans yet</p>
            ) : (
              <ul className="divide-y divide-border/40">
                {projectScans.map((s) => {
                  const dot =
                    s.status === "running" ? "bg-primary animate-pulse" :
                    s.status === "failed" ? "bg-destructive" :
                    s.summary.total === 0 ? "bg-emerald-400" :
                    s.summary.critical > 0 ? "bg-destructive" : "bg-amber-400";
                  return (
                    <li key={s.id} className="flex items-center gap-3 px-5 py-3">
                      <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {s.branch} · {timeAgo(s.createdAt)}
                        </p>
                        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.status}</p>
                      </div>
                      <div className="flex shrink-0 flex-wrap items-center gap-1">
                        {s.status === "completed" && s.summary.total === 0 && <CleanBadge />}
                        {s.summary.critical > 0 && <SeverityBadge severity="critical" count={s.summary.critical} />}
                        {s.summary.high > 0 && <SeverityBadge severity="high" count={s.summary.high} />}
                        {s.summary.medium > 0 && <SeverityBadge severity="medium" count={s.summary.medium} />}
                        {s.summary.low > 0 && <SeverityBadge severity="low" count={s.summary.low} />}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold">Recent deployments</CardTitle>
            <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
              <Link to="/app/deploy">All deploys</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {projectDeploys.length === 0 ? (
              <p className="px-5 py-8 text-center text-xs text-muted-foreground">No deployments yet</p>
            ) : (
              <ul className="divide-y divide-border/40">
                {projectDeploys.map((d) => {
                  const dot =
                    d.status === "success" ? "bg-emerald-400" :
                    d.status === "failed" ? "bg-destructive" :
                    d.status === "building" || d.status === "deploying" ? "bg-primary animate-pulse" :
                    "bg-muted-foreground";
                  return (
                    <li key={d.id} className="flex items-center gap-3 px-5 py-3">
                      <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {d.branch} · <span className="font-mono text-xs">{d.commit}</span>
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {d.status} · {timeAgo(d.createdAt)} · {d.duration ? `${d.duration}s` : "—"}
                        </p>
                      </div>
                      <Badge variant="outline" className="shrink-0 text-[10px] uppercase tracking-wider">
                        {d.provider}
                      </Badge>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
        {icon} {label}
      </span>
      <div className="min-w-0 truncate text-right">{children}</div>
    </div>
  );
}