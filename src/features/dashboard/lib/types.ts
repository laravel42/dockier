// Shared front-end types for the dashboard feature. These map onto the
// Encore API responses but expose UI-shaped values (severity buckets,
// status pills, etc.) so the components don't depend on backend payload
// shapes directly.

export type Severity = "critical" | "high" | "medium" | "low" | "info";

export const severityOrder: Severity[] = ["critical", "high", "medium", "low", "info"];

export interface SeverityCounts {
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
  total: number;
}

const empty: SeverityCounts = {
  critical: 0,
  high: 0,
  medium: 0,
  low: 0,
  info: 0,
  total: 0,
};

/** Normalises an API severity string onto the UI severity union. */
export function normaliseSeverity(input: string | undefined | null): Severity {
  const s = (input ?? "").toLowerCase();
  if (s === "critical") return "critical";
  if (s === "high" || s === "error") return "high";
  if (s === "medium" || s === "warning") return "medium";
  if (s === "low") return "low";
  return "info";
}

/** Counts findings into UI severity buckets. */
export function countFindings(
  findings: Array<{ severity: string }> | undefined | null,
): SeverityCounts {
  if (!findings) return empty;
  const out = { ...empty };
  for (const f of findings) {
    const sev = normaliseSeverity(f.severity);
    out[sev] += 1;
    out.total += 1;
  }
  return out;
}

/** Best-effort severity counts from the Encore scan summary (errors / warnings
 *  / infos) when the per-finding list isn't loaded yet. We surface them as
 *  high / medium / info so the totals are non-zero on list pages. */
export function summaryToCounts(summary: {
  totalFindings?: number;
  errors?: number;
  warnings?: number;
  infos?: number;
}): SeverityCounts {
  return {
    critical: 0,
    high: summary.errors ?? 0,
    medium: summary.warnings ?? 0,
    low: 0,
    info: summary.infos ?? 0,
    total:
      summary.totalFindings ??
      (summary.errors ?? 0) + (summary.warnings ?? 0) + (summary.infos ?? 0),
  };
}
