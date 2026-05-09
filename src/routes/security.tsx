import { createFileRoute } from "@tanstack/react-router";
import { Lock, Shield, Key, FileCheck, Server, Eye } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { CtaBand } from "@/components/marketing/cta-band";
import { Section } from "@/components/primitives/section";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/security")({
  head: () => pageHead({
    title: "Security & Trust — Dockier",
    description: "Encryption at rest and in transit, RBAC, audit logging, secret management, and SOC 2 Type II.",
  }),
  component: SecurityPage,
});

const pillars = [
  { i: Lock, t: "Encryption everywhere", b: "TLS 1.3 in transit. AES-256 at rest. Customer-managed keys on Enterprise." },
  { i: Key, t: "Secret management", b: "Secrets are encrypted with envelope encryption and never logged. Scoped access only." },
  { i: Shield, t: "RBAC + 2FA", b: "Granular roles, group permissions, and mandatory 2FA for admins. SSO/SAML on Enterprise." },
  { i: FileCheck, t: "Audit logging", b: "Tamper-evident audit trail for every privileged action. Exportable to your SIEM." },
  { i: Server, t: "Infrastructure security", b: "Hardened, isolated tenants. SOC 2 Type II. Annual third-party penetration tests." },
  { i: Eye, t: "Scanning transparency", b: "Open rule sets. Per-finding traceability. No black-box scoring." },
];

function SecurityPage() {
  return (
    <PageShell
      eyebrow="Security & trust"
      title={<>Built for the teams <span className="text-gradient-primary">who can't afford breaches.</span></>}
      description="Compliance, encryption, and operational rigor — documented end to end."
    >
      <Section>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p) => (
            <div key={p.t} className="rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                <p.i className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold">{p.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.b}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-border/50 bg-card/40 p-6 text-sm text-muted-foreground backdrop-blur">
          <span>Trust attestations:</span>
          {["SOC 2 Type II", "ISO 27001", "GDPR", "HIPAA-ready"].map((b) => (
            <span key={b} className="rounded-md border border-primary/30 bg-primary/10 px-3 py-1 text-primary">{b}</span>
          ))}
        </div>
      </Section>
      <CtaBand />
    </PageShell>
  );
}