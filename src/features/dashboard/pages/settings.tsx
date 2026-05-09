import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Cloud, KeyRound, GitBranch, Plus, Trash2, RefreshCw, ShieldCheck } from "lucide-react";

type AppRole = "admin" | "moderator" | "user";

interface ProfileRow {
  id: string;
  email: string | null;
  display_name: string | null;
  created_at: string;
}
interface RoleRow { id: string; user_id: string; role: AppRole }
interface CloudRow { id: string; name: string; kind: string; region: string | null; connected: boolean }
interface SourceRow { id: string; name: string; provider: string; account: string | null; connected: boolean }
interface SshRow { id: string; name: string; fingerprint: string; public_key: string | null; created_at: string }

const cloudKinds = ["AWS", "Google Cloud", "Azure", "Fly.io", "DigitalOcean", "Hetzner"];
const sourceProvidersList = ["GitHub", "GitLab", "Bitbucket", "Gitea"];

export function SettingsPage() {
  const { user, isAdmin, roles } = useAuth();
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [allRoles, setAllRoles] = useState<RoleRow[]>([]);
  const [clouds, setClouds] = useState<CloudRow[]>([]);
  const [sources, setSources] = useState<SourceRow[]>([]);
  const [sshKeys, setSshKeys] = useState<SshRow[]>([]);
  const [loading, setLoading] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    const [p, r, c, s, k] = await Promise.all([
      supabase.from("profiles").select("id, email, display_name, created_at").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("id, user_id, role"),
      supabase.from("cloud_providers").select("*").order("created_at"),
      supabase.from("source_connections").select("*").order("created_at"),
      supabase.from("ssh_keys").select("*").order("created_at"),
    ]);
    if (p.error) toast.error(p.error.message); else setProfiles(p.data ?? []);
    if (r.error) toast.error(r.error.message); else setAllRoles((r.data ?? []) as RoleRow[]);
    if (c.error) toast.error(c.error.message); else setClouds((c.data ?? []) as CloudRow[]);
    if (s.error) toast.error(s.error.message); else setSources((s.data ?? []) as SourceRow[]);
    if (k.error) toast.error(k.error.message); else setSshKeys((k.data ?? []) as SshRow[]);
    setLoading(false);
  };

  useEffect(() => { if (user) loadAll(); }, [user]);

  const rolesFor = (uid: string) => allRoles.filter((r) => r.user_id === uid).map((r) => r.role);
  const assignRole = async (userId: string, role: AppRole) => {
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
    if (error) return toast.error(error.message);
    toast.success(`Granted ${role}`); loadAll();
  };
  const revokeRole = async (id: string) => {
    const { error } = await supabase.from("user_roles").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Role revoked"); loadAll();
  };

  return (
    <div>
      <PageHeader title="Settings" description="Manage your workspace, integrations and access control." />

      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5" />
        Signed in as <span className="font-medium text-foreground">{user?.email}</span>
        <span>•</span>
        <span>Roles:</span>
        {roles.length === 0 ? <Badge variant="outline" className="text-[10px]">user</Badge> :
          roles.map((r) => <Badge key={r} variant="secondary" className="text-[10px]">{r}</Badge>)}
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="bg-card/60">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="cloud">Cloud providers</TabsTrigger>
          <TabsTrigger value="ssh">SSH keys</TabsTrigger>
          <TabsTrigger value="source">Source control</TabsTrigger>
        </TabsList>

        {/* USERS */}
        <TabsContent value="users" className="mt-4">
          <Card className="bg-card/60">
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div>
                <CardTitle className="text-base">Users</CardTitle>
                <CardDescription>Workspace members. Admins can see everyone.</CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={loadAll} disabled={loading}>
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {profiles.length === 0 && !loading && (
                <p className="text-sm text-muted-foreground">No users visible.</p>
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

        {/* ROLES */}
        <TabsContent value="roles" className="mt-4">
          <Card className="bg-card/60">
            <CardHeader>
              <CardTitle className="text-base">Roles</CardTitle>
              <CardDescription>
                {isAdmin ? "Grant or revoke admin, moderator and user roles." : "Only admins can change roles."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {profiles.map((p) => {
                const userRoles = allRoles.filter((r) => r.user_id === p.id);
                return (
                  <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/50 bg-muted/20 px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{p.display_name ?? p.email ?? p.id}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {userRoles.length === 0 && <span className="text-xs text-muted-foreground">No roles assigned</span>}
                        {userRoles.map((r) => (
                          <Badge key={r.id} variant="secondary" className="gap-1 text-[10px]">
                            {r.role}
                            {isAdmin && (
                              <button onClick={() => revokeRole(r.id)} className="opacity-70 hover:opacity-100" aria-label={`Revoke ${r.role}`}>
                                <Trash2 className="h-3 w-3" />
                              </button>
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {isAdmin && (
                      <RoleAssigner onAssign={(role) => assignRole(p.id, role)} existing={userRoles.map((r) => r.role)} />
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* CLOUD */}
        <TabsContent value="cloud" className="mt-4">
          <Card className="bg-card/60">
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div>
                <CardTitle className="text-base">Cloud providers</CardTitle>
                <CardDescription>Connect one or more deployment targets. Each needs a unique name.</CardDescription>
              </div>
              {isAdmin && <CloudFormDialog onSaved={loadAll} trigger={<Button size="sm" className="glow gap-1.5"><Plus className="h-3.5 w-3.5" /> Add provider</Button>} />}
            </CardHeader>
            <CardContent className="grid gap-2 sm:grid-cols-2">
              {clouds.length === 0 && <p className="text-sm text-muted-foreground">No cloud providers yet.</p>}
              {clouds.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-4 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <Cloud className="h-4 w-4 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{c.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{c.kind}{c.region ? ` • ${c.region}` : ""}</p>
                    </div>
                  </div>
                  {isAdmin ? (
                    <CloudFormDialog initial={c} onSaved={loadAll}
                      trigger={<Button size="sm" variant={c.connected ? "outline" : "default"}>{c.connected ? "Manage" : "Connect"}</Button>} />
                  ) : (
                    <Button size="sm" variant={c.connected ? "outline" : "default"} disabled>{c.connected ? "Manage" : "Connect"}</Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SSH */}
        <TabsContent value="ssh" className="mt-4">
          <Card className="bg-card/60">
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div>
                <CardTitle className="text-base">SSH keys</CardTitle>
                <CardDescription>Public keys allowed to push to your repositories.</CardDescription>
              </div>
              {isAdmin && <SshFormDialog onSaved={loadAll} trigger={<Button size="sm" className="glow gap-1.5"><Plus className="h-3.5 w-3.5" /> Add key</Button>} />}
            </CardHeader>
            <CardContent className="space-y-2">
              {sshKeys.length === 0 && <p className="text-sm text-muted-foreground">No SSH keys yet.</p>}
              {sshKeys.map((k) => (
                <SshRowItem key={k.id} k={k} isAdmin={isAdmin} onSaved={loadAll} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SOURCE */}
        <TabsContent value="source" className="mt-4">
          <Card className="bg-card/60">
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div>
                <CardTitle className="text-base">Source control</CardTitle>
                <CardDescription>Connect Git providers. Each connection needs a unique name.</CardDescription>
              </div>
              {isAdmin && <SourceFormDialog onSaved={loadAll} trigger={<Button size="sm" className="glow gap-1.5"><Plus className="h-3.5 w-3.5" /> Add connection</Button>} />}
            </CardHeader>
            <CardContent className="grid gap-2 sm:grid-cols-2">
              {sources.length === 0 && <p className="text-sm text-muted-foreground">No source connections yet.</p>}
              {sources.map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-4 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <GitBranch className="h-4 w-4 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{s.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{s.provider}{s.account ? ` • ${s.account}` : ""}</p>
                    </div>
                  </div>
                  {isAdmin ? (
                    <SourceFormDialog initial={s} onSaved={loadAll}
                      trigger={<Button size="sm" variant={s.connected ? "outline" : "default"}>{s.connected ? "Manage" : "Connect"}</Button>} />
                  ) : (
                    <Button size="sm" variant={s.connected ? "outline" : "default"} disabled>{s.connected ? "Manage" : "Connect"}</Button>
                  )}
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
  const all: AppRole[] = ["admin", "moderator", "user"];
  const [value, setValue] = useState<AppRole | "">("");
  const available = all.filter((r) => !existing.includes(r));
  return (
    <div className="flex items-center gap-2">
      <Select value={value} onValueChange={(v) => setValue(v as AppRole)}>
        <SelectTrigger className="h-8 w-32 text-xs"><SelectValue placeholder="Add role" /></SelectTrigger>
        <SelectContent>
          {available.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
        </SelectContent>
      </Select>
      <Button size="sm" variant="outline" disabled={!value} onClick={() => { if (value) { onAssign(value); setValue(""); } }}>Grant</Button>
    </div>
  );
}

function SshRowItem({ k, isAdmin, onSaved }: { k: SshRow; isAdmin: boolean; onSaved: () => void }) {
  const added = new Date(k.created_at).toLocaleDateString("en-GB");
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <KeyRound className="h-4 w-4 text-muted-foreground" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{k.name}</p>
          <p className="truncate font-mono text-xs text-muted-foreground">{k.fingerprint}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">added {added}</span>
        {isAdmin && (
          <>
            <SshFormDialog initial={k} onSaved={onSaved} trigger={<Button size="sm" variant="outline">Edit</Button>} />
            <Button size="sm" variant="ghost" onClick={async () => {
              const { error } = await supabase.from("ssh_keys").delete().eq("id", k.id);
              if (error) toast.error(error.message); else { toast.success("Removed"); onSaved(); }
            }}><Trash2 className="h-3.5 w-3.5" /></Button>
          </>
        )}
      </div>
    </div>
  );
}

function CloudFormDialog({ initial, onSaved, trigger }: { initial?: CloudRow; onSaved: () => void; trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(initial?.name ?? "");
  const [kind, setKind] = useState(initial?.kind ?? cloudKinds[0]);
  const [region, setRegion] = useState(initial?.region ?? "");
  const [connected, setConnected] = useState(initial?.connected ?? false);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!name.trim()) return toast.error("Name is required");
    setSaving(true);
    const payload = { name: name.trim(), kind, region: region.trim() || null, connected };
    const { error } = initial
      ? await supabase.from("cloud_providers").update(payload).eq("id", initial.id)
      : await supabase.from("cloud_providers").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(initial ? "Updated" : "Created");
    setOpen(false); onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? "Edit cloud provider" : "Add cloud provider"}</DialogTitle>
          <DialogDescription>Each provider needs a unique name.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="prod-aws" /></div>
          <div className="space-y-1.5">
            <Label>Provider</Label>
            <Select value={kind} onValueChange={setKind}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{cloudKinds.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5"><Label>Region</Label><Input value={region} onChange={(e) => setRegion(e.target.value)} placeholder="eu-west-1" /></div>
          <div className="flex items-center justify-between rounded-md border border-border/50 px-3 py-2">
            <Label>Connected</Label>
            <Switch checked={connected} onCheckedChange={setConnected} />
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          {initial ? (
            <Button variant="ghost" className="text-destructive" onClick={async () => {
              const { error } = await supabase.from("cloud_providers").delete().eq("id", initial.id);
              if (error) return toast.error(error.message);
              toast.success("Removed"); setOpen(false); onSaved();
            }}><Trash2 className="h-3.5 w-3.5" /> Delete</Button>
          ) : <span />}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SourceFormDialog({ initial, onSaved, trigger }: { initial?: SourceRow; onSaved: () => void; trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(initial?.name ?? "");
  const [provider, setProvider] = useState(initial?.provider ?? sourceProvidersList[0]);
  const [account, setAccount] = useState(initial?.account ?? "");
  const [connected, setConnected] = useState(initial?.connected ?? false);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!name.trim()) return toast.error("Name is required");
    setSaving(true);
    const payload = { name: name.trim(), provider, account: account.trim() || null, connected };
    const { error } = initial
      ? await supabase.from("source_connections").update(payload).eq("id", initial.id)
      : await supabase.from("source_connections").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(initial ? "Updated" : "Created");
    setOpen(false); onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? "Edit source connection" : "Add source connection"}</DialogTitle>
          <DialogDescription>Each connection needs a unique name.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="github-main" /></div>
          <div className="space-y-1.5">
            <Label>Provider</Label>
            <Select value={provider} onValueChange={setProvider}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{sourceProvidersList.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5"><Label>Account / Org</Label><Input value={account} onChange={(e) => setAccount(e.target.value)} placeholder="dockier" /></div>
          <div className="flex items-center justify-between rounded-md border border-border/50 px-3 py-2">
            <Label>Connected</Label>
            <Switch checked={connected} onCheckedChange={setConnected} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SshFormDialog({ initial, onSaved, trigger }: { initial?: SshRow; onSaved: () => void; trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(initial?.name ?? "");
  const [fingerprint, setFingerprint] = useState(initial?.fingerprint ?? "");
  const [publicKey, setPublicKey] = useState(initial?.public_key ?? "");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!name.trim() || !fingerprint.trim()) return toast.error("Name and fingerprint are required");
    setSaving(true);
    const payload = { name: name.trim(), fingerprint: fingerprint.trim(), public_key: publicKey.trim() || null };
    const { error } = initial
      ? await supabase.from("ssh_keys").update(payload).eq("id", initial.id)
      : await supabase.from("ssh_keys").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(initial ? "Updated" : "Created");
    setOpen(false); onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? "Edit SSH key" : "Add SSH key"}</DialogTitle>
          <DialogDescription>Each key needs a unique name.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="MacBook Pro" /></div>
          <div className="space-y-1.5"><Label>Fingerprint</Label><Input value={fingerprint} onChange={(e) => setFingerprint(e.target.value)} placeholder="SHA256:…" /></div>
          <div className="space-y-1.5">
            <Label>Public key (optional)</Label>
            <textarea value={publicKey} onChange={(e) => setPublicKey(e.target.value)}
              className="min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 font-mono text-xs"
              placeholder="ssh-ed25519 AAAA…" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
