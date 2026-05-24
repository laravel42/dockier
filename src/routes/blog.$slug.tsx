import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/primitives/section";
import { pageHead } from "@/lib/seo";
import { getPostBySlug, blogPosts } from "@/lib/blog";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => {
    const post = params?.slug ? getPostBySlug(params.slug) : undefined;
    return pageHead({
      title: post ? `${post.title} — Dockier blog` : "Blog — Dockier",
      description: post?.excerpt ?? "Dockier blog post.",
    });
  },
  loader: ({ params }) => {
    const post = getPostBySlug(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  component: BlogPostPage,
});

function BlogPostPage() {
  const { post } = Route.useLoaderData();
  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <PageShell
      eyebrow={post.tag}
      title={post.title}
      description={`${post.author} · ${post.date} · ${post.readTime}`}
    >
      <Section>
        <div className="mx-auto max-w-3xl">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to blog
          </Link>

          <article className="mt-8 space-y-6">
            {post.content.map((paragraph: string, idx: number) => (
              <p key={idx} className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                {paragraph}
              </p>
            ))}
          </article>

          {related.length > 0 && (
            <div className="mt-16 border-t border-border/50 pt-10">
              <h2 className="font-display text-2xl font-semibold">Keep reading</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => (
                  <Link
                    key={p.slug}
                    to="/blog/$slug"
                    params={{ slug: p.slug }}
                    className="group rounded-xl border border-border/50 bg-card/40 p-5 backdrop-blur transition-all hover:border-primary/40"
                  >
                    <span className="text-xs text-primary">{p.tag}</span>
                    <h3 className="mt-2 font-display text-base font-semibold transition-colors group-hover:text-primary">
                      {p.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </Section>
    </PageShell>
  );
}