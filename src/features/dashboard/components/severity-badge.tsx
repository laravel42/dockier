import { cn } from "@/lib/utils";
import type { Severity } from "@/features/dashboard/lib/types";

const tokens: Record<Severity, string> = {
  critical: "var(--sev-critical)",
  high: "var(--sev-high)",
  medium: "var(--sev-medium)",
  low: "var(--sev-low)",
  info: "var(--sev-info)",
};

const labels: Record<Severity, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
  info: "Info",
};

interface Props {
  severity: Severity;
  count?: number;
  className?: string;
}

export function SeverityBadge({ severity, count, className }: Props) {
  const c = tokens[severity];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        className,
      )}
      style={{
        color: c,
        borderColor: `color-mix(in oklab, ${c} 35%, transparent)`,
        backgroundColor: `color-mix(in oklab, ${c} 14%, transparent)`,
      }}
    >
      <span>{labels[severity]}</span>
      {typeof count === "number" && <span className="opacity-80">· {count}</span>}
    </span>
  );
}

export function CleanBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300",
        className,
      )}
    >
      Clean
    </span>
  );
}
