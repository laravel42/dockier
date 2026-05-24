import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/primitives/section";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  head: () => pageHead({
      path: "/terms",
    title: "Terms of Service — Dockier",
    description: "The terms governing your use of the Dockier platform — acceptable use, service levels, data ownership, and liability.",
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title={<>Terms of <span className="text-gradient-primary">service</span></>}
      description="Last updated: 24 May 2026"
    >
      <Section>
        <div className="mx-auto max-w-3xl space-y-8 text-sm leading-7 text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Acceptance of terms</h2>
            <p className="mt-2">
              By accessing or using the Dockier platform ("Service"), you agree to be bound by these terms of service ("Terms"). If you do not agree to these Terms, you may not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">2. Description of service</h2>
            <p className="mt-2">
              Dockier is a developer platform that provides automated security scanning, AI-powered project analysis, deployment pipelines, and project management tools. Features and availability may change without notice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">3. Account registration</h2>
            <p className="mt-2">
              You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Acceptable use</h2>
            <p className="mt-2">You agree not to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Use the Service for any illegal purpose or in violation of any laws.</li>
              <li>Attempt to gain unauthorized access to any part of the Service or its infrastructure.</li>
              <li>Interfere with or disrupt the Service or servers connected to it.</li>
              <li>Upload malicious code, viruses, or harmful content.</li>
              <li>Scan repositories you do not own or have permission to analyze.</li>
              <li>Reverse engineer, decompile, or disassemble any aspect of the Service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">5. Repository access</h2>
            <p className="mt-2">
              By connecting a repository to Dockier, you grant us permission to read repository metadata and code solely for the purpose of providing the Service. We do not claim ownership of your code or data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">6. Intellectual property</h2>
            <p className="mt-2">
              Dockier and its original content, features, and functionality are owned by Dockier Labs and are protected by international copyright, trademark, and other intellectual property laws. You retain all rights to your own code and data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">7. Termination</h2>
            <p className="mt-2">
              We may suspend or terminate your access to the Service at any time, with or without cause, with or without notice. Upon termination, your right to use the Service ceases immediately.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">8. Disclaimer of warranties</h2>
            <p className="mt-2">
              The Service is provided "as is" and "as available" without warranties of any kind. We do not guarantee that the Service will be uninterrupted, secure, or error-free, or that scan results are exhaustive or accurate.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">9. Limitation of liability</h2>
            <p className="mt-2">
              To the maximum extent permitted by law, Dockier Labs shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">10. Changes to terms</h2>
            <p className="mt-2">
              We reserve the right to modify these Terms at any time. We will notify you of material changes via email or through the platform. Continued use of the Service after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">11. Governing law</h2>
            <p className="mt-2">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Dockier Labs is registered, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">12. Contact us</h2>
            <p className="mt-2">
              If you have questions about these Terms, please contact us at hello@dockier.dev.
            </p>
          </section>
        </div>
      </Section>
    </PageShell>
  );
}
