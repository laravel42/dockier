import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/page-shell";
import { ComparisonTeaser } from "@/components/marketing/comparison-teaser";
import { CtaBand } from "@/components/marketing/cta-band";
import { Section } from "@/components/primitives/section";
import { pageHead } from "@/lib/seo";

const competitors = [
  {
    id: "dockier-vs-snyk",
    name: "Dockier vs. Snyk",
    body: "Snyk is excellent at dependency and container vulnerability scanning, with one of the largest curated vulnerability databases on the market. Dockier covers the same SCA surface and adds AI architecture review, sensitive-data detection, and one-click remediation PRs in the same workflow. Choose Snyk if you only need vulnerability data feeding existing pipelines; choose Dockier if you want scanning, AI review, and deploys in one platform without stitching tools together.",
    when: "Choose Dockier when you want a single contract instead of Snyk plus a separate SAST, secrets, and deploy stack.",
  },
  {
    id: "dockier-vs-github-advanced-security",
    name: "Dockier vs. GitHub Advanced Security",
    body: "GitHub Advanced Security (CodeQL, secret scanning, Dependabot) is tightly integrated into GitHub-hosted repos and priced per active committer. Dockier works across GitHub, GitLab, and Bitbucket, layers AI architecture analysis and remediation on top of scanning, and ships with deploy automation. If your entire stack lives in GitHub Enterprise and you only need static analysis, GHAS is the obvious choice; if you want cross-host support and AI remediation, Dockier wins.",
    when: "Choose Dockier when you have mixed Git hosts or want AI remediation instead of just findings.",
  },
  {
    id: "dockier-vs-sonarqube",
    name: "Dockier vs. SonarQube",
    body: "SonarQube is the long-standing leader in code quality and static analysis, with deep language coverage and on-prem deployment options. Dockier covers the security subset of SonarQube's findings, but also adds dependency scanning, secret detection, AI architecture review, and deploys. SonarQube remains stronger for pure code quality metrics and developer-loop linting; Dockier is stronger for security and shipping.",
    when: "Choose Dockier when security and remediation matter more than code-quality scoring.",
  },
  {
    id: "dockier-vs-gitlab",
    name: "Dockier vs. GitLab Security",
    body: "GitLab's Ultimate tier bundles SAST, DAST, dependency, container, and license scanning into the same DevOps platform as your CI. Dockier runs alongside any Git host and any CI, with a stronger AI layer for architecture review and remediation. If you have standardized on GitLab Ultimate, the built-in scanners are convenient; if you want best-in-class AI review without leaving your existing CI, run Dockier on top.",
    when: "Choose Dockier when you want AI remediation on top of GitLab CI rather than another bundled scanner.",
  },
];

export const Route = createFileRoute("/compare")({
  head: () => pageHead({
      path: "/compare",
    title: "Compare — Dockier",
    description: "How Dockier stacks up against Snyk, GitHub Advanced Security, SonarQube, and GitLab Security — feature by feature, refreshed quarterly.",
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Compare", path: "/compare" },
    ],
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
      <Section>
        <div className="mx-auto max-w-3xl space-y-10">
          {competitors.map((c) => (
            <article key={c.id} id={c.id} className="scroll-mt-24 rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur">
              <h2 className="font-display text-2xl font-semibold">{c.name}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{c.body}</p>
              <p className="mt-4 text-sm font-medium text-primary">{c.when}</p>
            </article>
          ))}
        </div>
      </Section>
      <CtaBand />
    </PageShell>
  );
}