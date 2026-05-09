import { createFileRoute, Link } from "@tanstack/react-router";
import { Book, Code2, Newspaper, History, GraduationCap, Wrench } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { CtaBand } from "@/components/marketing/cta-band";
import { Section } from "@/components/primitives/section";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/docs")({
  head: () => pageHead({
    title: "Docs & Resources — Dockier",
    description: "Documentation, API reference, guides, tutorials, blog, and changelog for the Dockier platform.",
  }),
  component: DocsPage,
});

const cards = [
  { i: Book, t: "Documentation", b: "Concepts, configuration, and architecture.", to: "/docs" },
  { i: Code2, t: "API reference", b: "REST + GraphQL endpoints with example payloads.", to: "/docs" },
  { i: GraduationCap, t: "Guides", b: "End-to-end setups for common workflows.", to: "/docs" },
  { i: Wrench, t: "Tutorials", b: "Build real integrations step by step.", to: "/docs" },
  { i: Newspaper, t: "Blog", b: "Engineering, security research, and product updates.", to: "/blog" },
  { i: History, t: "Changelog", b: "Every release, every week.", to: "/changelog" },
] as const;

function DocsPage() {
  return (
    <PageShell
      eyebrow="Resources"
      title={<>Learn the platform <span className="text-gradient-primary">deeply.</span></>}
      description="Docs, API references, guides, and tutorials — written by the team that built it."
    >
      <Section>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <Link
              key={c.t}
              to={c.to}
              className="group rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur transition-all hover:border-primary/40"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                <c.i className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold">{c.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.b}</p>
            </Link>
          ))}
        </div>
      </Section>
      <CtaBand />
    </PageShell>
  );
}