
-- Demo requests table
CREATE TABLE public.demo_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  team_size TEXT,
  repo_integrations TEXT[] DEFAULT '{}'::text[],
  use_case TEXT NOT NULL,
  source TEXT,
  user_agent TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_demo_requests_created_at ON public.demo_requests (created_at DESC);
CREATE INDEX idx_demo_requests_status ON public.demo_requests (status);

ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a demo request"
  ON public.demo_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL
    AND char_length(email) <= 255
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND char_length(name) BETWEEN 1 AND 120
    AND char_length(company) BETWEEN 1 AND 200
    AND char_length(use_case) BETWEEN 1 AND 4000
    AND (team_size IS NULL OR char_length(team_size) <= 64)
    AND (source IS NULL OR char_length(source) <= 64)
    AND (user_agent IS NULL OR char_length(user_agent) <= 512)
    AND coalesce(array_length(repo_integrations, 1), 0) <= 20
  );

CREATE POLICY "Admins can view demo requests"
  ON public.demo_requests
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update demo requests"
  ON public.demo_requests
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete demo requests"
  ON public.demo_requests
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER demo_requests_set_updated_at
  BEFORE UPDATE ON public.demo_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Admin email allowlist
CREATE TABLE public.admin_email_allowlist (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_email_allowlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view allowlist"
  ON public.admin_email_allowlist
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage allowlist"
  ON public.admin_email_allowlist
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.admin_email_allowlist (email) VALUES ('hello@laravel42.com')
  ON CONFLICT (email) DO NOTHING;

-- Grant admin role on signup if email is in allowlist
CREATE OR REPLACE FUNCTION public.grant_admin_role_if_allowlisted()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.admin_email_allowlist
    WHERE lower(email) = lower(NEW.email)
  ) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_grant_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_grant_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.grant_admin_role_if_allowlisted();

-- Also create handle_new_user trigger if missing (profiles)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Backfill: if hello@laravel42.com already exists, grant admin now
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::app_role
FROM auth.users u
JOIN public.admin_email_allowlist a ON lower(a.email) = lower(u.email)
ON CONFLICT DO NOTHING;
