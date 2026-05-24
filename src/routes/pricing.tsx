import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/page-shell";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { CtaBand } from "@/components/marketing/cta-band";
import { Section, SectionHeading } from "@/components/primitives/section";
const faqs = [
  { q: "Is there a free plan?", a: "Yes. Free forever for personal projects, with 3 repositories and 100 scans per month." },
  { q: "Can I self-host Dockier?", a: "Yes. Pro and Enterprise plans support fully self-hosted deployments on your own infrastructure." },
  { q: "How do AI credits work?", a: "Each AI analysis or remediation PR uses credits proportional to repo size. Pro includes 5,000 credits per user per month." },
  { q: "Do you offer SSO/SAML?", a: "SSO via SAML and OIDC is included on the Enterprise plan, along with audit logs and SOC 2 Type II reports." },
  { q: "Which providers do you support for deploys?", a: "AWS and GCP today. Azure and bare-metal Kubernetes are on the roadmap." },
];

import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    ...pageHead({
      path: "/pricing",
      title: "Pricing — Dockier",
      description: "Free for OSS and personal projects. Pro for teams that ship. Enterprise for security-critical orgs. Transparent pricing, no hidden scan fees.",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <PageShell
      eyebrow="Pricing"
      title={<>Pay for value, <span className="text-gradient-primary">not seats you don't use.</span></>}
      description="Transparent pricing. No hidden scan fees. Annual contracts welcome."
    >
      <Section>
        <PricingCards />
      </Section>
      <Section>
        <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />
        <div className="mx-auto mt-12 max-w-3xl divide-y divide-border/40 rounded-2xl border border-border/50 bg-card/40 backdrop-blur">
          {faqs.map((f) => (
            <details key={f.q} className="group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium">
                {f.q}
                <span className="text-primary transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>
      <CtaBand />
    </PageShell>
  );
}