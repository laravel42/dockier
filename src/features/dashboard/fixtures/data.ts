export type Severity = "critical" | "high" | "medium" | "low" | "info";
export type DeployStatus = "success" | "failed" | "building" | "deploying" | "queued";
export type ScanStatus = "completed" | "running" | "failed";

export interface Project {
  id: string;
  name: string;
  repo: string;
  branch: string;
  provider: "github" | "gitlab" | "bitbucket";
  language: string;
  updatedAt: string;
  findings: number;
}

export interface Deployment {
  id: string;
  projectId: string;
  repo: string;
  branch: string;
  commit: string;
  status: DeployStatus;
  provider: "vercel" | "fly" | "railway" | "aws" | "gcp";
  createdAt: string;
  duration: number;
}

export interface ScanSummary {
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
  total: number;
}

export interface Scan {
  id: string;
  projectId: string;
  repo: string;
  branch: string;
  status: ScanStatus;
  createdAt: string;
  summary: ScanSummary;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  level: "info" | "warning" | "success" | "error";
  createdAt: string;
  read: boolean;
}

export const projects: Project[] = [
  {
    id: "p1",
    name: "edge-gateway",
    repo: "dockier/edge-gateway",
    branch: "main",
    provider: "github",
    language: "TypeScript",
    updatedAt: "2026-05-08T10:12:00Z",
    findings: 3,
  },
  {
    id: "p2",
    name: "billing-svc",
    repo: "dockier/billing-svc",
    branch: "main",
    provider: "github",
    language: "Go",
    updatedAt: "2026-05-07T16:40:00Z",
    findings: 0,
  },
  {
    id: "p3",
    name: "studio-web",
    repo: "dockier/studio-web",
    branch: "develop",
    provider: "gitlab",
    language: "TypeScript",
    updatedAt: "2026-05-06T09:22:00Z",
    findings: 11,
  },
  {
    id: "p4",
    name: "infra-terraform",
    repo: "dockier/infra",
    branch: "main",
    provider: "github",
    language: "HCL",
    updatedAt: "2026-05-05T14:01:00Z",
    findings: 2,
  },
  {
    id: "p5",
    name: "search-indexer",
    repo: "dockier/search-indexer",
    branch: "main",
    provider: "bitbucket",
    language: "Rust",
    updatedAt: "2026-05-04T08:30:00Z",
    findings: 1,
  },
];

export const deployments: Deployment[] = [
  {
    id: "d1",
    projectId: "p1",
    repo: "dockier/edge-gateway",
    branch: "main",
    commit: "9f3c1ab",
    status: "success",
    provider: "fly",
    createdAt: "2026-05-08T11:01:00Z",
    duration: 184,
  },
  {
    id: "d2",
    projectId: "p3",
    repo: "dockier/studio-web",
    branch: "develop",
    commit: "2b71e4d",
    status: "building",
    provider: "vercel",
    createdAt: "2026-05-08T10:48:00Z",
    duration: 0,
  },
  {
    id: "d3",
    projectId: "p2",
    repo: "dockier/billing-svc",
    branch: "main",
    commit: "ae0019c",
    status: "success",
    provider: "railway",
    createdAt: "2026-05-08T08:32:00Z",
    duration: 121,
  },
  {
    id: "d4",
    projectId: "p4",
    repo: "dockier/infra",
    branch: "main",
    commit: "1d77f02",
    status: "failed",
    provider: "aws",
    createdAt: "2026-05-07T22:15:00Z",
    duration: 56,
  },
  {
    id: "d5",
    projectId: "p5",
    repo: "dockier/search-indexer",
    branch: "main",
    commit: "c4e9b81",
    status: "success",
    provider: "gcp",
    createdAt: "2026-05-07T17:55:00Z",
    duration: 240,
  },
];

export const scans: Scan[] = [
  {
    id: "s1",
    projectId: "p3",
    repo: "dockier/studio-web",
    branch: "develop",
    status: "completed",
    createdAt: "2026-05-08T10:50:00Z",
    summary: { critical: 1, high: 3, medium: 4, low: 3, info: 0, total: 11 },
  },
  {
    id: "s2",
    projectId: "p1",
    repo: "dockier/edge-gateway",
    branch: "main",
    status: "completed",
    createdAt: "2026-05-08T09:12:00Z",
    summary: { critical: 0, high: 1, medium: 2, low: 0, info: 0, total: 3 },
  },
  {
    id: "s3",
    projectId: "p4",
    repo: "dockier/infra",
    branch: "main",
    status: "completed",
    createdAt: "2026-05-07T20:00:00Z",
    summary: { critical: 0, high: 0, medium: 1, low: 1, info: 0, total: 2 },
  },
  {
    id: "s4",
    projectId: "p2",
    repo: "dockier/billing-svc",
    branch: "main",
    status: "completed",
    createdAt: "2026-05-07T15:31:00Z",
    summary: { critical: 0, high: 0, medium: 0, low: 0, info: 0, total: 0 },
  },
  {
    id: "s5",
    projectId: "p5",
    repo: "dockier/search-indexer",
    branch: "main",
    status: "running",
    createdAt: "2026-05-08T11:10:00Z",
    summary: { critical: 0, high: 0, medium: 0, low: 0, info: 0, total: 0 },
  },
];

export const notifications: NotificationItem[] = [
  {
    id: "n1",
    title: "Critical finding in studio-web",
    body: "Hardcoded JWT secret detected in src/lib/auth.ts",
    level: "error",
    createdAt: "2026-05-08T10:55:00Z",
    read: false,
  },
  {
    id: "n2",
    title: "Deployment failed",
    body: "infra-terraform deploy to AWS exited with code 1",
    level: "error",
    createdAt: "2026-05-07T22:16:00Z",
    read: false,
  },
  {
    id: "n3",
    title: "Scan completed",
    body: "billing-svc: no findings",
    level: "success",
    createdAt: "2026-05-07T15:32:00Z",
    read: true,
  },
  {
    id: "n4",
    title: "New team member",
    body: "marco@dockier.dev joined the workspace",
    level: "info",
    createdAt: "2026-05-06T09:00:00Z",
    read: true,
  },
];

export interface Commit {
  sha: string;
  message: string;
  author: string;
  authorEmail: string;
  createdAt: string;
}

export interface Contributor {
  name: string;
  email: string;
  commits: number;
}

export const commitsByProject: Record<string, Commit[]> = {
  p1: [
    {
      sha: "9f3c1ab",
      message: "feat(gateway): adaptive rate limiter per token bucket",
      author: "Sara Conti",
      authorEmail: "sara@dockier.dev",
      createdAt: "2026-05-08T10:48:00Z",
    },
    {
      sha: "7d22f10",
      message: "fix: drop stale upstream connections after 30s idle",
      author: "Marco Rossi",
      authorEmail: "marco@dockier.dev",
      createdAt: "2026-05-08T08:14:00Z",
    },
    {
      sha: "1abf402",
      message: "chore: bump deps and pin tokio to 1.39",
      author: "Sara Conti",
      authorEmail: "sara@dockier.dev",
      createdAt: "2026-05-07T17:02:00Z",
    },
    {
      sha: "b3f8c11",
      message: "docs: clarify TLS termination flow",
      author: "Lia Greco",
      authorEmail: "lia@dockier.dev",
      createdAt: "2026-05-06T11:33:00Z",
    },
  ],
  p2: [
    {
      sha: "ae0019c",
      message: "feat(billing): prorated upgrades on annual plans",
      author: "Marco Rossi",
      authorEmail: "marco@dockier.dev",
      createdAt: "2026-05-08T08:20:00Z",
    },
    {
      sha: "5fe61aa",
      message: "test: cover edge cases in coupon stacking",
      author: "Lia Greco",
      authorEmail: "lia@dockier.dev",
      createdAt: "2026-05-07T14:11:00Z",
    },
  ],
  p3: [
    {
      sha: "2b71e4d",
      message: "feat(studio): inline diff viewer for fix suggestions",
      author: "Sara Conti",
      authorEmail: "sara@dockier.dev",
      createdAt: "2026-05-08T10:42:00Z",
    },
    {
      sha: "8aa1c20",
      message: "refactor: collapse provider list into composable",
      author: "Lia Greco",
      authorEmail: "lia@dockier.dev",
      createdAt: "2026-05-07T19:55:00Z",
    },
    {
      sha: "0b91ee7",
      message: "fix: dark mode contrast on severity chips",
      author: "Marco Rossi",
      authorEmail: "marco@dockier.dev",
      createdAt: "2026-05-06T16:20:00Z",
    },
  ],
  p4: [
    {
      sha: "1d77f02",
      message: "infra: bump RDS to t4g.medium across staging",
      author: "Marco Rossi",
      authorEmail: "marco@dockier.dev",
      createdAt: "2026-05-07T22:01:00Z",
    },
  ],
  p5: [
    {
      sha: "c4e9b81",
      message: "perf: parallel shard ingestion (4x throughput)",
      author: "Sara Conti",
      authorEmail: "sara@dockier.dev",
      createdAt: "2026-05-07T17:40:00Z",
    },
  ],
};

export const contributorsByProject: Record<string, Contributor[]> = {
  p1: [
    { name: "Sara Conti", email: "sara@dockier.dev", commits: 142 },
    { name: "Marco Rossi", email: "marco@dockier.dev", commits: 88 },
    { name: "Lia Greco", email: "lia@dockier.dev", commits: 24 },
  ],
  p2: [
    { name: "Marco Rossi", email: "marco@dockier.dev", commits: 96 },
    { name: "Lia Greco", email: "lia@dockier.dev", commits: 41 },
  ],
  p3: [
    { name: "Sara Conti", email: "sara@dockier.dev", commits: 187 },
    { name: "Lia Greco", email: "lia@dockier.dev", commits: 73 },
    { name: "Marco Rossi", email: "marco@dockier.dev", commits: 35 },
  ],
  p4: [{ name: "Marco Rossi", email: "marco@dockier.dev", commits: 28 }],
  p5: [{ name: "Sara Conti", email: "sara@dockier.dev", commits: 64 }],
};

export const projectDescriptions: Record<string, string> = {
  p1: "Edge HTTP gateway handling TLS termination, adaptive rate limiting and per-tenant routing for the Dockier platform. Written in TypeScript on Bun, deployed to Fly.io regions.",
  p2: "Subscription, invoicing and proration service. Integrates with Stripe and the internal usage meter. Go service with Postgres persistence.",
  p3: "Customer-facing studio UI: project workspaces, scan results, fix suggestions and deploy review. React + TanStack Start.",
  p4: "Terraform definitions for staging and production: VPC, RDS, S3, CloudFront, IAM. Reviewed via PR with policy-as-code checks.",
  p5: "Search indexer that ingests scan findings into the OpenSearch cluster with sharded parallel pipelines. Rust + Tokio.",
};

export interface Finding {
  id: string;
  scanId: string;
  severity: Severity;
  title: string;
  rule: string;
  category: "secrets" | "injection" | "auth" | "crypto" | "config" | "deps" | "logic";
  file: string;
  line: number;
  cwe?: string;
  description: string;
  remediation: string;
  snippet: string;
  status: "open" | "fixed" | "ignored";
}

export const findingsByScan: Record<string, Finding[]> = {
  s1: [
    {
      id: "f1",
      scanId: "s1",
      severity: "critical",
      title: "Hardcoded JWT signing secret",
      rule: "secrets/hardcoded-jwt",
      category: "secrets",
      file: "src/lib/auth.ts",
      line: 14,
      cwe: "CWE-798",
      description:
        "A JWT signing secret is committed to source. Anyone with repo access can mint valid tokens for any user.",
      remediation:
        "Move the secret into an environment variable and rotate the existing key. Add the env var to your deployment provider.",
      snippet: 'const JWT_SECRET = "super-prod-secret-2024";',
      status: "open",
    },
    {
      id: "f2",
      scanId: "s1",
      severity: "high",
      title: "SQL string concatenation in search",
      rule: "injection/sql-concat",
      category: "injection",
      file: "src/server/search.ts",
      line: 87,
      cwe: "CWE-89",
      description:
        "User-controlled input is concatenated into a SQL query, exposing the search endpoint to SQL injection.",
      remediation: "Use parameterised queries via the postgres client's tagged template form.",
      snippet: "await sql(`SELECT * FROM posts WHERE title LIKE '%${q}%'`);",
      status: "open",
    },
    {
      id: "f3",
      scanId: "s1",
      severity: "high",
      title: "Missing CSRF protection on POST handler",
      rule: "auth/missing-csrf",
      category: "auth",
      file: "src/routes/api/comments.ts",
      line: 22,
      description:
        "The mutation endpoint does not verify origin or a CSRF token, allowing cross-site requests to forge actions.",
      remediation:
        "Validate the Origin header against an allow-list or require a double-submit CSRF token.",
      snippet: "POST: async ({ request }) => { /* no origin check */ }",
      status: "open",
    },
    {
      id: "f4",
      scanId: "s1",
      severity: "high",
      title: "Weak password hashing (MD5)",
      rule: "crypto/weak-hash",
      category: "crypto",
      file: "src/server/users.ts",
      line: 41,
      cwe: "CWE-327",
      description:
        "Passwords are hashed with MD5, which is fast and broken. Stolen hashes can be cracked in minutes.",
      remediation: "Use argon2id (preferred) or bcrypt with a cost factor of at least 12.",
      snippet: "const hash = createHash('md5').update(password).digest('hex');",
      status: "open",
    },
    {
      id: "f5",
      scanId: "s1",
      severity: "medium",
      title: "Permissive CORS allow-origin",
      rule: "config/cors-wildcard",
      category: "config",
      file: "src/server.ts",
      line: 18,
      description:
        "Access-Control-Allow-Origin is set to '*' alongside credentials, leaking authenticated responses to any origin.",
      remediation:
        "Restrict the allow-list to known front-end origins and reflect a single value per request.",
      snippet: "headers: { 'Access-Control-Allow-Origin': '*' }",
      status: "open",
    },
    {
      id: "f6",
      scanId: "s1",
      severity: "medium",
      title: "Vulnerable dependency: lodash 4.17.20",
      rule: "deps/known-cve",
      category: "deps",
      file: "package.json",
      line: 31,
      cwe: "CWE-1104",
      description: "lodash 4.17.20 is affected by CVE-2021-23337 (command injection via template).",
      remediation: "Bump lodash to 4.17.21 or later, or replace with native equivalents.",
      snippet: '"lodash": "4.17.20"',
      status: "open",
    },
    {
      id: "f7",
      scanId: "s1",
      severity: "medium",
      title: "Insecure cookie: missing Secure flag",
      rule: "config/insecure-cookie",
      category: "config",
      file: "src/server/session.ts",
      line: 9,
      description: "Session cookie is set without Secure, allowing it to leak over plaintext HTTP.",
      remediation: "Set { secure: true, httpOnly: true, sameSite: 'lax' } on the cookie.",
      snippet: "setCookie('sid', token, { httpOnly: true })",
      status: "open",
    },
    {
      id: "f8",
      scanId: "s1",
      severity: "medium",
      title: "Verbose error responses",
      rule: "logic/error-leak",
      category: "logic",
      file: "src/server/index.ts",
      line: 102,
      description:
        "Stack traces are returned in API error responses, exposing file paths and library versions.",
      remediation:
        "Return a generic error message in production and log full traces server-side only.",
      snippet: "return Response.json({ error: err.stack });",
      status: "open",
    },
    {
      id: "f9",
      scanId: "s1",
      severity: "low",
      title: "Missing X-Content-Type-Options header",
      rule: "config/missing-header",
      category: "config",
      file: "src/server.ts",
      line: 12,
      description:
        "Responses do not set X-Content-Type-Options: nosniff, allowing MIME-sniffing attacks.",
      remediation: "Add the nosniff header in your default response headers.",
      snippet: "// no security headers configured",
      status: "open",
    },
    {
      id: "f10",
      scanId: "s1",
      severity: "low",
      title: "TODO comment with credentials hint",
      rule: "secrets/todo-credentials",
      category: "secrets",
      file: "src/server/legacy.ts",
      line: 4,
      description:
        "A TODO references hardcoded staging credentials. Even if removed, the hint helps targeted attacks.",
      remediation: "Delete the comment and audit git history for any leaked secrets.",
      snippet: "// TODO: use real creds, staging is admin/admin",
      status: "open",
    },
    {
      id: "f11",
      scanId: "s1",
      severity: "low",
      title: "Console logging of request bodies",
      rule: "logic/log-pii",
      category: "logic",
      file: "src/server/middleware.ts",
      line: 27,
      description:
        "Request bodies are logged at info level, potentially storing PII in plaintext logs.",
      remediation: "Redact known sensitive fields (email, password, token) before logging.",
      snippet: "console.log('req', JSON.stringify(req.body));",
      status: "open",
    },
  ],
  s2: [
    {
      id: "f20",
      scanId: "s2",
      severity: "high",
      title: "Open redirect via 'next' query param",
      rule: "auth/open-redirect",
      category: "auth",
      file: "src/routes/login.tsx",
      line: 38,
      cwe: "CWE-601",
      description:
        "After login, the user is redirected to an arbitrary URL provided in the query string.",
      remediation:
        "Validate that the redirect target is a relative path or matches an allow-listed origin.",
      snippet: "window.location = searchParams.get('next');",
      status: "open",
    },
    {
      id: "f21",
      scanId: "s2",
      severity: "medium",
      title: "TLS verification disabled in HTTP client",
      rule: "crypto/tls-disabled",
      category: "crypto",
      file: "src/server/upstream.ts",
      line: 12,
      description: "Upstream HTTP client ignores certificate errors, exposing traffic to MITM.",
      remediation: "Remove the rejectUnauthorized: false flag and pin the upstream CA if needed.",
      snippet: "new https.Agent({ rejectUnauthorized: false })",
      status: "open",
    },
    {
      id: "f22",
      scanId: "s2",
      severity: "medium",
      title: "Rate limiter bypass on /auth",
      rule: "logic/rate-bypass",
      category: "logic",
      file: "src/server/rate-limit.ts",
      line: 55,
      description:
        "Rate limiter keys requests by IP only, allowing distributed brute-force attacks.",
      remediation: "Combine IP with username and apply progressive delays after failed attempts.",
      snippet: "const key = req.ip;",
      status: "open",
    },
  ],
  s3: [
    {
      id: "f30",
      scanId: "s3",
      severity: "medium",
      title: "Public S3 bucket policy",
      rule: "config/s3-public",
      category: "config",
      file: "buckets.tf",
      line: 14,
      description:
        "Bucket policy grants s3:GetObject to '*', exposing all objects to the internet.",
      remediation: "Restrict the policy to known principals or use signed URLs.",
      snippet: 'principals { type = "*"; identifiers = ["*"] }',
      status: "open",
    },
    {
      id: "f31",
      scanId: "s3",
      severity: "low",
      title: "RDS without storage encryption",
      rule: "config/rds-encryption",
      category: "config",
      file: "rds.tf",
      line: 22,
      description:
        "RDS instance is created without storage_encrypted, leaving snapshots unencrypted at rest.",
      remediation: "Set storage_encrypted = true and provide a KMS key.",
      snippet: 'resource "aws_db_instance" "main" { /* no encryption */ }',
      status: "open",
    },
  ],
  s4: [],
  s5: [],
};
