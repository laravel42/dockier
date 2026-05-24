import {
  Shield,
  Sparkles,
  GitBranch,
  Database,
  Wrench,
  Rocket,
  type LucideIcon,
} from "lucide-react";

export const site = {
  name: "Dockier",
  tagline: "Secure. Analyze. Deploy.",
  description:
    "AI-native DevSecOps for modern engineering teams. Connect repos, scan vulnerabilities, analyze architecture with AI, and ship secure code faster.",
  url: "https://dockier.dev",
  github: "https://github.com/laravel42/dockier",
  email: "hello@dockier.dev",
};

export const nav: ReadonlyArray<{ label: string; to: string }> = [
  { label: "Product", to: "/product" },
  { label: "Features", to: "/features" },
  { label: "Pricing", to: "/pricing" },
  { label: "Security", to: "/security" },
  { label: "Compare", to: "/compare" },
  { label: "Docs", to: "/docs" },
];

export type Feature = {
  id: string;
  icon: LucideIcon;
  title: string;
  blurb: string;
  bullets: ReadonlyArray<string>;
};

export const features: ReadonlyArray<Feature> = [
  {
    id: "ai-analysis",
    icon: Sparkles,
    title: "AI project analysis",
    blurb:
      "Auto-generated architecture docs, tech stack detection, and code-quality insights — refreshed per commit.",
    bullets: [
      "Tabbed Notion-style overview",
      "8 documentation sections",
      "Cached per commit, refresh on demand",
    ],
  },
  {
    id: "scanning",
    icon: Shield,
    title: "Security scanning",
    blurb:
      "Semgrep, SonarQube, and a custom rules engine across 10+ languages with severity grouping.",
    bullets: ["SQLi, XSS, command injection", "Custom org-wide rules", "One-click issue creation"],
  },
  {
    id: "sensitive-data",
    icon: Database,
    title: "Sensitive data detection",
    blurb:
      "Parses SQL, Prisma, Eloquent, TypeScript, and Python schemas to classify PII, sensitive, and secret fields.",
    bullets: ["Schema-aware (no AI guessing)", "Grouped by entity", "Severity tiers built in"],
  },
  {
    id: "dependencies",
    icon: GitBranch,
    title: "Dependency intelligence",
    blurb:
      "Reads package.json, composer.json, requirements.txt, Gemfile and checks against the OSV.dev database.",
    bullets: ["Free, no API key", "Production vs dev filtering", "CVE severity grouping"],
  },
  {
    id: "remediation",
    icon: Wrench,
    title: "AI remediation",
    blurb:
      "Generate fix merge requests directly from findings. Assign reviewers, ship without leaving the platform.",
    bullets: ["AI-generated patches", "PR with reviewer assignment", "Effort estimates per fix"],
  },
  {
    id: "deploy",
    icon: Rocket,
    title: "Deployments",
    blurb:
      "Branch-based deploys to AWS and GCP with full history, docker image tracking, and rollback.",
    bullets: ["AWS + GCP providers", "Per-branch pipelines", "Deploy history and rollback"],
  },
];

export const stats: ReadonlyArray<{ value: string; label: string }> = [
  { value: "2.4M+", label: "Repos scanned" },
  { value: "180k", label: "Vulnerabilities fixed" },
  { value: "94k", label: "Deployments automated" },
  { value: "12.6k", label: "AI analyses generated" },
];

export const ecosystem: ReadonlyArray<string> = [
  "GitHub",
  "GitLab",
  "Bitbucket",
  "AWS",
  "GCP",
  "Jira",
  "Linear",
  "Slack",
  "Semgrep",
  "SonarQube",
  "OSV.dev",
  "OpenAI",
  "Docker",
  "Kubernetes",
];

export const steps = [
  {
    n: "01",
    title: "Connect repository",
    body: "Link GitHub, GitLab, or Bitbucket. Branch tracking and tech stack detection start immediately.",
  },
  {
    n: "02",
    title: "Analyze & scan",
    body: "Semgrep, SonarQube, custom rules, OSV.dev, and AI architecture analysis run on every commit.",
  },
  {
    n: "03",
    title: "Fix with AI",
    body: "Generate remediation PRs from findings. Assign reviewers. Track effort and severity in one queue.",
  },
  {
    n: "04",
    title: "Deploy securely",
    body: "Promote a verified commit to AWS or GCP with branch-based pipelines and full rollback.",
  },
] as const;

export const pricing = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    blurb: "Personal projects and open source.",
    features: [
      "1 user",
      "3 repositories",
      "100 scans / month",
      "OSV.dev dependency scanning",
      "Community support",
    ],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/ user / month",
    blurb: "Growing teams shipping production software.",
    features: [
      "Unlimited repositories",
      "1000 scans / month",
      "AI analysis + remediation (5k credits)",
      "AWS + GCP deployments",
      "Jira, Linear, Slack integrations",
      "RBAC + 2FA",
    ],
    cta: "Start 14-day trial",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "annual",
    blurb: "Security-critical orgs with compliance needs.",
    features: [
      "Everything in Pro",
      "SSO / SAML",
      "Self-hosted option",
      "Audit logs + SOC 2 reports",
      "Custom rule packs",
      "Dedicated support + SLA",
    ],
    cta: "Contact sales",
    highlight: false,
  },
] as const;

export const comparison = {
  rows: [
    {
      feature: "AI architecture documentation",
      us: true,
      snyk: false,
      ghas: false,
      sonar: false,
      gitlab: false,
    },
    {
      feature: "AI-generated remediation PRs",
      us: true,
      snyk: "partial",
      ghas: "partial",
      sonar: false,
      gitlab: "partial",
    },
    {
      feature: "Sensitive data detection (schema)",
      us: true,
      snyk: false,
      ghas: false,
      sonar: false,
      gitlab: false,
    },
    {
      feature: "Dependency vulnerability scanning",
      us: true,
      snyk: true,
      ghas: true,
      sonar: false,
      gitlab: true,
    },
    {
      feature: "SAST across 10+ languages",
      us: true,
      snyk: true,
      ghas: true,
      sonar: true,
      gitlab: true,
    },
    {
      feature: "Deployment automation",
      us: true,
      snyk: false,
      ghas: false,
      sonar: false,
      gitlab: true,
    },
    {
      feature: "Self-hosted option",
      us: true,
      snyk: false,
      ghas: false,
      sonar: true,
      gitlab: true,
    },
    {
      feature: "Unified UX across security + deploy",
      us: true,
      snyk: false,
      ghas: false,
      sonar: false,
      gitlab: "partial",
    },
  ],
} as const;
