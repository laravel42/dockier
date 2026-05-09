import { motion } from "framer-motion";
import { stats } from "@/lib/site";

export function StatsStrip() {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/40 bg-border/40 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
          className="bg-background/80 p-8 text-center backdrop-blur"
        >
          <div className="font-display text-4xl font-semibold text-gradient-primary">{s.value}</div>
          <div className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
        </motion.div>
      ))}
    </div>
  );
}