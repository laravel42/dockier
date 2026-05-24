type Meta = {
  title?: string;
  name?: string;
  property?: string;
  content?: string;
  charSet?: string;
};

type LinkTag = {
  rel: string;
  href: string;
  type?: string;
  title?: string;
};

type ScriptTag = {
  type: string;
  children: string;
};

export type Breadcrumb = { name: string; path: string };

const SITE_URL = "https://dockier.dev";

export function pageHead(opts: {
  title: string;
  description: string;
  path?: string;
  ogType?: "website" | "article" | "product";
  image?: string;
  breadcrumbs?: Breadcrumb[];
}): {
  meta: Array<Meta>;
  links?: Array<LinkTag>;
  scripts?: Array<ScriptTag>;
} {
  const { title, description, path, ogType = "website", image, breadcrumbs } = opts;
  const url = path ? `${SITE_URL}${path}` : undefined;

  const meta: Meta[] = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: ogType },
    { property: "og:site_name", content: "Dockier" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];

  if (url) {
    meta.push({ property: "og:url", content: url });
  }

  if (image) {
    meta.push({ property: "og:image", content: image });
    meta.push({ name: "twitter:image", content: image });
  }

  const links: LinkTag[] = url ? [{ rel: "canonical", href: url }] : [];

  const scripts: ScriptTag[] = [];
  if (breadcrumbs && breadcrumbs.length > 0) {
    scripts.push({
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((b, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: b.name,
          item: `${SITE_URL}${b.path}`,
        })),
      }),
    });
  }

  return { meta, links, scripts };
}
