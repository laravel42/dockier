import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://dockier.dev";

const releases = [
  {
    v: "v1.8.0",
    date: "2026-05-01",
    items: [
      "AI architecture analysis now refreshes incrementally per commit.",
      "New: Linear integration with effort estimates.",
      "Sensitive data scanner adds Eloquent and Pydantic support.",
    ],
  },
  {
    v: "v1.7.0",
    date: "2026-04-01",
    items: [
      "AWS blue-green deploys reach GA.",
      "Custom rules engine now supports regex captures.",
      "Audit log export to S3 / GCS.",
    ],
  },
  {
    v: "v1.6.0",
    date: "2026-03-01",
    items: [
      "OSV.dev dependency scanning ships free for all plans.",
      "Project overview adds Code Quality and Deployment tabs.",
      "RBAC: custom roles with fine-grained scopes.",
    ],
  },
];

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const Route = createFileRoute("/changelog.xml")({
  server: {
    handlers: {
      GET: async () => {
        const items = releases
          .map((r) => {
            const description = `<ul>${r.items.map((i) => `<li>${escapeXml(i)}</li>`).join("")}</ul>`;
            const pubDate = new Date(r.date).toUTCString();
            return [
              `    <item>`,
              `      <title>${escapeXml(`Dockier ${r.v}`)}</title>`,
              `      <link>${BASE_URL}/changelog#${r.v}</link>`,
              `      <guid isPermaLink="false">dockier-${r.v}</guid>`,
              `      <pubDate>${pubDate}</pubDate>`,
              `      <description><![CDATA[${description}]]></description>`,
              `    </item>`,
            ].join("\n");
          })
          .join("\n");

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">`,
          `  <channel>`,
          `    <title>Dockier Changelog</title>`,
          `    <link>${BASE_URL}/changelog</link>`,
          `    <atom:link href="${BASE_URL}/changelog.xml" rel="self" type="application/rss+xml" />`,
          `    <description>Every Dockier release — new features, fixes, and platform improvements.</description>`,
          `    <language>en-us</language>`,
          items,
          `  </channel>`,
          `</rss>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});