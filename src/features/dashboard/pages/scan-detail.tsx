import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, FileCode2, RefreshCw, Filter, GitBranch, Calendar, CheckCircle2, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { SeverityBadge, CleanBadge } from "@/features/dashboard/components/severity-badge";
import { findingsByScan, projects, scans, type Severity } from "@/features/dashboard/fixtures/data";

const severityOrder: Severity[] = ["critical", "high", "medium", "low", "info"];

interface Props { scanId: string }

export function ScanDetailPage({ scanId }: Props) {
  const scan = scans.find((s) => s.id === scanId);
  const project = scan ? projects.find((p) => p.id === scan.projectId) : undefined;
  const findings = findingsByScan[scanId] ?? [];

  const [filter, setFilter] = useState<Severity | "all">("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(findings[0]?.id ?? null);

  const filtered = useMemo(() => {
    return findings
      .filter((f) => (filter === "all" ? true : f.severity === filter))
      .filter((f) => {
        if (!query) return true;
        const q = query.toLowerCase();
        return f.title.toLowerCase().includes(q) || f.file.toLowerCase().includes(q) || f.rule.toLowerCase().includes(q);
      })
      .sort((a, b) => severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity));
  }, [findings, filter, query]);

  const selected = filtered.find((f) => f.id === selectedId) ?? filtered[0];

  if (!scan) {
    return (
      <div>
        <PageHeader title="Scan not found" description="This scan no longer exists." />
        <Button asChild variant="outline" size="sm"><Link to="/app/security"><ArrowLeft className="h-3.5 w-3.5" /> Back to scans</Link></Button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`Scan ${scan.id} · ${project?.name ?? scan.repo}`}
        description={`${scan.repo} on ${scan.branch}`}
        actions={
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="gap-1.5">
              <Link to="/app/security"><ArrowLeft className="h-3.5 w-3.5" /> All scans</Link>
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" /> Re-run scan
            </Button>
          </div>
        }
      />

      {/* Meta strip */}
      <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><GitBranch className="h-3.5 w-3.5" /> {scan.branch}</span>
        <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {new Date(scan.createdAt).toLocaleString("en-GB")}</span>
        <span className={`inline-flex items-center gap-1.5 ${scan.status === "running" ? "text-primary" : scan.status === "failed" ? "text-destructive" : "text-emerald-400"}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${scan.status === "running" ? "bg-primary animate-pulse" : scan.status === "failed" ? "bg-destructive" : "bg-emerald-400"}`} />
          {scan.status}
        </span>
      </div>

      {/* Severity tiles */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(["critical", "high", "medium", "low"] as const).map((sev) => (
          <Card key={sev} className="bg-card/60">
            <CardContent className="p-4">
              <SeverityBadge severity={sev} />
              <p className="mt-3 font-display text-2xl font-semibold">{scan.summary[sev]}</p>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Findings</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as Severity | "all")}>
          <TabsList className="bg-card/60">
            <TabsTrigger value="all">All ({findings.length})</TabsTrigger>
            {severityOrder.slice(0, 4).map((s) => (
              <TabsTrigger key={s} value={s}>{s} ({findings.filter((f) => f.severity === s).length})</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter by title, rule or file" className="h-8 w-72" />
        </div>
      </div>

      {/* Master / detail */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <Card className="bg-card/60">
          <CardContent className="p-0">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-5 py-10 text-center">
                <CleanBadge />
                <p className="text-sm text-muted-foreground">No findings for this filter.</p>
              </div>
            ) : (
              <ul>
                {filtered.map((f) => {
                  const active = selected?.id === f.id;
                  return (
                    <li key={f.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(f.id)}
                        className={`flex w-full items-start gap-3 border-b border-border/40 px-4 py-3 text-left transition-colors last:border-0 hover:bg-muted/30 ${active ? "bg-muted/40" : ""}`}
                      >
                        <ShieldCheck className="mt-0.5 h-4 w-4 text-primary" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <SeverityBadge severity={f.severity} />
                            <span className="truncate text-[11px] text-muted-foreground">{f.rule}</span>
                          </div>
                          <p className="mt-1 truncate text-sm font-medium">{f.title}</p>
                          <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">{f.file}:{f.line}</p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        {selected ? (
          <Card className="bg-card/60">
            <CardContent className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <SeverityBadge severity={selected.severity} />
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider">{selected.category}</Badge>
                    {selected.cwe && <Badge variant="secondary" className="text-[10px]">{selected.cwe}</Badge>}
                  </div>
                  <h2 className="mt-2 font-display text-lg font-semibold leading-tight">{selected.title}</h2>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">{selected.rule}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> Mark fixed</Button>
                  <Button size="sm" variant="ghost" className="gap-1.5"><EyeOff className="h-3.5 w-3.5" /> Ignore</Button>
                </div>
              </div>

              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Description</p>
                <p className="text-sm leading-relaxed text-foreground/90">{selected.description}</p>
              </div>

              <div>
                <p className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <FileCode2 className="h-3 w-3" /> {selected.file}:{selected.line}
                </p>
                <pre className="overflow-x-auto rounded-md border border-border/50 bg-muted/40 p-3 font-mono text-xs leading-relaxed">
                  <code>{selected.snippet}</code>
                </pre>
              </div>

              <div className="rounded-md border border-primary/20 bg-primary/5 p-3">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-primary">Recommended fix</p>
                <p className="text-sm leading-relaxed">{selected.remediation}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-card/60">
            <CardContent className="flex h-full items-center justify-center p-10 text-sm text-muted-foreground">
              Select a finding to see the details.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
