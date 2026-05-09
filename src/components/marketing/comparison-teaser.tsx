import { Check, Minus, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { comparison } from "@/lib/site";
import { Button } from "@/components/ui/button";

const cols = [
  { key: "us", label: "Dockier", us: true },
  { key: "snyk", label: "Snyk" },
  { key: "ghas", label: "GitHub AS" },
  { key: "sonar", label: "SonarQube" },
  { key: "gitlab", label: "GitLab" },
] as const;

function Cell({ v }: { v: boolean | "partial" }) {
  if (v === true) return <Check className="mx-auto h-4 w-4 text-primary" />;
  if (v === "partial") return <Minus className="mx-auto h-4 w-4 text-[oklch(0.80_0.16_85)]" />;
  return <X className="mx-auto h-4 w-4 text-muted-foreground/50" />;
}

export function ComparisonTeaser() {
  return (
    <div className="mt-12 overflow-hidden rounded-2xl border border-border/50 bg-card/40 backdrop-blur">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/40 bg-background/40">
              <th className="p-4 text-left font-medium text-muted-foreground">Capability</th>
              {cols.map((c) => (
                <th
                  key={c.key}
                  className={`p-4 text-center font-medium ${c.us ? "text-primary" : "text-muted-foreground"}`}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparison.rows.map((r) => (
              <tr key={r.feature} className="border-b border-border/30 last:border-0">
                <td className="p-4">{r.feature}</td>
                {cols.map((c) => (
                  <td key={c.key} className="p-4 text-center">
                    <Cell v={r[c.key as keyof typeof r] as boolean | "partial"} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-center border-t border-border/40 p-4">
        <Button asChild variant="outline" size="sm">
          <Link to="/compare">See full comparison</Link>
        </Button>
      </div>
    </div>
  );
}