import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Cloud, KeyRound, GitBranch, Plus, Trash2, RefreshCw } from "lucide-react";

type AppRole = "admin" | "moderator" | "user";

interface ProfileRow {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

interface RoleRow {
  id: string;
  user_id: string;
  role: AppRole;
}

const cloudProviders = [
  { name: "AWS", region: "eu-west-1", connected: true },
  { name: "Google Cloud", region: "europe-west4", connected: false },
  { name: "Azure", region: "westeurope", connected: false },
  { name: "Fly.io", region: "fra", connected: true },
];

const sshKeys = [
  { name: "MacBook Pro", fingerprint: "SHA256:9f3c…1ab2", added: "2026-04-12" },
  { name: "CI runner", fingerprint: "SHA256:2b71…e4d8", added: "2026-03-02" },
];

const sourceProviders = [
  { name: "GitHub", account: "dockier", connected: true },
  { name: "GitLab", account: "dockier", connected: true },
  { name: "Bitbucket", account: "—", connected: false },
];

export function SettingsPage() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [profilesRes, rolesRes] = await Promise.all([
      supabase.from("profiles").select("id, email, display_name, avatar_url, created_at").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("id, user_id, role"),
    ]);
    if (profilesRes.error) toast.error(profilesRes.error.message);
    else setProfiles(profilesRes.data ?? []);
    if (rolesRes.error) toast.error(rolesRes.error.message);
    else setRoles((rolesRes.data ?? []) as RoleRow[]);
    setLoading(false);
  };

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const rolesFor = (uid: string) => roles.filter((r) => r.user_id === uid).map((r) => r.role);

  const assignRole = async (userId: string, role: AppRole) => {
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
    if (error) toast.error(error.message);
    else {
      toast.success(`Granted ${role}`);
      loadData();
    }
  };

  const revokeRole = async (id: string) => {
    const { error } = await supabase.from("user_roles").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Role revoked");
      loadData();
    }
  };

  return (
    <div>
      <PageHeader title="Settings" description="Manage your workspace, integrations and preferences." />

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="bg-card/60">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="cloud">Cloud providers</TabsTrigger>
          <TabsTrigger value="ssh">SSH keys</TabsTrigger>
          <TabsTrigger value="source">Source control</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-4">
          <Card className="bg-card/60">
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div>
                <CardTitle className="text-base">Users</CardTitle>
                <CardDescription>Workspace members synced from your authentication backend.</CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={loadData} disabled={loading}>
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {profiles.length === 0 && !loading && (
                <p className="text-sm text-muted-foreground">No users visible. Sign in as an admin to see all members.</p>
              )}
              {profiles.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{p.display_name ?? p.email ?? p.id}</p>
                    <p className="truncate text-xs text-muted-foreground">{p.email ?? "—"}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-1">
                    {rolesFor(p.id).length === 0 ? (
                      <Badge variant="outline" className="text-[10px]">user</Badge>
                    ) : (
                      rolesFor(p.id).map((r) => (
                        <Badge key={r} variant="secondary" className="text-[10px]">{r}</Badge>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="mt-4">
          <Card className="bg-card/60">
            <CardHeader>
              <CardTitle className="text-base">Roles</CardTitle>
              <CardDescription>Grant or revoke admin, moderator and user roles. Only admins can change roles.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {profiles.map((p) => {
                const userRoles = roles.filter((r) => r.user_id === p.id);
                return (
                  <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/50 bg-muted/20 px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{p.display_name ?? p.email ?? p.id}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {userRoles.length === 0 && <span className="text-xs text-muted-foreground">No roles assigned</span>}
                        {userRoles.map((r) => (
                          <Badge key={r.id} variant="secondary" className="gap-1 text-[10px]">
                            {r.role}
                            <button onClick={() => revokeRole(r.id)} className="opacity-70 hover:opacity-100" aria-label={`Revoke ${r.role}`}>
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <RoleAssigner onAssign={(role) => assignRole(p.id, role)} existing={userRoles.map((r) => r.role)} />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cloud" className="mt-4">
          <Card className="bg-card/60">
            <CardHeader>
              <CardTitle className="text-base">Cloud providers</CardTitle>
              <CardDescription>Deployment targets connected to your workspace.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 sm:grid-cols-2">
              {cloudProviders.map((p) => (
                <div key={p.name} className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Cloud className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.region}</p>
                    </div>
                  </div>
                  <Button size="sm" variant={p.connected ? "outline" : "default"}>
                    {p.connected ? "Manage" : "Connect"}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ssh" className="mt-4">
          <Card className="bg-card/60">
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div>
                <CardTitle className="text-base">SSH keys</CardTitle>
                <CardDescription>Public keys allowed to push to your repositories.</CardDescription>
              </div>
              <Button size="sm" className="glow gap-1.5"><Plus className="h-3.5 w-3.5" /> Add key</Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {sshKeys.map((k) => (
                <div key={k.fingerprint} className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <KeyRound className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{k.name}</p>
                      <p className="font-mono text-xs text-muted-foreground">{k.fingerprint}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">added {k.added}</span>
                    <Button size="sm" variant="ghost"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="source" className="mt-4">
          <Card className="bg-card/60">
            <CardHeader>
              <CardTitle className="text-base">Source control</CardTitle>
              <CardDescription>Connect Git providers to import repositories and trigger scans on push.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 sm:grid-cols-2">
              {sourceProviders.map((p) => (
                <div key={p.name} className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <GitBranch className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.account}</p>
                    </div>
                  </div>
                  <Button size="sm" variant={p.connected ? "outline" : "default"}>
                    {p.connected ? "Manage" : "Connect"}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RoleAssigner({ onAssign, existing }: { onAssign: (role: AppRole) => void; existing: AppRole[] }) {
  const [value, setValue] = useState<AppRole | "">("");
  const all: AppRole[] = ["admin", "moderator", "user"];
  const available = all.filter((r) => !existing.includes(r));
  return (
    <div className="flex items-center gap-2">
      <Select value={value} onValueChange={(v) => setValue(v as AppRole)}>
        <SelectTrigger className="h-8 w-32 text-xs">
          <SelectValue placeholder="Add role" />
        </SelectTrigger>
        <SelectContent>
          {available.map((r) => (
            <SelectItem key={r} value={r}>{r}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        size="sm"
        variant="outline"
        disabled={!value}
        onClick={() => {
          if (value) {
            onAssign(value);
            setValue("");
          }
        }}
      >
        Grant
      </Button>
    </div>
  );
}