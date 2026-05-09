import { useMemo } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
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
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { SeverityBadge, CleanBadge } from "@/features/dashboard/components/severity-badge";
import {
  useProject,
  useDeleteProject,
  useDeployments,
  useScans,
  useRepoStats,
  useRecentCommits,
} from "@/lib/queries";
import { summaryToCounts } from "@/features/dashboard/lib/types";
import { parseOwnerRepo, getRepoSlug, timeAgo } from "@/lib/repo";
import { toast } from "sonner";

interface Props {
  projectId: string;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ProjectDetailPage({ projectId }: Props) {
  const navigate = useNavigate();
  const { data: project, isLoading, error } = useProject(projectId);
  const { data: scans = [] } = useScans(projectId);
  const { data: deployments = [] } = useDeployments();
  const deleteProject = useDeleteProject();

  const ownerRepo = useMemo(() => (project ? parseOwnerRepo(project.repository) : null), [project]);

  const { data: stats } = useRepoStats(
    project?.connectionId,
    ownerRepo?.owner,
    ownerRepo?.repo,
    project?.branch,
    project?.id,
  );

  const { data: commits = [] } = useRecentCommits(
    project?.connectionId,
    ownerRepo?.owner,
    ownerRepo?.repo,
    project?.branch,
    8,
  );

  const projectDeploys = useMemo(
    () => deployments.filter((d) => d.projectId === projectId),
    [deployments, projectId],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading project…
      </div>
    );
  }

  if (error || !project) {
    return (
      <div>
        <PageHeader
          title="Project not found"
          description="This project no longer exists or you no longer have access."
        />
        <Button asChild variant="outline" size="sm">
          <Link to="/app/projects">
            <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back to projects
          </Link>
        </Button>
      </div>
    );
  }

  const onDelete = async () => {
    if (!confirm(`Delete project "${project.name}"? This cannot be undone.`)) return;
    try {
      await deleteProject.mutateAsync(project.id);
      toast.success("Project deleted");
      navigate({ to: "/app/projects" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <div>
      <PageHeader
        title={project.name}
        description={getRepoSlug(project.repository)}
        actions={
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="gap-1.5">
              <Link to="/app/projects">
                <ArrowLeft className="h-3.5 w-3.5" /> All projects
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="gap-1.5">
              <a href={project.repository} target="_blank" rel="noreferrer">
                <ExternalLink className="h-3.5 w-3.5" /> Open repo
              </a>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="gap-1.5 text-destructive hover:text-destructive"
              onClick={onDelete}
              disabled={deleteProject.isPending}
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </Button>
          </div>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <GitBranch className="h-3.5 w-3.5" /> {project.branch}
        </span>
        {stats?.language && (
          <span className="inline-flex items-center gap-1.5">
            <Code2 className="h-3.5 w-3.5" /> {stats.language}
          </span>
        )}
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" /> Created {timeAgo(project.createdAt)}
        </span>
        {project.platform && (
          <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
            {project.platform}
          </Badge>
        )}
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Kpi icon={ShieldCheck} label="Scans" value={scans.length} />
        <Kpi icon={Rocket} label="Deployments" value={projectDeploys.length} />
        <Kpi icon={Users} label="Contributors" value={stats?.contributors ?? 0} />
        <Kpi icon={GitCommit} label="Commits" value={stats?.totalCommits ?? 0} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <Card className="bg-card/60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div className="flex items-center gap-2">
                <GitCommit className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-semibold">Recent commits</CardTitle>
              </div>
              <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs">
                <RefreshCw className="h-3 w-3" /> Refresh
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {commits.length === 0 ? (
                <p className="px-5 py-6 text-center text-xs text-muted-foreground">
                  No recent commits to show.
                </p>
              ) : (
                <ul className="divide-y divide-border/60">
                  {commits.map((c) => (
                    <li key={c.hash} className="flex items-start gap-3 px-5 py-3">
                      <Avatar className="h-7 w-7">
                        {c.authorAvatar && <AvatarImage src={c.authorAvatar} alt={c.author} />}
                        <AvatarFallback className="text-[10px]">
                          {initials(c.author || "?")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm">{c.message}</p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          <span className="font-mono">{c.shortHash}</span> · {c.author} ·{" "}
                          {timeAgo(c.date)}
                        </p>
                      </div>
                      {c.url && (
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card/60">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Rocket className="h-4 w-4 text-primary" /> Recent deployments
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {projectDeploys.length === 0 ? (
                <p className="px-5 py-6 text-center text-xs text-muted-foreground">
                  No deployments yet.
                </p>
              ) : (
                <ul className="divide-y divide-border/60">
                  {projectDeploys.slice(0, 5).map((d) => (
                    <li key={d.id} className="flex items-center gap-3 px-5 py-3">
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${
                          d.status === "success"
                            ? "bg-emerald-400"
                            : d.status === "failed"
                              ? "bg-destructive"
                              : "bg-primary animate-pulse"
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm">
                          {d.branch}{" "}
                          {d.commitHash && (
                            <span className="font-mono text-[11px] text-muted-foreground">
                              · {d.commitHash.slice(0, 7)}
                            </span>
                          )}
                        </p>
                        <p className="text-[11px] text-muted-foreground">{timeAgo(d.createdAt)}</p>
                      </div>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {d.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="bg-card/60">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <ShieldCheck className="h-4 w-4 text-primary" /> Recent scans
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {scans.length === 0 ? (
                <p className="px-5 py-6 text-center text-xs text-muted-foreground">
                  No scans yet for this project.
                </p>
              ) : (
                <ul className="divide-y divide-border/60">
                  {scans.slice(0, 5).map((s) => {
                    const counts = summaryToCounts(s.summary ?? {});
                    return (
                      <li key={s.id}>
                        <Link
                          to="/app/security/$scanId"
                          params={{ scanId: s.id }}
                          className="flex items-center gap-3 px-5 py-3 hover:bg-muted/30"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm">{s.branch}</p>
                            <p className="text-[11px] text-muted-foreground">
                              {timeAgo(s.createdAt)}
                            </p>
                          </div>
                          {counts.total === 0 && s.status === "completed" ? (
                            <CleanBadge />
                          ) : counts.high > 0 ? (
                            <SeverityBadge severity="high" count={counts.high} />
                          ) : counts.medium > 0 ? (
                            <SeverityBadge severity="medium" count={counts.medium} />
                          ) : null}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card/60">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Users className="h-4 w-4 text-primary" /> Contributors
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!stats?.topContributors?.length ? (
                <p className="text-xs text-muted-foreground">Contributor data not available.</p>
              ) : (
                <ul className="space-y-2">
                  {stats.topContributors.slice(0, 6).map((c) => (
                    <li key={c.name} className="flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <Avatar className="h-6 w-6">
                          {c.avatarUrl && <AvatarImage src={c.avatarUrl} alt={c.name} />}
                          <AvatarFallback className="text-[10px]">
                            {initials(c.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="truncate text-xs">{c.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">
                        {c.commits}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <Card className="bg-card/60">
      <CardContent className="p-4">
        <div className="mb-2 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <p className="font-display text-2xl font-semibold">{value}</p>
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}
