import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/primitives/section";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/changelog")({
  head: () => pageHead({
    title: "Changelog — Dockier",
    description: "Every release, every week. New features, fixes, and platform updates.",
  }),
  component: ChangelogPage,
});

const releases = [
  {
    v: "v1.8.0", date: "May 2026",
    items: [
      "AI architecture analysis now refreshes incrementally per commit.",
      "New: Linear integration with effort estimates.",
      "Sensitive data scanner adds Eloquent and Pydantic support.",
    ],
  },
  {
    v: "v1.7.0", date: "April 2026",
    items: [
      "AWS blue-green deploys reach GA.",
      "Custom rules engine now supports regex captures.",
      "Audit log export to S3 / GCS.",
    ],
  },
  {
    v: "v1.6.0", date: "March 2026",
    items: [
      "OSV.dev dependency scanning ships free for all plans.",
      "Project overview adds Code Quality and Deployment tabs.",
      "RBAC: custom roles with fine-grained scopes.",
    ],
  },
];

function ChangelogPage() {
  return (
    <PageShell
      eyebrow="Changelog"
      title={<>Shipping <span className="text-gradient-primary">every week.</span></>}
      description="The platform improves continuously. Subscribe to release notes via RSS."
    >
      <Section>
        <div className="mx-auto max-w-3xl space-y-6">
          {releases.map((r) => (
            <article key={r.v} className="rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur">
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-xl font-semibold text-gradient-primary">{r.v}</h3>
                <span className="text-xs text-muted-foreground">{r.date}</span>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {r.items.map((it) => (
                  <li key={it} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {it}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}