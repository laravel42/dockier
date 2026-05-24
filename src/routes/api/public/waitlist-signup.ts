import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { enqueueTransactionalEmail } from "@/lib/email/server-send";

const schema = z.object({
  email: z.string().trim().email().max(255),
  source: z.string().trim().max(64).optional().nullable(),
});

export const Route = createFileRoute("/api/public/waitlist-signup")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }
        const parsed = schema.safeParse(body);
        if (!parsed.success) {
          return Response.json({ error: "Invalid input" }, { status: 400 });
        }
        const { email, source } = parsed.data;

        const supabaseUrl =
          process.env.SUPABASE_URL ?? import.meta.env.VITE_SUPABASE_URL;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!supabaseUrl || !serviceKey) {
          return Response.json({ error: "Server misconfigured" }, { status: 500 });
        }
        const supabase = createClient(supabaseUrl, serviceKey);
        const userAgent = request.headers.get("user-agent")?.slice(0, 512) ?? null;

        const { error } = await supabase
          .from("waitlist_leads")
          .insert({ email, source: source ?? null, user_agent: userAgent });

        const alreadyExists = error?.code === "23505";
        if (error && !alreadyExists) {
          return Response.json({ error: "Failed to save" }, { status: 500 });
        }

        if (!alreadyExists) {
          try {
            await enqueueTransactionalEmail({
              templateName: "waitlist-confirmation",
              recipientEmail: email,
              idempotencyKey: `waitlist-${email.toLowerCase()}`,
              templateData: { email },
            });
          } catch (e) {
            console.error("Waitlist confirmation email failed", e);
          }
        }

        return Response.json({ success: true, alreadyExists });
      },
    },
  },
});