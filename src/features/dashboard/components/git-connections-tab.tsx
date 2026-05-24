import { useState } from "react";
import { Plus, GitBranch, Trash2, RefreshCw } from "lucide-react";
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
import { useGitConnections, useAddGitConnection, useDeleteGitConnection } from "@/lib/queries";
import { toast } from "sonner";

const providers = ["github", "gitlab", "bitbucket", "gitea"] as const;

const defaultEndpoints: Record<(typeof providers)[number], string> = {
  github: "https://api.github.com",
  gitlab: "https://gitlab.com/api/v4",
  bitbucket: "https://api.bitbucket.org/2.0",
  gitea: "",
};

export function GitConnectionsTab({ isAdmin }: { isAdmin: boolean }) {
  const { data: connections = [], isLoading, refetch } = useGitConnections();
  const addConn = useAddGitConnection();
  const delConn = useDeleteGitConnection();
  const [open, setOpen] = useState(false);

  return (
    <Card className="bg-card/60">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <CardTitle className="text-base">Git connections</CardTitle>
          <CardDescription>
            Personal access tokens used by Dockier to fetch repositories, branches and commits.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          {isAdmin && (
            <Button size="sm" className="glow gap-1.5" onClick={() => setOpen(true)}>
              <Plus className="h-3.5 w-3.5" /> Add connection
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {connections.length === 0 && !isLoading && (
          <p className="text-sm text-muted-foreground">No git connections yet.</p>
        )}
        {connections.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-4 py-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <GitBranch className="h-4 w-4 text-muted-foreground" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{c.label}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {c.provider} · {c.repoUrl}
                </p>
              </div>
            </div>
            {isAdmin && (
              <Button
                size="icon"
                variant="ghost"
                onClick={async () => {
                  if (!confirm(`Delete connection "${c.label}"?`)) return;
                  try {
                    await delConn.mutateAsync(c.id);
                    toast.success("Connection removed");
                  } catch (err) {
                    toast.error(err instanceof Error ? err.message : "Delete failed");
                  }
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        ))}
      </CardContent>

      <AddConnectionDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={async (payload) => {
          try {
            await addConn.mutateAsync(payload);
            toast.success("Connection added");
            setOpen(false);
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Could not add connection");
          }
        }}
        pending={addConn.isPending}
      />
    </Card>
  );
}

function AddConnectionDialog({
  open,
  onOpenChange,
  onSubmit,
  pending,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (payload: {
    provider: string;
    label: string;
    personalToken: string;
    repoUrl: string;
    endpoint: string;
  }) => void | Promise<void>;
  pending: boolean;
}) {
  const [provider, setProvider] = useState<(typeof providers)[number]>("github");
  const [label, setLabel] = useState("");
  const [token, setToken] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [endpoint, setEndpoint] = useState(defaultEndpoints.github);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Git connection</DialogTitle>
          <DialogDescription>
            Token is stored securely on the server and only used to read your repositories.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Provider</Label>
              <Select
                value={provider}
                onValueChange={(v) => {
                  const next = v as (typeof providers)[number];
                  setProvider(next);
                  setEndpoint(defaultEndpoints[next] ?? "");
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Label</Label>
              <Input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="github-personal"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Personal access token</Label>
            <Input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_…"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Repository URL</Label>
            <Input
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/laravel42/dockier/edge-gateway"
            />
          </div>
          <div className="space-y-1.5">
            <Label>API endpoint</Label>
            <Input
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="https://api.github.com"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={pending || !label || !token || !repoUrl}
            onClick={() => onSubmit({ provider, label, personalToken: token, repoUrl, endpoint })}
          >
            {pending ? "Adding…" : "Add connection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
