type Meta = {
  title?: string;
  name?: string;
  property?: string;
  content?: string;
  charSet?: string;
};

export function pageHead(opts: { title: string; description: string; path?: string }): {
  meta: Array<Meta>;
} {
  const { title, description } = opts;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
  };
}
