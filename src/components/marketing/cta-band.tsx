import { Github } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { WaitlistForm } from "./waitlist-form";

export function CtaBand() {
  return (
    <div id="early-access" className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-card/60 p-10 text-center backdrop-blur-xl sm:p-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,oklch(0.78_0.14_180/20%),transparent_60%)]" />
        <h2 className="font-display mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-gradient sm:text-5xl">
          Start securing your repositories with AI.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Connect your first repo in under 60 seconds. Free for personal projects and open source.
        </p>
        <div className="mt-8">
          <WaitlistForm source="cta-band" />
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link to="/demo">Book a demo</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <a href="https://github.com/laravel42/dockier" target="_blank" rel="noreferrer">
              <Github className="h-4 w-4" /> Star on GitHub
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}