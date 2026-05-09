import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { Section, SectionHeading } from "@/components/primitives/section";

export function PageShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main>
        <div className="relative overflow-hidden border-b border-border/40">
          <div className="absolute inset-0 grid-bg" aria-hidden />
          <div className="absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,oklch(0.78_0.14_180/12%),transparent_60%)]" aria-hidden />
          <Section className="relative py-20 lg:py-28">
            <SectionHeading eyebrow={eyebrow} title={title} description={description} />
          </Section>
        </div>
        {children}
      </main>
      <SiteFooter />
    </>
  );
}