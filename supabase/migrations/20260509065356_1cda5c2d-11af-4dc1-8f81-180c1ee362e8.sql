
-- Grant admin to current user
INSERT INTO public.user_roles (user_id, role)
VALUES ('85ee92d1-9e22-4b86-9023-8d7db60455fa', 'admin')
ON CONFLICT DO NOTHING;

-- Custom access token hook: inject user_roles into JWT claims
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  claims jsonb;
  user_roles_arr jsonb;
BEGIN
  SELECT COALESCE(jsonb_agg(role::text), '[]'::jsonb)
  INTO user_roles_arr
  FROM public.user_roles
  WHERE user_id = (event->>'user_id')::uuid;

  claims := event->'claims';
  claims := jsonb_set(claims, '{user_roles}', user_roles_arr);
  claims := jsonb_set(claims, '{is_admin}',
    to_jsonb(EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = (event->>'user_id')::uuid AND role = 'admin'
    ))
  );

  event := jsonb_set(event, '{claims}', claims);
  RETURN event;
END;
$$;

GRANT EXECUTE ON FUNCTION public.custom_access_token_hook(jsonb) TO supabase_auth_admin;
GRANT ALL ON TABLE public.user_roles TO supabase_auth_admin;
REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook(jsonb) FROM authenticated, anon, public;

CREATE POLICY "Auth admin can read user roles"
ON public.user_roles
FOR SELECT
TO supabase_auth_admin
USING (true);

-- Cloud providers
CREATE TABLE public.cloud_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  kind text NOT NULL,
  region text,
  connected boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.cloud_providers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view cloud providers" ON public.cloud_providers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage cloud providers insert" ON public.cloud_providers FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage cloud providers update" ON public.cloud_providers FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage cloud providers delete" ON public.cloud_providers FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_cloud_providers_updated BEFORE UPDATE ON public.cloud_providers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Source connections
CREATE TABLE public.source_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  provider text NOT NULL,
  account text,
  connected boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.source_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view source connections" ON public.source_connections FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage source insert" ON public.source_connections FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage source update" ON public.source_connections FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage source delete" ON public.source_connections FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_source_connections_updated BEFORE UPDATE ON public.source_connections FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- SSH keys
CREATE TABLE public.ssh_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  fingerprint text NOT NULL,
  public_key text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.ssh_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view ssh keys" ON public.ssh_keys FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage ssh insert" ON public.ssh_keys FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage ssh update" ON public.ssh_keys FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage ssh delete" ON public.ssh_keys FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_ssh_keys_updated BEFORE UPDATE ON public.ssh_keys FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
