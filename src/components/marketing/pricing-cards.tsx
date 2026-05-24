import { Check } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { pricing } from "@/lib/site";

export function PricingCards() {
  return (
    <div className="mt-12 grid gap-6 lg:grid-cols-3">
      {pricing.map((p) => (
        <div
          key={p.name}
          className={`relative flex flex-col rounded-2xl border p-7 backdrop-blur transition-all ${
            p.highlight
              ? "border-primary/50 bg-card/70 shadow-[var(--shadow-glow)]"
              : "border-border/50 bg-card/40 hover:border-border"
          }`}
        >
          {p.highlight && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
              Most popular
            </span>
          )}
          <h3 className="font-display text-xl font-semibold">{p.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{p.blurb}</p>
          <div className="mt-6 flex items-baseline gap-1">
            <span className="font-display text-4xl font-semibold text-gradient">{p.price}</span>
            <span className="text-sm text-muted-foreground">{p.period}</span>
          </div>
          <ul className="mt-6 flex-1 space-y-3">
            {p.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="text-muted-foreground">{f}</span>
              </li>
            ))}
          </ul>
          <Button className={`mt-7 ${p.highlight ? "glow" : ""}`} variant={p.highlight ? "default" : "outline"} asChild>
            <a href="#early-access">{p.cta}</a>
          </Button>
        </div>
      ))}
    </div>
  );
}