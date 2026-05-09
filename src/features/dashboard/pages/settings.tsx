import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { useAuth } from "@/hooks/use-auth";

export function SettingsPage() {
  const { user } = useAuth();
  return (
    <div>
      <PageHeader title="Settings" description="Manage your workspace, integrations and preferences." />

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-card/60">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <Card className="bg-card/60">
            <CardHeader>
              <CardTitle className="text-base">Profile</CardTitle>
              <CardDescription>How your account appears across Dockier.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-1.5">
                <Label htmlFor="email" className="text-xs">Email</Label>
                <Input id="email" defaultValue={user?.email ?? ""} className="max-w-md" disabled />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="name" className="text-xs">Display name</Label>
                <Input id="name" placeholder="Your name" className="max-w-md" />
              </div>
              <Separator />
              <Button size="sm" className="glow">Save changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-4">
          <Card className="bg-card/60">
            <CardHeader>
              <CardTitle className="text-base">Team</CardTitle>
              <CardDescription>Invite teammates and manage roles.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-4 py-3">
                <div>
                  <p className="text-sm font-medium">{user?.email ?? "you@example.com"}</p>
                  <p className="text-xs text-muted-foreground">Owner · joined today</p>
                </div>
                <Button size="sm" variant="outline">Manage</Button>
              </div>
              <Button size="sm" variant="outline">Invite member</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="mt-4">
          <Card className="bg-card/60">
            <CardHeader>
              <CardTitle className="text-base">Integrations</CardTitle>
              <CardDescription>Connect Git providers and deployment targets.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 sm:grid-cols-2">
              {["GitHub", "GitLab", "Bitbucket", "Vercel", "Fly.io", "AWS"].map((p) => (
                <div key={p} className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-4 py-3">
                  <span className="text-sm font-medium">{p}</span>
                  <Button size="sm" variant="outline">Connect</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <Card className="bg-card/60">
            <CardHeader>
              <CardTitle className="text-base">Security</CardTitle>
              <CardDescription>Authentication and access policies.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Require 2FA for all members", on: false },
                { label: "Block builds with critical findings", on: true },
                { label: "Auto re-scan on every push", on: true },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between">
                  <Label className="text-sm">{row.label}</Label>
                  <Switch defaultChecked={row.on} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card className="bg-card/60">
            <CardHeader>
              <CardTitle className="text-base">Notifications</CardTitle>
              <CardDescription>Choose how you want to be alerted.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {["Email", "Slack", "Webhook"].map((c) => (
                <div key={c} className="flex items-center justify-between">
                  <Label className="text-sm">{c}</Label>
                  <Switch defaultChecked={c === "Email"} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}