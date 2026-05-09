import { cn } from "@/lib/utils";
import type { Severity } from "@/features/dashboard/fixtures/data";

const styles: Record<Severity, string> = {
  critical: "bg-[oklch(var(--sev-critical)_/_0.15)] text-[color:var(--sev-critical)] border-[color:var(--sev-critical)]/30",
  high: "bg-[oklch(var(--sev-high)_/_0.15)] text-[color:var(--sev-high)] border-[color:var(--sev-high)]/30",
  medium: "bg-[oklch(var(--sev-medium)_/_0.15)] text-[color:var(--sev-medium)] border-[color:var(--sev-medium)]/30",
  low: "bg-[oklch(var(--sev-low)_/_0.15)] text-[color:var(--sev-low)] border-[color:var(--sev-low)]/30",
  info: "bg-[oklch(var(--sev-info)_/_0.15)] text-[color:var(--sev-info)] border-[color:var(--sev-info)]/30",
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
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        styles[severity],
        className,
      )}
    >
      <span>{labels[severity]}</span>
      {typeof count === "number" && <span className="opacity-80">· {count}</span>}
    </span>
  );
}

export function CleanBadge({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300", className)}>
      Clean
    </span>
  );
}