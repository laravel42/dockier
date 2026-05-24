import { Section, SectionHeading } from "@/components/primitives/section";

const code = `// dockier.config.ts
import { defineProject } from "@dockier/sdk";

export default defineProject({
  repo: "github.com/acme/billing-api",
  branch: "main",
  scanners: ["semgrep", "sonarqube", "custom"],
  ai: {
    analysis: true,
    remediation: { autoOpenPR: true, reviewer: "@security" },
  },
  deploy: {
    provider: "aws",
    strategy: "blue-green",
    env: "production",
  },
});`;

export function DxSection() {
  return (
    <Section>
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Developer experience"
            title={<>Built API-first by engineers, <span className="text-gradient-primary">for engineers.</span></>}
            description="Microservices on FastAPI. React + Tailwind frontend. OpenAI under the hood. Self-hosted or fully managed — your call."
          />
          <ul className="mt-6 grid grid-cols-2 gap-3 text-sm">
            {[
              "API-first architecture",
              "FastAPI microservices",
              "Self-hostable",
              "OpenAI gpt-5.4-mini",
              "Webhooks for everything",
              "GraphQL + REST",
            ].map((x) => (
              <li key={x} className="rounded-md border border-border/50 bg-card/40 px-3 py-2 text-muted-foreground">
                {x}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 -z-10 rounded-2xl bg-[radial-gradient(circle_at_center,oklch(0.78_0.14_180/15%),transparent_60%)] blur-xl" />
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-[oklch(0.12_0.02_240)] shadow-[var(--shadow-elevated)]">
            <div className="flex items-center gap-2 border-b border-border/40 bg-card/60 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.80_0.16_85)]" />
              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
              <span className="ml-3 font-mono text-xs text-muted-foreground">dockier.config.ts</span>
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-relaxed text-muted-foreground">
              <code>{code}</code>
            </pre>
          </div>
        </div>
      </div>
    </Section>
  );
}