import { motion } from "framer-motion";
import { steps } from "@/lib/site";

export function HowItWorks() {
  return (
    <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border/50 bg-border/40 lg:grid-cols-4">
      {steps.map((s, i) => (
        <motion.div
          key={s.n}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.07 }}
          className="relative bg-card/60 p-7 backdrop-blur"
        >
          <div className="font-mono text-xs text-primary">{s.n}</div>
          <h3 className="mt-3 font-display text-lg font-semibold">{s.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
          {i < steps.length - 1 && (
            <div className="absolute right-0 top-1/2 hidden h-px w-6 -translate-y-1/2 translate-x-3 bg-gradient-to-r from-primary/60 to-transparent lg:block" />
          )}
        </motion.div>
      ))}
    </div>
  );
}