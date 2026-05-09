import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ShieldCheck,
  FileCode2,
  RefreshCw,
  Filter,
  GitBranch,
  Calendar,
  CheckCircle2,
  EyeOff,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { SeverityBadge, CleanBadge } from "@/features/dashboard/components/severity-badge";
import { useScan, useFindings, useRunScan, useProjects } from "@/lib/queries";
import {
  countFindings,
  normaliseSeverity,
  severityOrder,
  type Severity,
} from "@/features/dashboard/lib/types";
import { getRepoSlug } from "@/lib/repo";
import { toast } from "sonner";

interface Props {
  scanId: string;
}

export function ScanDetailPage({ scanId }: Props) {
  const { data: scan, isLoading } = useScan(scanId);
  const { data: findings = [] } = useFindings(scanId);
  const { data: projects = [] } = useProjects();
  const project = scan ? projects.find((p) => p.id === scan.projectId) : undefined;
  const runScan = useRunScan();

  const [filter, setFilter] = useState<Severity | "all">("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const counts = useMemo(() => countFindings(findings), [findings]);

  const filtered = useMemo(() => {
    return findings
      .filter((f) => (filter === "all" ? true : normaliseSeverity(f.severity) === filter))
      .filter((f) => {
        if (!query) return true;
        const q = query.toLowerCase();
        return (
          f.message.toLowerCase().includes(q) ||
          f.filePath.toLowerCase().includes(q) ||
          f.ruleId.toLowerCase().includes(q)
        );
      })
      .sort(
        (a, b) =>
          severityOrder.indexOf(normaliseSeverity(a.severity)) -
          severityOrder.indexOf(normaliseSeverity(b.severity)),
      );
  }, [findings, filter, query]);

  const selected = filtered.find((f) => f.id === selectedId) ?? filtered[0] ?? null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading scan…
      </div>
    );
  }

  if (!scan) {
    return (
      <div>
        <PageHeader title="Scan not found" description="This scan no longer exists." />
        <Button asChild variant="outline" size="sm">
          <Link to="/app/security">
            <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back to scans
          </Link>
        </Button>
      </div>
    );
  }

  const onRerun = async () => {
    try {
      await runScan.mutateAsync({ scanId });
      toast.success("Scan re-queued");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not re-run scan");
    }
  };

  return (
    <div>
      <PageHeader
        title={`Scan · ${project?.name ?? getRepoSlug(scan.repo)}`}
        description={`${getRepoSlug(scan.repo)} on ${scan.branch}`}
        actions={
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="gap-1.5">
              <Link to="/app/security">
                <ArrowLeft className="h-3.5 w-3.5" /> All scans
              </Link>
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={onRerun}
              disabled={runScan.isPending}
            >
              <RefreshCw className="h-3.5 w-3.5" />{" "}
              {runScan.isPending ? "Queueing…" : "Re-run scan"}
            </Button>
          </div>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <GitBranch className="h-3.5 w-3.5" /> {scan.branch}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" /> {new Date(scan.createdAt).toLocaleString("en-GB")}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 ${
            scan.status === "running" || scan.status === "pending"
              ? "text-primary"
              : scan.status === "failed"
                ? "text-destructive"
                : "text-emerald-400"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              scan.status === "running" || scan.status === "pending"
                ? "bg-primary animate-pulse"
                : scan.status === "failed"
                  ? "bg-destructive"
                  : "bg-emerald-400"
            }`}
          />
          {scan.status}
        </span>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(["critical", "high", "medium", "low"] as const).map((sev) => (
          <Card key={sev} className="bg-card/60">
            <CardContent className="p-4">
              <SeverityBadge severity={sev} />
              <p className="mt-3 font-display text-2xl font-semibold">{counts[sev]}</p>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Findings</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as Severity | "all")}>
          <TabsList className="bg-card/60">
            <TabsTrigger value="all">All ({findings.length})</TabsTrigger>
            {severityOrder.slice(0, 4).map((s) => (
              <TabsTrigger key={s} value={s}>
                {s} ({counts[s]})
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by message, rule or file"
            className="h-8 w-72"
          />
        </div>
      </div>

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
                  const sev = normaliseSeverity(f.severity);
                  const active = selected?.id === f.id;
                  return (
                    <li key={f.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(f.id)}
                        className={`flex w-full items-start gap-3 border-b border-border/40 px-4 py-3 text-left transition-colors last:border-0 hover:bg-muted/30 ${
                          active ? "bg-muted/40" : ""
                        }`}
                      >
                        <ShieldCheck className="mt-0.5 h-4 w-4 text-primary" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <SeverityBadge severity={sev} />
                            <span className="truncate text-[11px] text-muted-foreground">
                              {f.ruleId}
                            </span>
                          </div>
                          <p className="mt-1 truncate text-sm font-medium">{f.message}</p>
                          <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">
                            {f.filePath}:{f.startLine}
                          </p>
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
                    <SeverityBadge severity={normaliseSeverity(selected.severity)} />
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                      {selected.ruleId}
                    </Badge>
                  </div>
                  <h2 className="mt-2 font-display text-lg font-semibold leading-tight">
                    {selected.message}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Mark fixed
                  </Button>
                  <Button size="sm" variant="ghost" className="gap-1.5">
                    <EyeOff className="h-3.5 w-3.5" /> Ignore
                  </Button>
                </div>
              </div>

              <div>
                <p className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <FileCode2 className="h-3 w-3" /> {selected.filePath}:{selected.startLine}
                  {selected.endLine !== selected.startLine ? `–${selected.endLine}` : ""}
                </p>
                <pre className="overflow-x-auto rounded-md border border-border/50 bg-muted/40 p-3 font-mono text-xs leading-relaxed">
                  <code>{selected.snippet}</code>
                </pre>
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
