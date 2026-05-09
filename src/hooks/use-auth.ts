import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const claims = (session?.user?.app_metadata ?? {}) as Record<string, unknown>;
  // Decode roles from JWT custom claims (set by custom_access_token_hook)
  const decoded = decodeJwt(session?.access_token);
  const roles: string[] = Array.isArray(decoded?.user_roles) ? (decoded!.user_roles as string[]) : [];
  const isAdmin: boolean = Boolean(decoded?.is_admin);

  const hasRole = (role: string) => roles.includes(role);

  return { session, user, loading, roles, isAdmin, hasRole, claims };
}

function decodeJwt(token?: string | null): Record<string, unknown> | null {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}