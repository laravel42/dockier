import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/primitives/section";
import { pageHead } from "@/lib/seo";
import { blogPosts } from "@/lib/blog";

export const Route = createFileRoute("/blog")({
  head: () => ({
    ...pageHead({
      path: "/blog",
      title: "Blog — Dockier",
      description: "Engineering deep-dives, security research, and product updates from the team building Dockier.",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Dockier Blog",
          url: "https://dockier.dev/blog",
          blogPost: blogPosts.map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            datePublished: p.date,
            url: `https://dockier.dev/blog/${p.slug}`,
          })),
        }),
      },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  return (
    <PageShell
      eyebrow="Blog"
      title={<>Notes from <span className="text-gradient-primary">the platform.</span></>}
      description="Engineering deep-dives, security research, and product updates."
    >
      <Section>
        <div className="mx-auto grid max-w-4xl gap-4">
          {blogPosts.map((p) => (
            <Link
              key={p.slug}
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className="group block rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur transition-all hover:border-primary/40"
            >
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-primary">{p.tag}</span>
                <span>{p.date}</span>
              </div>
              <h3 className="mt-3 font-display text-2xl font-semibold transition-colors group-hover:text-primary">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
            </Link>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}