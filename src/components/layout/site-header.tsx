import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { nav } from "@/lib/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div className="pointer-events-auto flex w-full max-w-3xl items-center justify-between gap-2 rounded-full border border-border/60 bg-background/70 px-2 py-2 shadow-[var(--shadow-elevated)] backdrop-blur-xl">
        <nav className="hidden items-center gap-1 pl-3 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
              activeProps={{ className: "bg-muted/70 text-foreground" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost" size="sm" className="rounded-full">
            <Link to="/contact">Sign in</Link>
          </Button>
          <Button asChild size="sm" className="glow rounded-full">
            <Link to="/contact">
              Start free <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
        <button
          className="ml-auto rounded-full p-2 md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="pointer-events-auto fixed inset-x-4 top-20 rounded-2xl border border-border/60 bg-background/95 p-4 shadow-[var(--shadow-elevated)] backdrop-blur-xl md:hidden">
          <nav className="flex flex-col">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="py-2 text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                {n.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2">
              <Button asChild variant="outline" size="sm" className="rounded-full">
                <Link to="/contact">Sign in</Link>
              </Button>
              <Button asChild size="sm" className="rounded-full">
                <Link to="/contact">Start free</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}