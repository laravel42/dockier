# Dockier

> A developer platform that connects your source code to security scanning, AI analysis, deployments, and project management — from a single dashboard.

[![License](https://img.shields.io/badge/license-GPL--3.0-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-coming%20soon-orange.svg)]()
[![CI](https://img.shields.io/github/actions/workflow/status/laravel42/dockier/ci.yml?branch=main&label=ci&style=flat-square&logo=github)](https://github.com/laravel42/dockier/actions)
[![Codecov](https://img.shields.io/codecov/c/github/laravel42/dockier?logo=codecov&style=flat-square)](https://codecov.io/gh/laravel42/dockier)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org)

**Secure. Analyze. Deploy.**

Dockier brings together the tools developers need to ship secure code faster: connect GitHub, GitLab, or Bitbucket repositories and get automated security scanning, AI-powered project analysis, deployment pipelines, and project management — all from a single dashboard.

---

## Table of contents

1. [Features](#features)
2. [Project detail page](#project-detail-page)
3. [Architecture](#architecture)
4. [Screenshots](#screenshots)
5. [Contributing](#contributing)
6. [License](#license)

---

## Features

### Project management
Connect GitHub, GitLab, or Bitbucket repositories and organize them as projects with branch tracking, tech stack detection, recent commits, recent deploys, and deployment status at a glance.

### AI-powered project analysis
Automatically generates a comprehensive project overview using OpenAI (gpt-5.4-mini), including architecture documentation, tech stack breakdown, deployment guides, security considerations, and code quality insights — organized in a tabbed Notion-style interface with 8 sections (Overview, How It Works, Tech Stack, Architecture, Data & Storage, Code Quality, Security, Deployment). Analysis is cached per commit and refreshable on demand.

### Sensitive data scanner
Code-based scanner (no AI) that parses SQL migrations, Prisma schemas, PHP Eloquent models, TypeScript interfaces, and Python classes to detect personal, sensitive, and secret data fields. Classifies fields by sensitivity level and groups them by entity in an interactive sidebar view.

### Dependency vulnerability scanner
Parses `package.json`, `composer.json`, `requirements.txt`, and `Gemfile` to extract all dependencies. Checks each against the [OSV.dev](https://osv.dev) vulnerability database (free, no API key). Lists dependencies with version, status, ecosystem, repository link, and vulnerabilities grouped by severity. Filterable by production/dev/vulnerable.

### Security scanning
Run automated code analysis powered by Semgrep, SonarQube, and a built-in custom rules engine. Scans detect SQL injection, XSS, command injection, weak cryptography, path traversal, and dozens of other vulnerability classes across PHP, JavaScript, TypeScript, Python, Go, Java, Ruby, and more.

### AI-assisted remediation
Generate fix merge requests directly from scan findings using OpenAI-powered code suggestions. Assign reviewers and track fixes without leaving the platform.

### Issue tracking integration
Create issues in Jira, Linear, or other project management tools directly from security findings, with AI-generated titles, severity-based priority mapping, and effort estimates.

### Deployment automation
Configure server providers (AWS, GCP) and trigger deployments tied to specific branches and commits. Track deployment history per project with recent deploys showing status, provider, strategy, app URL, and docker image.

### Notifications
Multi-channel alerting via email, Slack, webhooks, and in-app notifications for scan results, deployments, and other events.

### Authentication & access control
Supabase passwordless auth (email OTP/magic link), tenant-scoped API JWT sessions, and app-managed RBAC with fixed `admin` / `member` roles.

---

## Project detail page

Each project has a rich detail page featuring:

- **Repository info** with branch, last commit (hash, author, time ago), and tech stack badges (filtered to frameworks/CMS/UI kits via an editable whitelist)
- **Project overview** — Tabbed AI-generated documentation with 8 sections plus Sensitive Data and Dependencies tabs
- **KPI dashboard** — Stars, forks, open issues, watchers, commits, contributors, and language breakdown with percentage bars
- **Contributors grid** — Top contributors with avatars and commit counts
- **Recent commits** — Last 5 commits with author, message, hash, and relative time
- **Recent deploys** — Last 5 deployments with status badge, provider badge, strategy, docker image, app URL link, and view details
- **Last deploy card** — Detailed view of the most recent deployment with destroy capability

---

## Architecture

Dockier is built as microservices, with an active migration to a Fastify + TypeScript backend foundation while preserving existing domain boundaries.

**Backend foundation now:** `backend/` runs Fastify + TypeScript with OpenAPI-first route schemas (Zod), Swagger UI, and a typed Supabase storage adapter. In this migration pass, `auth`, `users`, and `projects` are implemented; other domains are scaffolded with migration-status endpoints and continue to be migrated incrementally.

**Frontend:** Single-page React app (Vite + React 19 + Tailwind CSS v4) with dark mode default, portal-based dropdown selects, session-cached analysis, shared badge components (SensitivityBadge, StatusBadge, TechBadge, ProviderBadge, SourceControlBadge), and Cloudflare Pages deployment support.

**AI integration:** OpenAI API (gpt-5.4-mini) with a server-side API key (`OpenAIApiKey`). Used for project analysis (sections, deploy options) and security fix generation. Response format enforced as `json_object`. Results cached in PostgreSQL `analysis_cache` table keyed by repo + branch + commit SHA.

**Vulnerability scanning:** Dependencies checked against [OSV.dev](https://osv.dev) batch API. Sensitive data detected via pattern matching on field names from migrations and models — no AI credits consumed.

**Docs and contracts:** API contracts are exposed through runtime Swagger/OpenAPI endpoints and Mintlify documentation in `docs/`.

**Migration and schema direction:** Root `migrations/` is the single SQL migration source of truth, with historical lineage captured in `migrations/legacy-index.md`.

---

## Screenshots

*Screenshots and a live demo will be added shortly.*

---

## Contributing

We welcome contributions! Please open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a pull request

---

## License

Distributed under the GNU General Public License v3.0. See `LICENSE` for more information.

---

<p align="center">Built for engineering teams who ship.</p>
