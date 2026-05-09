import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { features } from "@/lib/site";

export function FeatureGrid() {
  return (
    <div className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {features.map((f, i) => (
        <motion.article
          key={f.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, delay: (i % 3) * 0.05 }}
          className="group relative rounded-xl border border-border/50 bg-card/40 p-5 backdrop-blur transition-all hover:border-primary/40 hover:bg-card/60"
        >
          <div className="absolute inset-0 -z-10 rounded-2xl bg-[radial-gradient(circle_at_top_left,oklch(0.78_0.14_180/12%),transparent_60%)] opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
            <f.icon className="h-4 w-4" />
          </div>
          <h3 className="mt-4 font-display text-base font-semibold">{f.title}</h3>
          <p className="mt-1.5 text-[13px] text-muted-foreground">{f.blurb}</p>
          <ul className="mt-3 space-y-1.5">
            {f.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2 text-[12.5px]">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                <span className="text-muted-foreground">{b}</span>
              </li>
            ))}
          </ul>
        </motion.article>
      ))}
    </div>
  );
}