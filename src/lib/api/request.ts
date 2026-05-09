// Thin fetch wrapper for the Encore backend. The base URL is read from
// VITE_ENCORE_API_URL (with a sensible local default); the Authorization
// header is sourced from the active Supabase session so that Encore's auth
// handler can validate it. To make Encore accept Supabase JWTs, set
// `JwtSecret` on the Encore side to the same value as the Supabase project's
// JWT secret — no other backend change is required.

import { supabase } from "@/integrations/supabase/client";

const API_BASE =
  (import.meta.env.VITE_ENCORE_API_URL as string | undefined) ||
  (import.meta.env.VITE_API_BASE as string | undefined) ||
  "http://localhost:4000";

async function getAccessToken(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  } catch {
    return null;
  }
}

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getAccessToken();
  const headers: Record<string, string> = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> | undefined),
  };

  // Allow callers to strip the Authorization header explicitly by passing
  // headers: { Authorization: "" }. This matches the legacy contract.
  if (headers.Authorization === "") delete headers.Authorization;
  if (!headers.Authorization) delete headers.Authorization;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || error.code || "Request failed");
  }

  // Some Encore endpoints (DELETE, PUT toggles) may legitimately return an
  // empty body; treat that as undefined.
  const text = await res.text();
  if (!text) return undefined as unknown as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}

export const apiBase = API_BASE;
