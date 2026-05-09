import { ecosystem } from "@/lib/site";

export function LogoMarquee() {
  const items = [...ecosystem, ...ecosystem];
  return (
    <div className="relative overflow-hidden border-y border-border/40 bg-background/40 py-10">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
      <div className="flex w-max animate-marquee gap-12 px-6">
        {items.map((name, i) => (
          <div
            key={name + i}
            className="flex h-10 items-center justify-center rounded-md border border-border/40 bg-card/30 px-5 text-sm font-medium text-muted-foreground"
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}