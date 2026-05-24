import { useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    try {
      const res = await fetch("/api/public/waitlist-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: parsed.data, source }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        alreadyExists?: boolean;
        error?: string;
      };
      if (!res.ok || !json.success) {
        setStatus("error");
        setMessage(json.error ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      setMessage(
        json.alreadyExists
          ? "You're already on the list — we'll be in touch."
          : "You're on the list — check your inbox for a confirmation.",
      );
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
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