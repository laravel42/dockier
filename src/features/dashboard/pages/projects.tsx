import { Plus, GitBranch, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { projects } from "@/features/dashboard/fixtures/data";

export function ProjectsPage() {
  return (
    <div>
      <PageHeader
        title="Projects"
        description="All repositories connected to your Dockier workspace."
        actions={
          <>
            <Input placeholder="Filter…" className="h-8 w-48 text-xs" />
            <Button size="sm" className="glow gap-1.5">
              <Plus className="h-3.5 w-3.5" /> New project
            </Button>
          </>
        }
      />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((p) => (
          <Card key={p.id} className="group bg-card/60 transition-all hover:border-primary/40">
            <CardContent className="p-5">
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="truncate font-display text-base font-semibold">{p.name}</h3>
                  <p className="truncate text-xs text-muted-foreground">{p.repo}</p>
                </div>
                <Badge variant="outline" className="shrink-0 text-[10px] uppercase tracking-wider">{p.provider}</Badge>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <GitBranch className="h-3 w-3" /> {p.branch}
                </span>
                <span>· {p.language}</span>
                <span>· {p.findings} findings</span>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Updated {new Date(p.updatedAt).toLocaleDateString()}
                </span>
                <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                  Open <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}