import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/page-shell";
import { DashboardMockup } from "@/components/marketing/dashboard-mockup";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { DxSection } from "@/components/marketing/dx-section";
import { CtaBand } from "@/components/marketing/cta-band";
import { Section, SectionHeading } from "@/components/primitives/section";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/product")({
  head: () => pageHead({
    title: "Product tour — Dockier",
    description: "See how Dockier connects your repositories, runs AI-powered scans, and ships verified commits to production.",
  }),
  component: ProductPage,
});

const showcases = [
  {
    title: "Unified dashboard",
    body: "Project counts, deployment status, scan history, and findings — at a glance, with severity badges that mirror your team's mental model.",
  },
  {
    title: "Scan results that make sense",
    body: "Group findings by file. Filter by provider. Open a remediation PR or create a Jira/Linear issue without leaving the page.",
  },
  {
    title: "AI project overview",
    body: "Eight tabbed sections: Overview, How It Works, Tech Stack, Architecture, Data & Storage, Code Quality, Security, Deployment. Cached per commit, refreshable on demand.",
  },
];

function ProductPage() {
  return (
    <PageShell
      eyebrow="Product"
      title={<>The platform you'd build <span className="text-gradient-primary">if you had time.</span></>}
      description="A guided tour through Dockier — from connecting your first repo to deploying a verified commit."
    >
      <Section>
        <DashboardMockup />
      </Section>
      <Section>
        <div className="grid gap-6 lg:grid-cols-3">
          {showcases.map((s) => (
            <div key={s.title} className="rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur">
              <h3 className="font-display text-xl">{s.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </Section>
      <Section>
        <SectionHeading eyebrow="Workflow" title={<>From repo to prod <span className="text-gradient-primary">in four steps.</span></>} />
        <HowItWorks />
      </Section>
      <DxSection />
      <CtaBand />
    </PageShell>
  );
}