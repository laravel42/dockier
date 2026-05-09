import { motion } from "framer-motion";
import {
  LayoutDashboard, FolderGit2, Upload, Shield, Settings,
  Sparkles, AlertCircle, CheckCircle2, GitBranch,
} from "lucide-react";

export function DashboardMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative mx-auto w-full max-w-6xl"
    >
      <div className="absolute -inset-x-20 -top-10 -bottom-10 -z-10 bg-[radial-gradient(ellipse_at_center,oklch(0.78_0.08_70/14%),transparent_60%)] blur-2xl" />
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/60 shadow-[var(--shadow-elevated)] backdrop-blur-xl">
        <div className="flex items-center gap-2 border-b border-border/40 bg-card/80 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.80_0.16_85)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-primary" />
          </div>
          <div className="ml-4 flex-1">
            <div className="mx-auto h-6 w-64 rounded-md border border-border/60 bg-background/60 text-center text-[11px] leading-6 text-muted-foreground">
              app.dockier.dev/dashboard
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12">
          <aside className="col-span-3 hidden border-r border-border/40 bg-background/40 p-4 md:block">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">D</span>
              Dockier
            </div>
            {[
              { i: LayoutDashboard, l: "Dashboard", a: true },
              { i: FolderGit2, l: "Projects" },
              { i: Upload, l: "Deployments" },
              { i: Shield, l: "Security Scan" },
              { i: Settings, l: "Settings" },
            ].map((it) => (
              <div
                key={it.l}
                className={`mb-1 flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                  it.a ? "bg-primary/15 text-primary" : "text-muted-foreground"
                }`}
              >
                <it.i className="h-4 w-4" />
                {it.l}
              </div>
            ))}
          </aside>
          <div className="col-span-12 p-5 md:col-span-9">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-2xl">Dashboard</h3>
              <span className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">+ New Project</span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {[
                { v: "12", l: "Projects" },
                { v: "94", l: "Deployments" },
                { v: "89", l: "Successful", c: "text-primary" },
                { v: "5", l: "Failed", c: "text-destructive" },
                { v: "182", l: "Scans" },
                { v: "1.2k", l: "Findings", c: "text-[oklch(0.80_0.16_85)]" },
              ].map((s) => (
                <div key={s.l} className="rounded-lg border border-border/40 bg-card/40 p-3 text-center">
                  <div className={`text-lg font-semibold ${s.c ?? ""}`}>{s.v}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <div className="rounded-lg border border-border/40 bg-card/40 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold">Recent deployments</span>
                  <span className="text-xs text-primary">View all</span>
                </div>
                {[
                  { ok: true, name: "trackers", env: "production · 2m ago" },
                  { ok: true, name: "billing-api", env: "staging · 14m ago" },
                  { ok: false, name: "edge-worker", env: "production · 1h ago" },
                ].map((d) => (
                  <div key={d.name} className="flex items-center justify-between border-t border-border/30 py-2 first:border-0 first:pt-0">
                    <div className="flex items-center gap-2">
                      {d.ok ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <AlertCircle className="h-4 w-4 text-destructive" />}
                      <div>
                        <div className="text-sm">{d.name}</div>
                        <div className="text-[11px] text-muted-foreground">{d.env}</div>
                      </div>
                    </div>
                    <GitBranch className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
              <div className="rounded-lg border border-border/40 bg-card/40 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold">Recent security scans</span>
                  <span className="text-xs text-primary">View all</span>
                </div>
                {[
                  { name: "trackers", c: 5, w: 9, i: 66 },
                  { name: "billing-api", c: 1, w: 4, i: 22 },
                  { name: "edge-worker", c: 0, w: 2, i: 8 },
                ].map((s) => (
                  <div key={s.name} className="flex items-center justify-between border-t border-border/30 py-2 first:border-0 first:pt-0">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-destructive" />
                      <span className="text-sm">{s.name}</span>
                    </div>
                    <div className="flex gap-1.5 text-[11px]">
                      <span className="rounded bg-destructive/15 px-1.5 py-0.5 text-destructive">● {s.c}</span>
                      <span className="rounded bg-[oklch(0.80_0.16_85/15%)] px-1.5 py-0.5 text-[oklch(0.85_0.14_85)]">▲ {s.w}</span>
                      <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">● {s.i}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating cards */}
      <motion.div
        initial={{ opacity: 0, x: -20, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="absolute -left-6 top-24 hidden w-64 rounded-xl border border-primary/30 bg-card/90 p-3 shadow-[var(--shadow-glow)] backdrop-blur-xl lg:block animate-float"
      >
        <div className="flex items-center gap-2 text-xs font-semibold">
          <Sparkles className="h-4 w-4 text-primary" />
          AI analysis ready
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Detected microservices architecture with 14 services. Postgres + Redis. Suggested SLOs generated.
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 20, y: -20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="absolute -right-4 bottom-16 hidden w-56 rounded-xl border border-destructive/30 bg-card/90 p-3 shadow-[0_10px_40px_-10px_oklch(0.65_0.22_25/40%)] backdrop-blur-xl lg:block animate-float"
        style={{ animationDelay: "1s" }}
      >
        <div className="flex items-center gap-2 text-xs font-semibold">
          <AlertCircle className="h-4 w-4 text-destructive" />
          Critical: SQL injection
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          api/users.ts · L142 · Fix available — open PR with one click.
        </p>
      </motion.div>
    </motion.div>
  );
}