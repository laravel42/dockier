## Porting the dashboard into Dockier

The uploaded archive is a full React Router v7 SPA (~195 files, 11 pages, contexts, sidebar layout, scan/deploy/project detail screens, settings tabs, deploy wizard with codemirror). Embedding it as-is would clash with the marketing site (notably the existing `/security` route) and bring in a parallel auth/theming/router stack. The plan is a clean port, not a copy-paste.

### 1. Routing & namespace

Mount the entire dashboard under `/app/*` so it never collides with marketing routes (`/security`, `/pricing`, etc.):

```text
src/routes/
  _authenticated.tsx                 (existing guard — keep)
  _authenticated/
    app.tsx                          layout with sidebar + topbar
    app/
      index.tsx                       → /app  (overview)
      notifications.tsx               → /app/notifications
      projects.tsx                    → /app/projects
      projects.$projectId.tsx         → /app/projects/:id
      security.tsx                    → /app/security
      security.$scanId.tsx            → /app/security/:scanId
      deploy.tsx                      → /app/deploy
      deploy.$deployId.tsx            → /app/deploy/:id
      settings.tsx                    → /app/settings (tabs layout)
```

The current placeholder `/dashboard` redirects to `/app`. Header "Dashboard" link points to `/app`.

### 2. Replace the parallel stacks

| Source dashboard | Replaced by |
|---|---|
| `react-router-dom` `<Link>`, `useNavigate`, `useParams` | `@tanstack/react-router` equivalents |
| `AuthContext` | existing `useAuth` hook + Supabase session |
| `ThemeContext` (light/dark toggle) | site already dark-first; expose a toggle via `next-themes` later if needed (out of scope here) |
| `PermissionsContext` | thin pass-through hook returning `true` for now (server enforcement TBD) |
| `Layout.tsx` + `Sidebar.tsx` + `Toolbar.tsx` | shadcn `Sidebar` (`SidebarProvider`, `SidebarTrigger`, collapsible icon mode) wired to TanStack `Link` + `useRouterState` |

### 3. Re-skin to the marketing system

- Drop the dashboard's `index.css` `@theme` block. All tokens come from `src/styles.css` (background, primary cyan/teal, surface, severity, gradient-primary, shadow-elegant).
- Replace ad-hoc `bg-card`, `text-text-secondary`, `border-border` color names with the site's semantic tokens (`bg-card`, `text-muted-foreground`, `border-border` already match — minimal renaming).
- Fonts: keep Space Grotesk display + Inter Tight body (already loaded). Drop Fraunces references.
- Swap primitives:
  - `<button>` → `Button` (variants: default, outline, ghost, destructive)
  - cards → `Card`, `CardHeader`, `CardContent`
  - badges → `Badge` (with `severity` variant added)
  - tabs (Settings, ScanDetail) → `Tabs` from shadcn
  - modals (FixWithAI, CreateIssue, ConfirmModal) → `Dialog`
  - selects/comboboxes → `Select` / `Command`
- Rebuild `SeverityBadge`, `TechBadge`, `ProviderBadge`, `PlatformBadge`, `SourceControlBadge` on top of `Badge` with severity color tokens (`--sev-critical`, `--sev-high`, …).

### 4. Heavy dependencies

Install these as part of the port:
- `@xyflow/react` — used by the deploy graph view
- `@uiw/react-md-editor` + `prismjs` — markdown editor in scan/findings
- `@codemirror/*` + `react-simple-code-editor` — env vars / compose editor in DeployWizard

If any of these turn out to be SSR-incompatible they'll be lazy-loaded with `React.lazy` + a client-only wrapper.

### 5. Data layer

The original app calls a backend that doesn't exist here. To keep the port runnable:
- All pages start with mock fixtures defined alongside the component (e.g. `src/features/dashboard/fixtures/projects.ts`).
- A thin `src/features/dashboard/api.ts` exposes typed functions returning the fixtures via `Promise.resolve(...)`. Replacing fixtures with real Supabase queries later only touches that file.
- No new database schema in this pass.

### 6. Folder layout in this project

```text
src/features/dashboard/
  layout/
    AppSidebar.tsx
    AppTopbar.tsx
  components/
    SeverityBadge.tsx, TechBadge.tsx, ProviderBadge.tsx, ...
  pages/
    Overview.tsx, Projects.tsx, ProjectDetail.tsx,
    Security.tsx, ScanDetail.tsx,
    Deploy.tsx, DeployDetail.tsx,
    Notifications.tsx, Settings.tsx,
    settings/{Profile,Users,Roles,Providers,Integrations,SourceControl,SshKeys,Security,SecurityRules,NotificationChannels}Tab.tsx
  fixtures/
    projects.ts, scans.ts, deploys.ts, users.ts, integrations.ts
  api.ts
```

Route files in `src/routes/_authenticated/app/*` stay tiny — they just import from `src/features/dashboard/pages` and set `head()` metadata.

### 7. Out of scope (this pass)

- Real backend wiring (kept on fixtures so the UI is interactive end-to-end).
- DeployWizard's full step flow with live env detection — port the shell and "review/deploy" step; the wizard's environment detection that hits a backend stays mocked.
- Light-mode parity — the marketing site is dark-first; dashboard renders dark-only for now.
- Realtime / websocket scan progress.

### 8. Sequencing

1. Add `/app` route shell + sidebar/topbar (shadcn `Sidebar`), redirect `/dashboard` → `/app`.
2. Port primitives (badges, severity, tech, provider) onto shadcn `Badge` + tokens.
3. Port pages in this order: Overview → Projects (+ detail) → Security (+ scan detail) → Deploy (+ detail) → Notifications → Settings (with all tabs).
4. Install heavy deps (`@xyflow/react`, codemirror, md-editor) only when their consuming page is being ported.
5. Verify each ported page renders at its `/app/...` URL with auth guard active.

### Why this scope

A faithful port of 195 source files re-skinned to shadcn is multi-thousand-line work. I'll execute it page-by-page across follow-up turns rather than one giant patch, so you can review and steer each section. This plan locks the architecture (routing, primitives, fixture data) so nothing has to be redone later.
