import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut, Shield, Sparkles, Rocket } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/marketing/logo";
import { toast } from "sonner";
import { pageHead } from "@/lib/seo";

type Profile = {
  display_name: string | null;
  email: string | null;
  avatar_url: string | null;
};

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => pageHead({ title: "Dashboard — Dockier", description: "Your Dockier workspace." }),
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("display_name, email, avatar_url")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => setProfile(data));
  }, [user]);

  const onSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/" });
  };

  const name = profile?.display_name ?? user?.email?.split("@")[0] ?? "there";

  return (
    <main className="min-h-screen">
      <header className="border-b border-border/40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={onSignOut}>
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="font-display text-3xl font-semibold">Welcome back, {name}</h1>
        <p className="mt-2 text-muted-foreground">Here's a quick view of your Dockier workspace.</p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <Card icon={<Shield className="h-4 w-4" />} title="Security" stat="0" hint="Active findings" />
          <Card icon={<Sparkles className="h-4 w-4" />} title="AI analyses" stat="0" hint="This month" />
          <Card icon={<Rocket className="h-4 w-4" />} title="Deployments" stat="0" hint="All time" />
        </div>

        <div className="mt-10 rounded-2xl border border-border/60 bg-card/40 p-8 text-center">
          <h2 className="font-display text-xl font-semibold">Connect your first repository</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Link a GitHub, GitLab, or Bitbucket repo to start scanning.
          </p>
          <Button className="glow mt-4">Connect repository</Button>
        </div>
      </section>
    </main>
  );
}

function Card({ icon, title, stat, hint }: { icon: React.ReactNode; title: string; stat: string; hint: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/40 p-5 backdrop-blur">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        <span className="flex h-7 w-7 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary">
          {icon}
        </span>
        {title}
      </div>
      <div className="mt-4 font-display text-3xl font-semibold">{stat}</div>
      <div className="text-xs text-muted-foreground">{hint}</div>
    </div>
  );
}