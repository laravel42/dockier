import { Bell, AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { notifications } from "@/features/dashboard/fixtures/data";

const icons = {
  success: { Icon: CheckCircle2, tone: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
  error: { Icon: XCircle, tone: "text-destructive bg-destructive/10 border-destructive/30" },
  warning: { Icon: AlertTriangle, tone: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
  info: { Icon: Info, tone: "text-primary bg-primary/10 border-primary/30" },
} as const;

export function NotificationsPage() {
  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Workspace-wide alerts and activity."
        actions={<Button size="sm" variant="outline">Mark all as read</Button>}
      />

      <Card className="bg-card/60">
        <CardContent className="p-0">
          <ul>
            {notifications.map((n) => {
              const { Icon, tone } = icons[n.level];
              return (
                <li key={n.id} className={`flex gap-4 border-b border-border/40 px-5 py-4 last:border-0 ${!n.read ? "bg-primary/5" : ""}`}>
                  <span className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border ${tone}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="truncate text-sm font-medium">{n.title}</p>
                      <span className="shrink-0 text-[11px] text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{n.body}</p>
                  </div>
                  {!n.read && <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-label="Unread" />}
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>

      {notifications.length === 0 && (
        <Card className="bg-card/60">
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
            <Bell className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">You're all caught up.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}