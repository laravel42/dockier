import type { ReactNode } from "react";
import { Typography } from "@/components/ui/typography";

export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}
      style={{ paddingTop: "var(--space-section-y)", paddingBottom: "var(--space-section-y)" }}
    >
      {children}
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 font-mono text-[length:var(--fs-mono-label)] uppercase tracking-[var(--tracking-eyebrow)] text-primary">
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
}) {
  const alignCls = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`max-w-[60ch] ${alignCls}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <Typography variant="headline" as="h2" tone="gradient" className="mt-4">
        {title}
      </Typography>
      {description && (
        <Typography variant="lead" as="p" className={`mt-3 ${align === "center" ? "mx-auto" : ""}`}>
          {description}
        </Typography>
      )}
    </div>
  );
}