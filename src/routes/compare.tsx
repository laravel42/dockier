import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/page-shell";
import { ComparisonTeaser } from "@/components/marketing/comparison-teaser";
import { CtaBand } from "@/components/marketing/cta-band";
import { Section } from "@/components/primitives/section";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/compare")({
  head: () => pageHead({
    title: "Compare — Dockier vs Snyk, GitHub AS, SonarQube, GitLab",
    description: "How Dockier compares to Snyk, GitHub Advanced Security, SonarQube, and GitLab Security.",
  }),
  component: ComparePage,
});

function ComparePage() {
  return (
    <PageShell
      eyebrow="Compare"
      title={<>One platform vs. <span className="text-gradient-primary">five point tools.</span></>}
      description="The honest version. Where each tool wins, where Dockier wins, and where we're still catching up."
    >
      <Section>
        <ComparisonTeaser />
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Comparison reflects publicly available product capabilities as of {new Date().getFullYear()}. We update this page quarterly.
        </p>
      </Section>
      <CtaBand />
    </PageShell>
  );
}