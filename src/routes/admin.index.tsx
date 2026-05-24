import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Mail,
  TrendingUp,
  Inbox,
  Loader2,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

type Lead = { id: string; email: string; source: string | null; created_at: string };
type DemoRow = {
  id: string;
  name: string;
  email: string;
  company: string;
  team_size: string | null;
  status: string;
  source: string | null;
  created_at: string;
};

const CHART_COLORS = [
  "oklch(0.78 0.14 180)",
  "oklch(0.7 0.16 280)",
  "oklch(0.75 0.18 60)",
  "oklch(0.7 0.18 0)",
  "oklch(0.78 0.14 140)",
];

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function buildDailySeries<T extends { created_at: string }>(
  rows: T[],
  days = 30,
) {
  const buckets = new Map<string, { date: string; count: number }>();
  const today = startOfDay(new Date());
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    buckets.set(key, { date: key, count: 0 });
  }
  for (const r of rows) {
    const key = r.created_at.slice(0, 10);
    const b = buckets.get(key);
    if (b) b.count += 1;
  }
  return Array.from(buckets.values());
}

function AdminOverview() {
  const leadsQuery = useQuery({
    queryKey: ["admin", "leads", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("waitlist_leads")
        .select("id,email,source,created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Lead[];
    },
  });
  const demoQuery = useQuery({
    queryKey: ["admin", "demo", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("demo_requests")
        .select("id,name,email,company,team_size,status,source,created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as DemoRow[];
    },
  });

  if (leadsQuery.isLoading || demoQuery.isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const leads = leadsQuery.data ?? [];
  const demos = demoQuery.data ?? [];

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const leadsLast7 = leads.filter((l) => new Date(l.created_at) >= sevenDaysAgo).length;
  const demosLast7 = demos.filter((d) => new Date(d.created_at) >= sevenDaysAgo).length;

  const stats = [
    {
      label: "Total waitlist",
      value: leads.length,
      delta: `+${leadsLast7} last 7 days`,
      icon: Users,
    },
    {
      label: "Total demos",
      value: demos.length,
      delta: `+${demosLast7} last 7 days`,
      icon: Mail,
    },
    {
      label: "New demos (open)",
      value: demos.filter((d) => d.status === "new").length,
      delta: "Awaiting follow-up",
      icon: Inbox,
    },
    {
      label: "Conversion rate",
      value:
        leads.length === 0
          ? "—"
          : `${Math.round((demos.length / leads.length) * 100)}%`,
      delta: "Demos ÷ waitlist",
      icon: TrendingUp,
    },
  ];

  const leadsSeries = buildDailySeries(leads, 30);
  const demosSeries = buildDailySeries(demos, 30);
  const combinedSeries = leadsSeries.map((l, i) => ({
    date: l.date,
    waitlist: l.count,
    demos: demosSeries[i]?.count ?? 0,
  }));

  const sourceCounts = new Map<string, number>();
  for (const l of leads) {
    const key = l.source ?? "unknown";
    sourceCounts.set(key, (sourceCounts.get(key) ?? 0) + 1);
  }
  const sourceData = Array.from(sourceCounts.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const teamSizeCounts = new Map<string, number>();
  for (const d of demos) {
    const key = d.team_size ?? "Unspecified";
    teamSizeCounts.set(key, (teamSizeCounts.get(key) ?? 0) + 1);
  }
  const teamSizeData = Array.from(teamSizeCounts.entries()).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Real-time view of your waitlist and demo pipeline.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-2xl border border-border/50 bg-card/40 p-5 backdrop-blur"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </span>
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div className="mt-3 font-display text-3xl font-semibold">
                {s.value}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{s.delta}</div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-border/50 bg-card/40 p-5 backdrop-blur">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">Signups over time</h2>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={combinedSeries}>
              <defs>
                <linearGradient id="waitlistGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS[0]} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="demoGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS[1]} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={CHART_COLORS[1]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 8%)" />
              <XAxis
                dataKey="date"
                stroke="oklch(1 0 0 / 50%)"
                fontSize={11}
                tickFormatter={(v) => v.slice(5)}
              />
              <YAxis stroke="oklch(1 0 0 / 50%)" fontSize={11} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.18 0 0)",
                  border: "1px solid oklch(1 0 0 / 15%)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area
                type="monotone"
                dataKey="waitlist"
                stroke={CHART_COLORS[0]}
                fill="url(#waitlistGrad)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="demos"
                stroke={CHART_COLORS[1]}
                fill="url(#demoGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/50 bg-card/40 p-5 backdrop-blur">
          <h2 className="text-sm font-semibold">Waitlist by source</h2>
          <p className="text-xs text-muted-foreground">Top 6 sources</p>
          <div className="mt-4 h-64">
            {sourceData.length === 0 ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sourceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 8%)" />
                  <XAxis type="number" stroke="oklch(1 0 0 / 50%)" fontSize={11} allowDecimals={false} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="oklch(1 0 0 / 60%)"
                    fontSize={11}
                    width={120}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.18 0 0)",
                      border: "1px solid oklch(1 0 0 / 15%)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="value" fill={CHART_COLORS[0]} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border/50 bg-card/40 p-5 backdrop-blur">
          <h2 className="text-sm font-semibold">Demo team sizes</h2>
          <p className="text-xs text-muted-foreground">Distribution of inbound interest</p>
          <div className="mt-4 h-64">
            {teamSizeData.length === 0 ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={teamSizeData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {teamSizeData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.18 0 0)",
                      border: "1px solid oklch(1 0 0 / 15%)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentList
          title="Recent waitlist signups"
          empty="No waitlist signups yet."
          items={leads.slice(0, 8).map((l) => ({
            id: l.id,
            primary: l.email,
            secondary: l.source ?? "—",
            timestamp: l.created_at,
          }))}
        />
        <RecentList
          title="Recent demo requests"
          empty="No demo requests yet."
          items={demos.slice(0, 8).map((d) => ({
            id: d.id,
            primary: `${d.name} — ${d.company}`,
            secondary: d.email,
            timestamp: d.created_at,
            badge: d.status,
          }))}
        />
      </div>
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
      No data yet
    </div>
  );
}

function RecentList({
  title,
  items,
  empty,
}: {
  title: string;
  empty: string;
  items: Array<{
    id: string;
    primary: string;
    secondary: string;
    timestamp: string;
    badge?: string;
  }>;
}) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card/40 p-5 backdrop-blur">
      <h2 className="text-sm font-semibold">{title}</h2>
      <ul className="mt-4 divide-y divide-border/40">
        {items.length === 0 ? (
          <li className="py-6 text-center text-sm text-muted-foreground">{empty}</li>
        ) : (
          items.map((it) => (
            <li key={it.id} className="flex items-center justify-between py-3 text-sm">
              <div className="min-w-0">
                <div className="truncate font-medium">{it.primary}</div>
                <div className="truncate text-xs text-muted-foreground">{it.secondary}</div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {it.badge && (
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider",
                      it.badge === "new"
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-border bg-card",
                    )}
                  >
                    {it.badge}
                  </span>
                )}
                <span>
                  {new Date(it.timestamp).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                  })}
                </span>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}