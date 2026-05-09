import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/page-shell";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { CtaBand } from "@/components/marketing/cta-band";
import { Section } from "@/components/primitives/section";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/features")({
  head: () => pageHead({
    title: "Features — Dockier",
    description: "Security scanning, AI architecture analysis, sensitive data detection, dependency intelligence, AI remediation, and deployments in one platform.",
  }),
  component: FeaturesPage,
});

function FeaturesPage() {
  return (
    <PageShell
      eyebrow="Platform"
      title={<>Everything modern engineering teams <span className="text-gradient-primary">need to ship securely.</span></>}
      description="Seven capabilities, one workflow, zero context switching."
    >
      <Section>
        <FeatureGrid />
      </Section>
      <CtaBand />
    </PageShell>
  );
}