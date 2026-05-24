import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/primitives/section";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () => pageHead({
      path: "/privacy",
    title: "Privacy Policy — Dockier",
    description: "How Dockier collects, processes, stores, and protects your personal data. GDPR-aligned and updated regularly.",
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title={<>Privacy <span className="text-gradient-primary">policy</span></>}
      description="Last updated: 24 May 2026"
    >
      <Section>
        <div className="mx-auto max-w-3xl space-y-8 text-sm leading-7 text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Overview</h2>
            <p className="mt-2">
              Dockier Labs ("we", "us", or "our") operates the Dockier platform. This privacy policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">2. Information we collect</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li><strong>Account data:</strong> name, email address, and authentication credentials when you register.</li>
              <li><strong>Repository data:</strong> metadata from connected Git repositories (branch names, commit hashes, file paths) for scanning and analysis.</li>
              <li><strong>Scan results:</strong> security findings, vulnerability reports, and AI-generated analysis.</li>
              <li><strong>Usage data:</strong> IP address, browser type, pages visited, and feature interactions.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">3. How we use your information</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>To provide and maintain the Dockier platform and its features.</li>
              <li>To run security scans, dependency checks, and AI analysis on your repositories.</li>
              <li>To notify you of findings, deploy status, and account events.</li>
              <li>To improve our services, fix bugs, and develop new features.</li>
              <li>To comply with legal obligations and enforce our terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Data sharing</h2>
            <p className="mt-2">
              We do not sell your personal data. We share data only with:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li><strong>Service providers:</strong> cloud hosting, payment processing, and analytics vendors under strict confidentiality agreements.</li>
              <li><strong>Security databases:</strong> vulnerability identifiers (e.g., package names, versions) may be checked against public databases such as OSV.dev.</li>
              <li><strong>Legal requirements:</strong> when required by law or to protect our rights.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">5. Data retention</h2>
            <p className="mt-2">
              We retain scan results and repository metadata for as long as your account is active or as needed to provide services. You can request deletion of your account and associated data at any time by contacting us at hello@dockier.dev.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">6. Security</h2>
            <p className="mt-2">
              We use industry-standard measures including encryption in transit (TLS), encrypted storage, role-based access control, and regular security audits. However, no method of transmission or storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">7. Your rights</h2>
            <p className="mt-2">
              Depending on your jurisdiction, you may have rights to access, correct, delete, or restrict processing of your personal data. Contact us at hello@dockier.dev to exercise these rights.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">8. Changes to this policy</h2>
            <p className="mt-2">
              We may update this privacy policy from time to time. We will notify you of significant changes via email or through the platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">9. Contact us</h2>
            <p className="mt-2">
              If you have questions about this privacy policy, please contact us at hello@dockier.dev.
            </p>
          </section>
        </div>
      </Section>
    </PageShell>
  );
}
