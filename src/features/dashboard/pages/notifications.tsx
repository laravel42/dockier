import { Bell, AlertTriangle, CheckCircle2, Info, XCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { useNotifications, useMarkNotificationRead } from "@/lib/queries";
import { timeAgo } from "@/lib/repo";
import { toast } from "sonner";

type Level = "info" | "success" | "warning" | "error";

const icons: Record<Level, { Icon: React.ComponentType<{ className?: string }>; tone: string }> = {
  success: {
    Icon: CheckCircle2,
    tone: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  },
  error: {
    Icon: XCircle,
    tone: "text-destructive bg-destructive/10 border-destructive/30",
  },
  warning: {
    Icon: AlertTriangle,
    tone: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  },
  info: {
    Icon: Info,
    tone: "text-primary bg-primary/10 border-primary/30",
  },
};

function detectLevel(title: string): Level {
  const t = title.toLowerCase();
  if (t.includes("fail") || t.includes("error") || t.includes("critical")) return "error";
  if (t.includes("warn")) return "warning";
  if (t.includes("success") || t.includes("completed") || t.includes("deployed")) return "success";
  return "info";
}

export function NotificationsPage() {
  const { data: notifications = [], isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();

  const unread = notifications.filter((n) => !n.read);
  const onMarkAll = async () => {
    try {
      await Promise.all(unread.map((n) => markRead.mutateAsync(n.id).catch(() => null)));
      toast.success("All caught up");
    } catch {
      toast.error("Could not mark all as read");
    }
  };

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Workspace-wide alerts and activity."
        actions={
          <Button size="sm" variant="outline" onClick={onMarkAll} disabled={unread.length === 0}>
            Mark all as read
          </Button>
        }
      />

      <Card className="bg-card/60">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center px-5 py-12 text-xs text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <Bell className="h-6 w-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">You're all caught up.</p>
            </div>
          ) : (
            <ul>
              {notifications.map((n) => {
                const level = detectLevel(n.title);
                const { Icon, tone } = icons[level];
                return (
                  <li
                    key={n.id}
                    className={`flex gap-4 border-b border-border/40 px-5 py-4 last:border-0 ${
                      !n.read ? "bg-primary/5" : ""
                    }`}
                  >
                    <span
                      className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border ${tone}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="truncate text-sm font-medium">{n.title}</p>
                        <span className="shrink-0 text-[11px] text-muted-foreground">
                          {timeAgo(n.createdAt)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{n.message}</p>
                    </div>
                    {!n.read && (
                      <button
                        onClick={() => markRead.mutate(n.id)}
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                        aria-label="Mark as read"
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
