import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Plus, GitBranch, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { useProjects } from "@/lib/queries";
import { getRepoSlug, timeAgo } from "@/lib/repo";
import { NewProjectDialog } from "@/features/dashboard/components/new-project-dialog";

export function ProjectsPage() {
  const [filter, setFilter] = useState("");
  const [openNew, setOpenNew] = useState(false);
  const { data: projects = [], isLoading } = useProjects();

  const filtered = useMemo(() => {
    if (!filter.trim()) return projects;
    const q = filter.toLowerCase();
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.repository.toLowerCase().includes(q) ||
        p.branch.toLowerCase().includes(q),
    );
  }, [projects, filter]);

  return (
    <div>
      <PageHeader
        title="Projects"
        description="All repositories connected to your Dockier workspace."
        actions={
          <>
            <Input
              placeholder="Filter…"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="h-8 w-48 text-xs"
            />
            <Button size="sm" className="glow gap-1.5" onClick={() => setOpenNew(true)}>
              <Plus className="h-3.5 w-3.5" /> New project
            </Button>
          </>
        }
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading projects…
        </div>
      ) : filtered.length === 0 ? (
        <Card className="bg-card/60">
          <CardContent className="flex flex-col items-center gap-2 py-16 text-center">
            <p className="text-sm font-medium">No projects yet</p>
            <p className="max-w-xs text-xs text-muted-foreground">
              Connect a Git provider in Settings, then create your first project to start scanning
              and deploying.
            </p>
            <Button
              size="sm"
              variant="outline"
              className="mt-3 gap-1.5"
              onClick={() => setOpenNew(true)}
            >
              <Plus className="h-3.5 w-3.5" /> Create project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <Card key={p.id} className="group bg-card/60 transition-all hover:border-primary/40">
              <Link to="/app/projects/$projectId" params={{ projectId: p.id }} className="block">
                <CardContent className="p-5">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate font-display text-base font-semibold">{p.name}</h3>
                      <p className="truncate text-xs text-muted-foreground">
                        {getRepoSlug(p.repository) || p.repository}
                      </p>
                    </div>
                    {p.platform && (
                      <Badge
                        variant="outline"
                        className="shrink-0 text-[10px] uppercase tracking-wider"
                      >
                        {p.platform}
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="text-[10px] font-medium">
                      <GitBranch className="mr-1 h-3 w-3" /> {p.branch}
                    </Badge>
                    {p.template && (
                      <Badge variant="secondary" className="text-[10px] font-medium">
                        {p.template}
                      </Badge>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Created {timeAgo(p.createdAt)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground">
                      Open <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}

      <NewProjectDialog open={openNew} onOpenChange={setOpenNew} />
    </div>
  );
}
