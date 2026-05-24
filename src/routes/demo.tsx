import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Calendar, Video, Loader2 } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/primitives/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { pageHead } from "@/lib/seo";
import { toast } from "sonner";

export const Route = createFileRoute("/demo")({
  head: () =>
    pageHead({
      path: "/demo",
      title: "Request a demo — Dockier",
      description:
        "See Dockier in action on your own repositories. Book a 30-minute personalised demo with one of our engineers.",
    }),
  component: DemoPage,
});

const teamSizes = [
  "1-5 engineers",
  "6-20 engineers",
  "21-50 engineers",
  "51-200 engineers",
  "200+ engineers",
] as const;

const repoOptions = [
  { id: "github", label: "GitHub" },
  { id: "gitlab", label: "GitLab" },
  { id: "bitbucket", label: "Bitbucket" },
  { id: "azure", label: "Azure DevOps" },
  { id: "other", label: "Other (self-hosted, Gitea, etc.)" },
] as const;

function DemoPage() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [teamSize, setTeamSize] = useState<string>("");
  const [useCase, setUseCase] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const toggleRepo = (id: string) => {
    setSelectedRepos((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/public/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          teamSize: teamSize || null,
          repoIntegrations: selectedRepos,
          useCase,
          source: "/demo",
        }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        error?: string;
      };
      if (!res.ok || !json.success) {
        toast.error(json.error ?? "Could not submit. Please try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageShell
      eyebrow="Book a demo"
      title={
        <>
          See Dockier in <span className="text-gradient-primary">action.</span>
        </>
      }
      description="Tell us about your team and we'll tailor a 30-minute walkthrough to your stack."
    >
      <Section>
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-3">
          {/* Sidebar info cards */}
          <div className="space-y-4 lg:col-span-1">
            {[
              {
                i: Video,
                t: "Live walkthrough",
                b: "30-minute screen-share tailored to your repos and workflows.",
              },
              {
                i: Calendar,
                t: "Flexible scheduling",
                b: "Pick a slot that works for your team — we're in most timezones.",
              },
              {
                i: Check,
                t: "No commitment",
                b: "We'll show you what's real today. No sales pressure, no credit card.",
              },
            ].map((c) => (
              <div
                key={c.t}
                className="rounded-2xl border border-border/50 bg-card/40 p-5 backdrop-blur"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                  <c.i className="h-4 w-4" />
                </div>
                <div className="mt-3 text-sm font-semibold">{c.t}</div>
                <div className="text-sm text-muted-foreground">{c.b}</div>
              </div>
            ))}
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur lg:col-span-2"
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold">
                  Demo request received
                </h3>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  Thanks for your interest. Our team will review your request
                  and reach out within one business day to schedule your demo.
                </p>
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={120}
                      className="mt-1.5 bg-background/60"
                      placeholder="Ada Lovelace"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Work email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      maxLength={255}
                      className="mt-1.5 bg-background/60"
                      placeholder="ada@company.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      maxLength={200}
                      className="mt-1.5 bg-background/60"
                      placeholder="Acme Inc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="team-size">Team size</Label>
                    <Select value={teamSize} onValueChange={setTeamSize} required>
                      <SelectTrigger
                        id="team-size"
                        className="mt-1.5 bg-background/60"
                      >
                        <SelectValue placeholder="Select team size" />
                      </SelectTrigger>
                      <SelectContent>
                        {teamSizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="sm:col-span-2">
                    <Label className="mb-2 block">
                      Repo integrations
                    </Label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {repoOptions.map((repo) => (
                        <div key={repo.id} className="flex items-center gap-2">
                          <Checkbox
                            id={repo.id}
                            checked={selectedRepos.includes(repo.id)}
                            onCheckedChange={() => toggleRepo(repo.id)}
                          />
                          <Label
                            htmlFor={repo.id}
                            className="cursor-pointer text-sm font-normal"
                          >
                            {repo.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <Label htmlFor="use-case">Use case</Label>
                    <Textarea
                      id="use-case"
                      rows={4}
                      required
                      value={useCase}
                      onChange={(e) => setUseCase(e.target.value)}
                      maxLength={4000}
                      className="mt-1.5 bg-background/60"
                      placeholder="We're migrating from legacy security tools and need a unified platform that covers SAST, dependency scanning, and deployment in one place..."
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="mt-5 w-full glow sm:w-auto"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    "Request demo"
                  )}
                </Button>
              </>
            )}
          </form>
        </div>
      </Section>
    </PageShell>
  );
}
