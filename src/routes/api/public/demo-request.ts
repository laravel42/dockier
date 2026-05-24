import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { enqueueTransactionalEmail } from "@/lib/email/server-send";

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  company: z.string().trim().min(1).max(200),
  teamSize: z.string().trim().max(64).optional().nullable(),
  repoIntegrations: z.array(z.string().trim().min(1).max(64)).max(20).optional(),
  useCase: z.string().trim().min(1).max(4000),
  source: z.string().trim().max(64).optional().nullable(),
});

export const Route = createFileRoute("/api/public/demo-request")({
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
          return Response.json(
            { error: "Invalid input", issues: parsed.error.issues },
            { status: 400 },
          );
        }
        const data = parsed.data;

        const supabaseUrl =
          process.env.SUPABASE_URL ?? import.meta.env.VITE_SUPABASE_URL;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!supabaseUrl || !serviceKey) {
          return Response.json(
            { error: "Server misconfigured" },
            { status: 500 },
          );
        }

        const supabase = createClient(supabaseUrl, serviceKey);
        const userAgent = request.headers.get("user-agent")?.slice(0, 512) ?? null;

        const { data: inserted, error } = await supabase
          .from("demo_requests")
          .insert({
            name: data.name,
            email: data.email,
            company: data.company,
            team_size: data.teamSize ?? null,
            repo_integrations: data.repoIntegrations ?? [],
            use_case: data.useCase,
            source: data.source ?? "/demo",
            user_agent: userAgent,
          })
          .select("id")
          .single();

        if (error || !inserted) {
          console.error("Failed to insert demo request", error);
          return Response.json(
            { error: "Failed to save request" },
            { status: 500 },
          );
        }

        // Fire-and-forget emails — failure should not break the form.
        try {
          await enqueueTransactionalEmail({
            templateName: "demo-request-confirmation",
            recipientEmail: data.email,
            idempotencyKey: `demo-confirm-${inserted.id}`,
            templateData: { name: data.name, company: data.company },
          });
        } catch (e) {
          console.error("Demo confirmation email failed", e);
        }
        try {
          await enqueueTransactionalEmail({
            templateName: "demo-request-team-notification",
            idempotencyKey: `demo-notify-${inserted.id}`,
            templateData: {
              name: data.name,
              email: data.email,
              company: data.company,
              teamSize: data.teamSize ?? "—",
              repoIntegrations: data.repoIntegrations ?? [],
              useCase: data.useCase,
              source: data.source ?? "/demo",
            },
          });
        } catch (e) {
          console.error("Team notification email failed", e);
        }

        return Response.json({ success: true, id: inserted.id });
      },
    },
  },
});