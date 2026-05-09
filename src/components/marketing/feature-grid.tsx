import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { features } from "@/lib/site";
import { Typography } from "@/components/ui/typography";

export function FeatureGrid() {
  return (
    <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {features.map((f, i) => (
        <motion.article
          key={f.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, delay: (i % 3) * 0.05 }}
          className="group relative rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur transition-all hover:border-primary/40 hover:bg-card/60"
        >
          <div className="absolute inset-0 -z-10 rounded-2xl bg-[radial-gradient(circle_at_top_left,oklch(0.78_0.14_180/12%),transparent_60%)] opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
            <f.icon className="h-5 w-5" />
          </div>
          <Typography variant="title" as="h3" className="mt-5">
            {f.title}
          </Typography>
          <Typography variant="muted" as="p" className="mt-2 text-[length:var(--fs-small)]">
            {f.blurb}
          </Typography>
          <ul className="mt-4 space-y-2">
            {f.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="text-muted-foreground">{b}</span>
              </li>
            ))}
          </ul>
        </motion.article>
      ))}
    </div>
  );
}