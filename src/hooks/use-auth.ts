import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [dbRoles, setDbRoles] = useState<string[]>([]);

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

  // Decode roles from JWT custom claims (set by custom_access_token_hook).
  // Fallback to fetching from user_roles when the auth hook is not enabled.
  const decoded = decodeJwt(session?.access_token);
  const jwtRoles: string[] = Array.isArray(decoded?.user_roles)
    ? (decoded!.user_roles as string[])
    : [];

  useEffect(() => {
    if (!user) {
      setDbRoles([]);
      return;
    }
    if (jwtRoles.length > 0) return;
    let cancelled = false;
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (!cancelled && data) setDbRoles(data.map((r) => r.role as string));
      });
    return () => {
      cancelled = true;
    };
  }, [user, jwtRoles.length]);

  const roles = jwtRoles.length > 0 ? jwtRoles : dbRoles;
  const isAdmin = Boolean(decoded?.is_admin) || roles.includes("admin");
  const hasRole = (role: string) => roles.includes(role);

  return { session, user, loading, roles, isAdmin, hasRole };
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