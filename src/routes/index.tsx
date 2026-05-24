import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Hero } from "@/components/marketing/hero";
import { LogoMarquee } from "@/components/marketing/logo-marquee";
import { StatsStrip } from "@/components/marketing/stats-strip";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { DxSection } from "@/components/marketing/dx-section";
import { ComparisonTeaser } from "@/components/marketing/comparison-teaser";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { CtaBand } from "@/components/marketing/cta-band";
import { Section, SectionHeading } from "@/components/primitives/section";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => ({
    ...pageHead({
      path: "/",
      title: "Dockier — AI-native DevSecOps platform",
      description: "Connect repositories, scan vulnerabilities, analyze architecture with AI, and ship secure code from one platform.",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Dockier",
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Web",
          description:
            "AI-native DevSecOps platform. Connect repos, scan vulnerabilities, analyse architecture with AI, and ship secure code.",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            url: "https://dockier.dev/pricing",
          },
        }),
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <LogoMarquee />
        <Section>
          <StatsStrip />
        </Section>
        <Section id="features">
          <SectionHeading
            eyebrow="One platform, everything connected"
            title={<>Security, AI analysis, and deploys — <span className="text-gradient-primary">unified.</span></>}
            description="Stop stitching together five different tools. Dockier brings security, architecture insight, and deployment into one developer-grade UX."
          />
          <FeatureGrid />
        </Section>
        <Section id="how">
          <SectionHeading
            eyebrow="How it works"
            title={<>From repo to production in <span className="text-gradient-primary">four steps.</span></>}
          />
          <HowItWorks />
        </Section>
        <DxSection />
        <Section id="compare">
          <SectionHeading
            eyebrow="Compare"
            title={<>Why teams switch <span className="text-gradient-primary">to Dockier.</span></>}
            description="Snyk, GitHub Advanced Security, SonarQube, and GitLab each solve part of the problem. Dockier solves all of it."
          />
          <ComparisonTeaser />
        </Section>
        <Section id="pricing">
          <SectionHeading
            eyebrow="Pricing"
            title={<>Simple plans. <span className="text-gradient-primary">Built to scale.</span></>}
            description="Free for personal projects and OSS. Pro for growing teams. Enterprise for security-critical orgs."
          />
          <PricingCards />
        </Section>
        <CtaBand />
      </main>
      <SiteFooter />
    </>
  );
}