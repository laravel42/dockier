import * as React from "react";
import { render } from "@react-email/components";
import { createClient } from "@supabase/supabase-js";
import { TEMPLATES } from "@/lib/email-templates/registry";

const SITE_NAME = "dockier";
const SENDER_DOMAIN = "notify.dockier.dev";
const FROM_DOMAIN = "dockier.dev";

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

interface EnqueueParams {
  templateName: string;
  recipientEmail?: string;
  templateData?: Record<string, unknown>;
  idempotencyKey?: string;
}

/**
 * Server-only: enqueue a transactional email using the service role key.
 * Use this from public API routes (forms, webhooks) where there is no
 * authenticated Supabase user. Mirrors the queue/log behaviour of
 * /lovable/email/transactional/send.
 */
export async function enqueueTransactionalEmail(params: EnqueueParams) {
  const supabaseUrl =
    process.env.SUPABASE_URL ?? import.meta.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    throw new Error("Supabase service credentials not configured");
  }

  const template = TEMPLATES[params.templateName];
  if (!template) {
    throw new Error(`Unknown email template: ${params.templateName}`);
  }

  const recipient = template.to || params.recipientEmail;
  if (!recipient) {
    throw new Error("recipientEmail is required");
  }

  const supabase = createClient(supabaseUrl, serviceKey);
  const normalized = recipient.toLowerCase();
  const messageId = crypto.randomUUID();
  const idempotencyKey = params.idempotencyKey ?? messageId;
  const templateData = params.templateData ?? {};

  // Suppression check
  const { data: suppressed } = await supabase
    .from("suppressed_emails")
    .select("id")
    .eq("email", normalized)
    .maybeSingle();
  if (suppressed) {
    await supabase.from("email_send_log").insert({
      message_id: messageId,
      template_name: params.templateName,
      recipient_email: recipient,
      status: "suppressed",
    });
    return { success: false, reason: "email_suppressed" as const };
  }

  // Unsubscribe token
  let unsubscribeToken: string;
  const { data: existing } = await supabase
    .from("email_unsubscribe_tokens")
    .select("token, used_at")
    .eq("email", normalized)
    .maybeSingle();
  if (existing && !existing.used_at) {
    unsubscribeToken = existing.token;
  } else {
    unsubscribeToken = generateToken();
    await supabase
      .from("email_unsubscribe_tokens")
      .upsert(
        { token: unsubscribeToken, email: normalized },
        { onConflict: "email", ignoreDuplicates: true },
      );
    const { data: stored } = await supabase
      .from("email_unsubscribe_tokens")
      .select("token")
      .eq("email", normalized)
      .maybeSingle();
    if (stored?.token) unsubscribeToken = stored.token;
  }

  // Render
  const element = React.createElement(template.component, templateData);
  const html = await render(element);
  const text = await render(element, { plainText: true });
  const subject =
    typeof template.subject === "function"
      ? template.subject(templateData)
      : template.subject;

  await supabase.from("email_send_log").insert({
    message_id: messageId,
    template_name: params.templateName,
    recipient_email: recipient,
    status: "pending",
  });

  const { error: enqueueError } = await supabase.rpc("enqueue_email", {
    queue_name: "transactional_emails",
    payload: {
      message_id: messageId,
      to: recipient,
      from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
      sender_domain: SENDER_DOMAIN,
      subject,
      html,
      text,
      purpose: "transactional",
      label: params.templateName,
      idempotency_key: idempotencyKey,
      unsubscribe_token: unsubscribeToken,
      queued_at: new Date().toISOString(),
    },
  });

  if (enqueueError) {
    await supabase.from("email_send_log").insert({
      message_id: messageId,
      template_name: params.templateName,
      recipient_email: recipient,
      status: "failed",
      error_message: enqueueError.message,
    });
    throw new Error(`Failed to enqueue email: ${enqueueError.message}`);
  }

  return { success: true as const, messageId };
}