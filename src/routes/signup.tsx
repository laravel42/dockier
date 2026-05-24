import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Github } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/signup")({
  head: () => pageHead({
      path: "/signup", title: "Create account — Dockier", description: "Create your free Dockier account in under a minute. Connect a repository and start scanning today." }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,
        data: { display_name: name },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Check your email to confirm your account");
    navigate({ to: "/login" });
  };

  const onGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/admin",
    });
    if (result.error) toast.error("Google sign-up failed");
    if (result.redirected) return;
    navigate({ to: "/admin" });
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card/60 p-8 backdrop-blur">
        <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">← Back to home</Link>
        <h1 className="mt-4 font-display text-2xl font-semibold">Create your account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Free for personal projects and OSS.</p>

        <div className="mt-6 grid gap-2">
          <Button type="button" variant="outline" onClick={onGoogle} className="w-full">
            <span className="inline-block h-4 w-4 rounded-full bg-gradient-to-br from-[#EA4335] via-[#FBBC04] to-[#34A853]" /> Continue with Google
          </Button>
          <Button type="button" variant="outline" disabled className="w-full" title="GitHub OAuth requires a custom Supabase setup">
            <Github className="h-4 w-4" /> Continue with GitHub
          </Button>
        </div>

        <div className="my-6 flex items-center gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
          <div className="h-px flex-1 bg-border/60" /> or <div className="h-px flex-1 bg-border/60" />
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Display name</Label>
            <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Lovelace" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Work email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
            <p className="text-[11px] text-muted-foreground">Minimum 8 characters.</p>
          </div>
          <Button type="submit" className="glow w-full" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-foreground hover:underline">Sign in</Link>
        </p>
      </div>
    </main>
  );
}