import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/primitives/section";
import { pageHead } from "@/lib/seo";
import { getPostBySlug, blogPosts } from "@/lib/blog";

function jsxStyleToCss(jsx: string): string {
  // Convert `style={{ fontSize: "0.8rem", color: "#a89c8a" }}` → style="font-size:0.8rem;color:#a89c8a"
  return jsx.replace(/style=\{\{([^}]+)\}\}/g, (_m, body: string) => {
    const css = body
      .split(",")
      .map((pair) => {
        const [rawK, ...rest] = pair.split(":");
        if (!rawK || rest.length === 0) return "";
        const k = rawK.trim().replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
        const v = rest.join(":").trim().replace(/^["']|["']$/g, "");
        return `${k}:${v}`;
      })
      .filter(Boolean)
      .join(";");
    return `style="${css}"`;
  });
}

function renderInline(text: string): React.ReactNode {
  // Inline parser supporting **bold**, `code`, [text](url), *italic*.
  const nodes: React.ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*]+\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const t = m[0];
    if (t.startsWith("**")) {
      nodes.push(<strong key={key++} className="font-semibold text-foreground">{t.slice(2, -2)}</strong>);
    } else if (t.startsWith("`")) {
      nodes.push(<code key={key++} className="rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[0.85em]">{t.slice(1, -1)}</code>);
    } else if (t.startsWith("[")) {
      const lm = t.match(/^\[([^\]]+)\]\(([^)]+)\)$/)!;
      nodes.push(
        <a key={key++} href={lm[2]} className="text-primary underline-offset-4 hover:underline" target="_blank" rel="noreferrer">
          {lm[1]}
        </a>
      );
    } else {
      nodes.push(<em key={key++}>{t.slice(1, -1)}</em>);
    }
    last = m.index + t.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function renderBlock(block: string, idx: number) {
  if (block.startsWith("<figure")) {
    return (
      <figure
        key={idx}
        className="my-2 overflow-hidden rounded-xl border border-border/50 [&_svg]:h-auto [&_svg]:w-full"
        dangerouslySetInnerHTML={{ __html: jsxStyleToCss(block).replace(/^<figure>?/, "<div>").replace(/<\/figure>$/, "</div>") }}
      />
    );
  }
  if (block.startsWith("```")) {
    const lines = block.split("\n");
    const code = lines.slice(1, -1).join("\n");
    return (
      <pre key={idx} className="overflow-x-auto rounded-xl border border-border/50 bg-card/60 p-4 text-sm leading-relaxed">
        <code className="font-mono text-foreground/90">{code}</code>
      </pre>
    );
  }
  if (block.startsWith("### ")) {
    return (
      <h3 key={idx} className="font-display text-lg font-semibold text-foreground sm:text-xl">
        {renderInline(block.slice(4))}
      </h3>
    );
  }
  if (block.startsWith("## ")) {
    return (
      <h2 key={idx} className="font-display text-xl font-semibold text-foreground sm:text-2xl">
        {renderInline(block.slice(3))}
      </h2>
    );
  }
  if (block.startsWith("> ")) {
    return (
      <blockquote
        key={idx}
        className="border-l-2 border-primary/50 pl-4 text-base italic leading-relaxed text-muted-foreground sm:text-lg"
      >
        {renderInline(block.slice(2))}
      </blockquote>
    );
  }
  if (block.startsWith("- ")) {
    const items = block.split("\n").map((l) => l.replace(/^- /, ""));
    return (
      <ul key={idx} className="list-disc space-y-2 pl-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
        {items.map((it, i) => <li key={i}>{renderInline(it)}</li>)}
      </ul>
    );
  }
  return (
    <p key={idx} className="text-base leading-relaxed text-muted-foreground sm:text-lg">
      {renderInline(block)}
    </p>
  );
}

export const Route = createFileRoute("/blog_/$slug")({
  head: ({ params }) => {
    const post = params?.slug ? getPostBySlug(params.slug) : undefined;
    const slug = params?.slug ?? "";
    const base = pageHead({
      title: post ? `${post.title} — Dockier blog` : "Blog — Dockier",
      description: post?.excerpt ?? "Dockier blog post.",
      path: `/blog/${slug}`,
      ogType: "article",
    });
    if (!post) return base;
    return {
      ...base,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.excerpt,
            author: { "@type": "Person", name: post.author },
            datePublished: post.date,
            publisher: {
              "@type": "Organization",
              name: "Dockier",
              url: "https://dockier.dev",
            },
            mainEntityOfPage: `https://dockier.dev/blog/${slug}`,
          }),
        },
      ],
    };
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
            {post.content.map((block: string, idx: number) => renderBlock(block, idx))}
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