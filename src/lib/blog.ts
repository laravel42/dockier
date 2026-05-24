export type BlogPost = {
  slug: string;
  title: string;
  tag: string;
  date: string;
  excerpt: string;
  author: string;
  readTime: string;
  content: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "rebuilt-scanner-on-encore",
    title: "Why we rebuilt our scanner on Encore.ts",
    tag: "Engineering",
    date: "12 May 2026",
    excerpt:
      "From a Node monolith to typed microservices in six weeks. What we learned, what broke, and what we'd do again.",
    author: "Marta Lindqvist",
    readTime: "8 min read",
    content: [
      "Our original scanner was a single Node.js process that did everything: cloning repositories, running Semgrep, parsing dependency manifests, and writing results to Postgres. It worked, until it didn't. As traffic grew past a few hundred scans an hour, cold starts, memory pressure, and a tangle of implicit contracts between modules made every deploy a small adventure.",
      "We picked Encore.ts because it gave us typed service boundaries without forcing us into a heavyweight RPC framework. Each scanner stage — fetch, analyse, persist — became its own service with an explicit input and output schema. The compiler now catches the kind of drift that used to surface as a 3am pager.",
      "The migration took six weeks end to end. The first two were spent untangling shared state we didn't realise we had. The next three were a steady port, one stage at a time, behind a feature flag. The final week was load testing and cleanup.",
      "What broke: our assumption that 'just add a queue' would fix backpressure. It didn't. What worked: pushing schema validation to the edge of each service, so a malformed payload fails fast instead of corrupting downstream state.",
      "Would we do it again? Yes — but we'd start with the service boundaries on day one, not after the monolith had already grown a personality.",
    ],
  },
  {
    slug: "ai-remediation-a-year-in",
    title: "AI remediation in production: a year in",
    tag: "Product",
    date: "28 April 2026",
    excerpt:
      "180,000 fixes shipped. Here's the data on accuracy, false positives, and developer trust.",
    author: "Jonas Becker",
    readTime: "6 min read",
    content: [
      "A year ago we shipped AI-assisted remediation behind a small green button on every finding. Today it has produced just over 180,000 suggested fixes across our customer base, and we have enough signal to talk honestly about what works.",
      "Accuracy on the first try sits at 71% for dependency upgrades and 58% for code-level fixes. Those numbers sound modest until you compare them to the baseline: a human engineer triaging the same finding cold takes, on average, eleven minutes to produce a comparable patch.",
      "False positives are the interesting story. The model is confident in ways that don't always match reality, so we wrap every suggestion in a diff preview and require an explicit approval. Trust is built by making it easy to say no.",
      "The biggest surprise: developers don't want the AI to 'just fix it'. They want a strong first draft they can edit. We rebuilt the flow around that insight and saw adoption double in a quarter.",
    ],
  },
  {
    slug: "sensitive-data-without-ai",
    title: "Detecting sensitive data without AI",
    tag: "Security",
    date: "14 April 2026",
    excerpt:
      "How a deterministic schema parser outperformed an LLM on PII classification — and why we still use both.",
    author: "Priya Raman",
    readTime: "5 min read",
    content: [
      "When we started building our sensitive data scanner, the obvious answer was to throw an LLM at it. Feed in a schema, get back a classification. It worked, and it was expensive, slow, and occasionally wrong in ways that were hard to explain to an auditor.",
      "We rebuilt it as a deterministic parser that reads migration files and ORM models, normalises column names, and matches against a curated dictionary of PII patterns. It runs in milliseconds, costs nothing per scan, and produces results we can point at line numbers in source.",
      "On a benchmark of 12,000 columns across 40 real repositories, the deterministic parser beat the LLM on precision (98% vs 91%) and tied on recall. The LLM still wins on novel field names — anything we haven't seen before.",
      "So we run both. The parser handles the 95% case for free, and the LLM gets called only for the long tail. Customers get fast, cheap, explainable results, and we don't burn AI credits on `created_at`.",
    ],
  },
  {
    slug: "osv-dependency-scanner",
    title: "OSV.dev: the dependency scanner you already have",
    tag: "Security",
    date: "02 April 2026",
    excerpt:
      "Free, open, and surprisingly fast. A tour of the OSV ecosystem and how Dockier integrates it.",
    author: "Elena Costa",
    readTime: "7 min read",
    content: [
      "OSV.dev is the best-kept secret in software supply chain security. It's a free, open vulnerability database run by Google with a clean batch API, sub-second response times, and coverage that rivals any commercial offering.",
      "We integrated OSV as our primary dependency vulnerability source about eighteen months ago. The batch endpoint lets us check thousands of packages in a single round trip, which means a typical scan finishes in under two seconds even for repositories with deep dependency trees.",
      "The data model is also pleasant to work with: every advisory has a structured affected-ranges field, so we can answer 'is this version vulnerable?' without parsing semver ranges by hand.",
      "If you're building anything in this space and reaching for a paid feed first, try OSV. You'll be surprised how far it gets you.",
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}