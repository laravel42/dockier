import { useState } from "react";
import { ArrowRight, Github } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CtaBand() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <div className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-card/60 p-10 text-center backdrop-blur-xl sm:p-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,oklch(0.78_0.14_180/20%),transparent_60%)]" />
        <h2 className="font-display mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-gradient sm:text-5xl">
          Start securing your repositories with AI.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Connect your first repo in under 60 seconds. Free for personal projects and open source.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setDone(true);
          }}
          className="mx-auto mt-8 flex max-w-md flex-col gap-2 sm:flex-row"
        >
          <Input
            type="email"
            required
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 bg-background/60"
          />
          <Button type="submit" size="lg" className="glow">
            {done ? "You're on the list" : <>Get early access <ArrowRight className="ml-1 h-4 w-4" /></>}
          </Button>
        </form>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link to="/contact">Book a demo</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <a href="https://github.com/dockier" target="_blank" rel="noreferrer">
              <Github className="h-4 w-4" /> Star on GitHub
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}