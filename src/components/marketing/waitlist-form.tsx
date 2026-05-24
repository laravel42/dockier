import { useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .max(255, "Email is too long")
  .email("Enter a valid email");

type WaitlistFormProps = {
  source: string;
  className?: string;
  size?: "default" | "lg";
  inputClassName?: string;
  buttonLabel?: string;
};

export function WaitlistForm({
  source,
  className,
  size = "default",
  inputClassName,
  buttonLabel = "Get early access",
}: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setStatus("error");
      setMessage(parsed.error.issues[0]?.message ?? "Invalid email");
      return;
    }

    setStatus("loading");
    const userAgent = typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 512) : null;
    const { error } = await supabase
      .from("waitlist_leads")
      .insert({ email: parsed.data, source, user_agent: userAgent });

    if (error) {
      // Unique violation = already on the list, still a success from user POV
      if (error.code === "23505") {
        setStatus("success");
        setMessage("You're already on the list — we'll be in touch.");
        return;
      }
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
      return;
    }

    setStatus("success");
    setMessage("You're on the list — we'll be in touch shortly.");
    setEmail("");
  }

  if (status === "success") {
    return (
      <div
        className={cn(
          "mx-auto flex max-w-md items-center justify-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-foreground",
          className,
        )}
        role="status"
      >
        <CheckCircle2 className="h-4 w-4 text-primary" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("mx-auto flex w-full max-w-md flex-col gap-2 sm:flex-row", className)}
      noValidate
    >
      <div className="flex-1">
        <Input
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          aria-label="Work email"
          aria-invalid={status === "error"}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          className={cn(size === "lg" ? "h-12" : "h-11", "bg-background/60", inputClassName)}
          disabled={status === "loading"}
          maxLength={255}
        />
        {status === "error" && message && (
          <p className="mt-1 text-left text-xs text-destructive">{message}</p>
        )}
      </div>
      <Button
        type="submit"
        size={size === "lg" ? "lg" : "default"}
        className={cn("glow", size === "lg" && "h-12 px-6 text-base")}
        disabled={status === "loading"}
      >
        {status === "loading" ? (
          <>
            <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Submitting
          </>
        ) : (
          <>
            {buttonLabel} <ArrowRight className="ml-1 h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}