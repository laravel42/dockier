## Dockier Marketing Site — Build Plan

A premium, dark-first marketing site for Dockier positioned as the AI-native DevSecOps platform. Investor-ready, launch-ready, fully responsive, SEO-optimized.

### Stack note (important)
Your brief specifies Next.js App Router, but this project is built on **TanStack Start** (the Lovable default full-stack React framework). I'll build the same site with equivalent capabilities:
- TanStack Start file-based routing (replaces Next App Router)
- TypeScript, Tailwind CSS v4, shadcn/ui — as requested
- Framer Motion for animation — as requested
- Per-route SSR `head()` metadata for SEO/OpenGraph (equivalent to Next metadata)

If you specifically need Next.js, say so and I'll flag that as a stack migration instead.

---

### Sitemap (TanStack routes under `src/routes/`)

```
/                  index.tsx          Landing
/features          features.tsx       Full feature breakdown
/product           product.tsx        Interactive product showcase
/pricing           pricing.tsx        Plans + FAQ
/security          security.tsx       Trust, compliance, architecture
/docs              docs.tsx           Docs/resources hub
/changelog         changelog.tsx      Release notes
/blog              blog.tsx           Blog index (placeholder posts)
/compare           compare.tsx        Vs Snyk / GHAS / SonarQube / GitLab
/contact           contact.tsx        Demo request + email capture
```

Each route gets distinct `head()` with title, description, og:title, og:description, twitter card. Single H1 per page. JSON-LD `Organization` + `SoftwareApplication` on `/`.

---

### Landing page sections (`/`)

1. **Sticky nav** — logo, links (Product, Features, Pricing, Security, Docs, Compare), GitHub stars button, "Book demo", "Start free"
2. **Hero** — headline "AI-native DevSecOps for modern engineering teams", subcopy, dual CTA, animated dashboard mockup with floating cards (scan findings, AI analysis snippet, deployment status), grid + gradient orb background
3. **Trusted by** — marquee of provider/ecosystem logos (GitHub, GitLab, Bitbucket, AWS, GCP, Jira, Linear, Slack, Semgrep, SonarQube, OSV.dev) + 4 stat counters
4. **Feature pillars** — 7 cards: AI Project Analysis, Security Scanning, Sensitive Data Detection, Dependency Intelligence, AI Remediation, Deployments, Team Collaboration
5. **Interactive product showcase** — tabbed/scroll-pinned mockups mirroring uploaded screenshots (dashboard, scan results, project detail w/ overview tabs, settings security tools, new project modal)
6. **How it works** — 4-step animated flow: Connect → Analyze & Scan → Fix with AI → Deploy
7. **Developer experience** — terminal block, code snippets, "API-first / microservices / OpenAI / self-hostable" callouts
8. **Comparison teaser** — condensed table → link to `/compare`
9. **Pricing teaser** — 3 cards → link to `/pricing`
10. **Security & trust strip** — compliance badges + link to `/security`
11. **CTA footer band** — "Start securing your repositories with AI." + email capture + GitHub + Demo
12. **Footer** — full sitemap, social, legal

---

### Component architecture

```
src/
  routes/                     page routes (above)
  components/
    layout/
      site-header.tsx
      site-footer.tsx
      mobile-nav.tsx
    marketing/
      hero.tsx
      dashboard-mockup.tsx        floating UI cards, glow
      logo-marquee.tsx
      stat-counter.tsx
      feature-grid.tsx
      feature-card.tsx
      product-showcase.tsx        tabbed screenshots
      how-it-works.tsx
      dx-section.tsx              terminal + code
      comparison-table.tsx
      pricing-cards.tsx
      cta-band.tsx
      faq.tsx
    primitives/
      glow-orb.tsx
      grid-bg.tsx
      gradient-border.tsx
      terminal-block.tsx
      severity-badge.tsx
      scan-finding-card.tsx
      glass-panel.tsx
      section.tsx
    ui/                        shadcn (existing)
  lib/
    seo.ts                     head() helper
    site.ts                    nav, pricing, features data
  assets/                      generated illustrations + logo
```

---

### Design system (`src/styles.css`)

Tokens (oklch), all dark-first with light fallback:
- `--background` deep navy/near-black, `--surface` glass panel, `--surface-elev`
- `--primary` teal/cyan accent, `--primary-glow` brighter cyan for glows
- Severity: `--sev-critical`, `--sev-high`, `--sev-medium`, `--sev-low`, `--sev-info`
- Gradients: `--gradient-hero`, `--gradient-border`, `--gradient-primary`
- Shadows: `--shadow-glow`, `--shadow-elevated`, `--shadow-panel`
- Radii scale, spacing rhythm

Typography:
- Display: a distinctive serif-display pairing (e.g., Fraunces) for hero/H1 to mirror the "Welcome back / Dockier" wordmark feel from your screenshots
- UI/body: Geist or Inter Tight
- Mono: JetBrains Mono for terminals/code

Reusable variants (cva): `Button` (primary glow / ghost / outline / link), `Card` (glass / bordered-glow), `Badge` (severity), `Tab` (pill underlined).

Motion guidelines (Framer Motion):
- Page section reveal: fade+rise 12px, 400ms, ease-out, stagger 60ms
- Hero mockup: floating cards y±8px loop, glow pulse 4s
- Hover: scale 1.02 + glow on primary surfaces
- Respect `prefers-reduced-motion`

---

### Visuals
- Generate logo (D mark with crescent, teal) and a few hero/dashboard illustration assets via image gen (transparent PNGs for logo, JPG for hero panels). Mockups for screenshots will be styled HTML/CSS recreations of the uploaded UI rather than using the raw uploads.

### SEO
- Per-route `head()`, single H1, semantic landmarks, alt text, canonical, JSON-LD on `/`, sitemap.xml + robots.txt in `public/`, OG image generated per page family.

### Accessibility
- WCAG AA contrast in dark theme, focus-visible rings (teal), keyboard-navigable nav/tabs, aria-labels on icon buttons, reduced-motion fallback, skip-to-content.

### Out of scope (this pass)
- Real auth, waitlist persistence (form posts to a stub server function returning success), CMS for blog/changelog (static placeholder entries), live GitHub stars (static number).

---

### Deliverable
A complete, production-shaped marketing site you can publish immediately, with all 10 pages scaffolded, the landing page fully designed and animated, and a documented design system ready to extend.