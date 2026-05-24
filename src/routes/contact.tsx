import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, Calendar, Github } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/primitives/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { pageHead } from "@/lib/seo";
import { site } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => pageHead({
      path: "/contact",
    title: "Contact — Dockier",
    description: "Talk to the Dockier team. Ask product questions, get help with onboarding, or just say hi — we answer within one business day.",
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <PageShell
      eyebrow="Contact"
      title={<>Talk to the team <span className="text-gradient-primary">building Dockier.</span></>}
      description="Tell us what you're shipping. We'll show you how Dockier fits in — or honestly say if it doesn't."
    >
      <Section>
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-1">
            {[
              { i: Mail, t: "Email", b: site.email },
              { i: Calendar, t: "Book a demo", b: "30-min call with an engineer" },
              { i: Github, t: "Open source", b: "github.com/laravel42/dockier" },
            ].map((c) => (
              <div key={c.t} className="rounded-2xl border border-border/50 bg-card/40 p-5 backdrop-blur">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                  <c.i className="h-4 w-4" />
                </div>
                <div className="mt-3 text-sm font-semibold">{c.t}</div>
                <div className="text-sm text-muted-foreground">{c.b}</div>
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            className="rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur lg:col-span-2"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" required className="mt-1.5 bg-background/60" placeholder="Ada Lovelace" />
              </div>
              <div>
                <Label htmlFor="email">Work email</Label>
                <Input id="email" type="email" required className="mt-1.5 bg-background/60" placeholder="ada@company.com" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" className="mt-1.5 bg-background/60" placeholder="Acme Inc." />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="msg">What are you trying to do?</Label>
                <Textarea id="msg" rows={4} className="mt-1.5 bg-background/60" placeholder="We're a Series A SaaS team looking to consolidate Snyk + Sonar + a deploy tool…" />
              </div>
            </div>
            <Button type="submit" size="lg" className="mt-5 w-full glow sm:w-auto">
              {sent ? "Thanks — we'll be in touch" : "Send message"}
            </Button>
          </form>
        </div>
      </Section>
    </PageShell>
  );
}