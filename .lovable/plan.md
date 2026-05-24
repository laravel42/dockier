
# Dockier SEO upgrade plan

Scope: the 21 findings in section **1. SEO & Technical SEO** of the audit, plus the SEO-adjacent new findings F#151, F#152, F#159. Sequenced by impact × effort. Resolved items (F#1, F#2, F#3) are excluded.

---

## Phase 1 — Crawl & indexation fundamentals (≈1 day)

The foundation. Without these, every other SEO effort under-delivers.

1. **Canonical tags on every leaf route** (F#4)
   - Extend `src/lib/seo.ts › pageHead()` to accept a `path` and emit `<link rel="canonical" href="https://dockier.dev{path}">`.
   - Add only on leaves — never in `__root.tsx` (TanStack concatenates `links`, so a root canonical would duplicate).
   - Pass `path` from each route's `head()`.

2. **`og:url` site-wide** (F#6)
   - Same `pageHead()` helper emits `<meta property="og:url" content="https://dockier.dev{path}">`.

3. **Fix `pageHead()` clobbering `og:image`** (F#5)
   - Either keep `og:image` only in `__root.tsx` (it merges via meta dedupe), or move it into `pageHead()` with a per-route override.

4. **Self-host OG image + per-route variants** (F#7, F#151)
   - Ship `/public/og-default.png` (1200×630) baked into the repo.
   - Generate per-route OG images for `/demo`, `/privacy`, `/terms`, `/pricing`, `/features`, `/compare`, top blog posts. Use `@vercel/og`-style templated PNG generation in a server route.

5. **Favicon set + manifest + theme-color** (F#8, F#9)
   - Generate full set: 16/32/192/512 PNG, SVG, apple-touch-icon, maskable.
   - Declare in `__root.tsx › links`. Add `manifest.webmanifest`.
   - Add `<meta name="theme-color" content="#221c16">`.

6. **Add blog posts to sitemap** (F#152)
   - In `src/routes/sitemap[.]xml.ts`, walk `src/lib/blog.ts` and emit one `<url>` per slug with the post date as `lastmod`.

---

## Phase 2 — Structured data (≈1 day)

Highest ROI for rich results.

7. **Root: Organization + WebSite JSON-LD** (F#11)
   - The current `__root.tsx` already has one — verify it includes `logo`, `sameAs`, `potentialAction` (SearchAction on WebSite if applicable).

8. **Pricing: FAQPage JSON-LD** (F#12)
   - `pricing.tsx` already iterates a `faqs` array — already done per current code. Verify it's still present and complete.

9. **Home: SoftwareApplication / Product JSON-LD** (F#11)
   - Emit on `/` with `name`, `applicationCategory: "DeveloperApplication"`, `offers` (link to /pricing).

10. **Blog posts: Article JSON-LD** (F#11, F#16)
    - In `src/routes/blog_.$slug.tsx`, emit Article with `headline`, `datePublished`, `author`, `image` (per-post OG).

11. **Compare: BreadcrumbList + per-competitor anchors** (F#13)
    - Add `#dockier-vs-snyk`, `#dockier-vs-github-advanced-security`, `#dockier-vs-sonarqube`, `#dockier-vs-gitlab` anchors with H2s for long-tail.
    - Emit BreadcrumbList JSON-LD: Home → Compare.

12. **Interior pages: BreadcrumbList** (F#13)
    - Same on `/features`, `/pricing`, `/security`, `/product`.

---

## Phase 3 — On-page content & metadata polish (≈half-day)

13. **Unique 150–160 char meta descriptions per page** (F#20)
    - Rewrite descriptions in each route's `pageHead()` so no two pages share boilerplate.

14. **Standardize title format** (F#19)
    - Pick one: `{Page} — Dockier` (em-dash). Update `/compare` to match.

15. **Add per-competitor sections to `/compare`** (F#13)
    - Each section: 2–3 paragraph comparison with a "when to choose X" note. Cite competitor product pages (also resolves F#52 trust concern).

---

## Phase 4 — Internal linking & content surface (≈half-day)

16. **Hub-and-spoke linking from `/pricing` and `/compare`** (F#18)
    - Add contextual inline links: feature names link to `/features#capability`, comparison rows link to the matching feature page.
    - Add "See AI remediation in action →" cross-links between Features → Product, Compare → Pricing.

17. **Replace PNG mark with inline SVG** (F#159, mirror of F#69)
    - Inline `dockier-mark.svg`; remove the modulepreload `<link rel="preload" as="image">` for the PNG.

18. **Changelog RSS or remove the promise** (F#17)
    - Add `src/routes/changelog[.]xml.ts` emitting RSS 2.0, and `<link rel="alternate" type="application/rss+xml">` in changelog's `head()`.
    - Cheapest: remove the "Subscribe via RSS" line.

---

## Phase 5 — Niceties (≈XS each)

19. **`og:locale=en_US`, document hreflang policy** (F#10)
20. **Document em-dash + title convention** in `CONTRIBUTING.md` (F#145, F#19)

---

## Out of scope (covered elsewhere in the audit)

- Lead-form wiring (F#98, F#99) — CRO, but the most urgent business item per the audit's bottom line.
- Stats strip fabrication (F#46) — trust, not SEO.
- FastAPI vs Encore narrative (F#49, F#153) — content consistency.

These should be triaged in parallel; they don't belong in the SEO plan but they affect whether SEO traffic converts.

---

## Suggested execution order

| Day | Work |
|---|---|
| 1 | Phase 1 (canonical, og:url, og:image merge, favicons, sitemap blog posts) |
| 2 | Phase 1 OG image generator + Phase 2 (JSON-LD: Organization, SoftwareApplication, Article, FAQPage, BreadcrumbList) |
| 3 | Phase 3 + Phase 4 (descriptions, titles, /compare sections, internal links, SVG mark) |
| 4 | Phase 5 + RSS feed + verify in Search Console (request indexation, check rich-result eligibility) |

Total: ~4 working days for one engineer.

## Technical notes

- TanStack Router merges `meta` by name/property but **concatenates `links`** — keep canonical on leaves only.
- OG image generation should run as a TanStack server route under `/api/og/*` returning `image/png`. Cache aggressively via `Cache-Control: public, max-age=31536000, immutable` keyed by path hash.
- Use `head: ({ loaderData }) => ...` for dynamic routes (blog posts) so Article JSON-LD pulls real post data.
- After shipping, trigger an SEO rescan in the SEO & AI search tab and submit the sitemap in Google Search Console.
