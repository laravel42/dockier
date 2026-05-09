import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/primitives/section";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/blog")({
  head: () => pageHead({
    title: "Blog — Dockier",
    description: "Engineering, security research, and product updates from the Dockier team.",
  }),
  component: BlogPage,
});

const posts = [
  { title: "Why we rebuilt our scanner on Encore.ts", tag: "Engineering", date: "12 May 2026", excerpt: "From a Node monolith to typed microservices in six weeks. What we learned, what broke, and what we'd do again." },
  { title: "AI remediation in production: a year in", tag: "Product", date: "28 April 2026", excerpt: "180,000 fixes shipped. Here's the data on accuracy, false positives, and developer trust." },
  { title: "Detecting sensitive data without AI", tag: "Security", date: "14 April 2026", excerpt: "How a deterministic schema parser outperformed an LLM on PII classification — and why we still use both." },
  { title: "OSV.dev: the dependency scanner you already have", tag: "Security", date: "02 April 2026", excerpt: "Free, open, and surprisingly fast. A tour of the OSV ecosystem and how Dockier integrates it." },
];

function BlogPage() {
  return (
    <PageShell
      eyebrow="Blog"
      title={<>Notes from <span className="text-gradient-primary">the platform.</span></>}
      description="Engineering deep-dives, security research, and product updates."
    >
      <Section>
        <div className="mx-auto grid max-w-4xl gap-4">
          {posts.map((p) => (
            <article key={p.title} className="group rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur transition-all hover:border-primary/40">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-primary">{p.tag}</span>
                <span>{p.date}</span>
              </div>
              <h3 className="mt-3 font-display text-2xl font-semibold transition-colors group-hover:text-primary">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
            </article>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}