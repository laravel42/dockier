import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const typographyVariants = cva("text-foreground", {
  variants: {
    variant: {
      display:
        "font-display font-semibold text-[length:var(--fs-display)] leading-[var(--lh-tight)] tracking-[var(--tracking-display)]",
      h1: "font-display font-semibold text-[length:var(--fs-h1)] leading-[var(--lh-tight)] tracking-[var(--tracking-display)]",
      headline:
        "font-display font-semibold text-[length:var(--fs-h2)] leading-[var(--lh-snug)] tracking-[-0.03em]",
      title:
        "font-display font-semibold text-[length:var(--fs-h3)] leading-[1.2] tracking-[var(--tracking-heading)]",
      subtitle:
        "font-display font-medium text-[length:var(--fs-h4)] leading-[1.3] tracking-[var(--tracking-heading)]",
      lead: "text-[length:var(--fs-h4)] leading-[1.5] text-muted-foreground max-w-[var(--measure)]",
      body: "text-[length:var(--fs-body)] leading-[var(--lh-body)] max-w-[var(--measure)]",
      muted:
        "text-[length:var(--fs-body)] leading-[var(--lh-body)] text-muted-foreground max-w-[var(--measure)]",
      small: "text-[length:var(--fs-small)] leading-[1.5] text-muted-foreground",
      caption: "text-[length:var(--fs-small)] leading-[1.4] text-muted-foreground",
      monoLabel:
        "font-mono uppercase text-[length:var(--fs-mono-label)] tracking-[var(--tracking-eyebrow)] text-muted-foreground",
    },
    tone: {
      default: "",
      gradient: "text-gradient",
      primary: "text-gradient-primary",
      muted: "text-muted-foreground",
    },
  },
  defaultVariants: { variant: "body", tone: "default" },
});

type Tag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div" | "label";

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: Tag;
  asChild?: boolean;
}

const defaultTagFor: Record<NonNullable<TypographyProps["variant"]>, Tag> = {
  display: "h1",
  h1: "h1",
  headline: "h2",
  title: "h3",
  subtitle: "h4",
  lead: "p",
  body: "p",
  muted: "p",
  small: "small" as Tag,
  caption: "span",
  monoLabel: "span",
};

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant, tone, as, asChild, ...props }, ref) => {
    const Tag = (asChild ? Slot : as ?? defaultTagFor[variant ?? "body"]) as React.ElementType;
    return (
      <Tag
        ref={ref as never}
        className={cn(typographyVariants({ variant, tone }), className)}
        {...props}
      />
    );
  },
);
Typography.displayName = "Typography";

export { typographyVariants };

export function Prose({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "[&>p]:mt-4 [&>p:first-child]:mt-0 [&>p]:max-w-[var(--measure)] [&>h2]:mt-10 [&>h3]:mt-8 [&>ul]:mt-4 [&>ul]:max-w-[var(--measure)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
