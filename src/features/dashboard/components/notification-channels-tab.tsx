import { useState } from "react";
import { Plus, Bell, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  useNotificationChannels,
  useAddNotificationChannel,
  useDeleteNotificationChannel,
  useToggleNotificationChannel,
} from "@/lib/queries";
import { toast } from "sonner";

const channelTypes = ["email", "slack", "webhook", "discord"] as const;

const fieldsByType: Record<(typeof channelTypes)[number], string[]> = {
  email: ["address"],
  slack: ["webhookUrl"],
  webhook: ["url", "secret"],
  discord: ["webhookUrl"],
};

export function NotificationChannelsTab({ isAdmin }: { isAdmin: boolean }) {
  const { data: channels = [], isLoading, refetch } = useNotificationChannels();
  const addChan = useAddNotificationChannel();
  const delChan = useDeleteNotificationChannel();
  const togChan = useToggleNotificationChannel();
  const [open, setOpen] = useState(false);

  return (
    <Card className="bg-card/60">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <CardTitle className="text-base">Notification channels</CardTitle>
          <CardDescription>Where Dockier sends scan / deploy alerts.</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          {isAdmin && (
            <Button size="sm" className="glow gap-1.5" onClick={() => setOpen(true)}>
              <Plus className="h-3.5 w-3.5" /> Add channel
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {channels.length === 0 && !isLoading && (
          <p className="text-sm text-muted-foreground">No notification channels configured.</p>
        )}
        {channels.map((c) => {
          const summary = Object.entries(c.config ?? {})
            .map(([k, v]) => `${k}: ${v}`)
            .join(" · ");
          return (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-4 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium capitalize">{c.type}</p>
                  <p className="truncate text-xs text-muted-foreground">{summary || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={c.enabled}
                  onCheckedChange={(v) =>
                    togChan
                      .mutateAsync({ channelId: c.id, enabled: v })
                      .catch((err) =>
                        toast.error(err instanceof Error ? err.message : "Toggle failed"),
                      )
                  }
                />
                {isAdmin && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={async () => {
                      if (!confirm("Remove this channel?")) return;
                      try {
                        await delChan.mutateAsync(c.id);
                        toast.success("Channel removed");
                      } catch (err) {
                        toast.error(err instanceof Error ? err.message : "Delete failed");
                      }
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>

      <AddChannelDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={async (payload) => {
          try {
            await addChan.mutateAsync(payload);
            toast.success("Channel added");
            setOpen(false);
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Could not add channel");
          }
        }}
        pending={addChan.isPending}
      />
    </Card>
  );
}

function AddChannelDialog({
  open,
  onOpenChange,
  onSubmit,
  pending,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (payload: { type: string; config: Record<string, string> }) => void | Promise<void>;
  pending: boolean;
}) {
  const [type, setType] = useState<(typeof channelTypes)[number]>("email");
  const [config, setConfig] = useState<Record<string, string>>({});

  const fields = fieldsByType[type];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add notification channel</DialogTitle>
          <DialogDescription>
            Channel config is stored on the server and never exposed to the browser after creation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select
              value={type}
              onValueChange={(v) => {
                setType(v as (typeof channelTypes)[number]);
                setConfig({});
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {channelTypes.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {fields.map((f) => (
            <div key={f} className="space-y-1.5">
              <Label className="capitalize">{f}</Label>
              <Input
                value={config[f] ?? ""}
                onChange={(e) => setConfig((prev) => ({ ...prev, [f]: e.target.value }))}
              />
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={pending || fields.some((f) => !config[f])}
            onClick={() => onSubmit({ type, config })}
          >
            {pending ? "Adding…" : "Add channel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
