-- Hardening release MVP:
-- 1) Ensure catalog tables exist in fresh environments.
-- 2) Add RLS policies for users and catalog tables.
-- 3) Align predefined default_duration with UI unit (hours).

CREATE TABLE IF NOT EXISTS public.service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.predefined_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.service_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  default_price NUMERIC(12, 2) NOT NULL DEFAULT 10,
  default_duration INTEGER NOT NULL DEFAULT 1,
  sectors TEXT[] NOT NULL DEFAULT ARRAY[
    'Legal',
    'Fiscal',
    'Administración',
    'Tech',
    'Operaciones',
    'Marketing',
    'Finanzas'
  ]::TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(category_id, name)
);

CREATE TABLE IF NOT EXISTS public.provider_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  predefined_service_id UUID NOT NULL REFERENCES public.predefined_services(id) ON DELETE CASCADE,
  price NUMERIC(12, 2) NOT NULL CHECK (price > 0),
  duration INTEGER NOT NULL CHECK (duration > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(provider_id, predefined_service_id)
);

ALTER TABLE public.service_categories
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

ALTER TABLE public.predefined_services
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

ALTER TABLE public.provider_services
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_predefined_services_category_id ON public.predefined_services(category_id);
CREATE INDEX IF NOT EXISTS idx_provider_services_provider_id ON public.provider_services(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_services_predefined_service_id ON public.provider_services(predefined_service_id);
CREATE INDEX IF NOT EXISTS idx_predefined_services_sectors ON public.predefined_services USING GIN (sectors);

CREATE OR REPLACE FUNCTION public.set_service_categories_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_predefined_services_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_provider_services_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS service_categories_updated_at ON public.service_categories;
CREATE TRIGGER service_categories_updated_at
  BEFORE UPDATE ON public.service_categories
  FOR EACH ROW EXECUTE PROCEDURE public.set_service_categories_updated_at();

DROP TRIGGER IF EXISTS predefined_services_updated_at ON public.predefined_services;
CREATE TRIGGER predefined_services_updated_at
  BEFORE UPDATE ON public.predefined_services
  FOR EACH ROW EXECUTE PROCEDURE public.set_predefined_services_updated_at();

DROP TRIGGER IF EXISTS provider_services_updated_at ON public.provider_services;
CREATE TRIGGER provider_services_updated_at
  BEFORE UPDATE ON public.provider_services
  FOR EACH ROW EXECUTE PROCEDURE public.set_provider_services_updated_at();

ALTER TABLE public.predefined_services
  DROP CONSTRAINT IF EXISTS predefined_services_sectors_check;

ALTER TABLE public.predefined_services
  ADD CONSTRAINT predefined_services_sectors_check
  CHECK (
    cardinality(sectors) > 0
    AND sectors <@ ARRAY[
      'Legal',
      'Fiscal',
      'Administración',
      'Tech',
      'Operaciones',
      'Marketing',
      'Finanzas'
    ]::TEXT[]
  );

UPDATE public.predefined_services
SET default_duration = 1
WHERE default_duration IS NULL OR default_duration <= 0 OR default_duration >= 24;

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predefined_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_services ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_active_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.users u
    WHERE u.id = auth.uid()
      AND u.user_type = 'admin'
      AND COALESCE(u.status, 'active') = 'active'
  );
$$;

REVOKE ALL ON FUNCTION public.is_active_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_active_admin() TO authenticated;

DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
CREATE POLICY "Users can read own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can read all users" ON public.users;
CREATE POLICY "Admins can read all users"
  ON public.users
  FOR SELECT
  USING (public.is_active_admin());

DROP POLICY IF EXISTS "Admins can update all users" ON public.users;
CREATE POLICY "Admins can update all users"
  ON public.users
  FOR UPDATE
  USING (public.is_active_admin())
  WITH CHECK (public.is_active_admin());

DROP POLICY IF EXISTS "Admins can manage categories" ON public.service_categories;
CREATE POLICY "Admins can manage categories"
  ON public.service_categories
  FOR ALL
  USING (public.is_active_admin())
  WITH CHECK (public.is_active_admin());

DROP POLICY IF EXISTS "Providers can read categories" ON public.service_categories;
CREATE POLICY "Providers can read categories"
  ON public.service_categories
  FOR SELECT
  USING (
    public.is_active_admin()
    OR EXISTS (
      SELECT 1
      FROM public.users me
      WHERE me.id = auth.uid()
        AND me.user_type = 'provider'
        AND COALESCE(me.status, 'active') = 'active'
    )
  );

DROP POLICY IF EXISTS "Admins can manage predefined services" ON public.predefined_services;
CREATE POLICY "Admins can manage predefined services"
  ON public.predefined_services
  FOR ALL
  USING (public.is_active_admin())
  WITH CHECK (public.is_active_admin());

DROP POLICY IF EXISTS "Providers can read predefined services" ON public.predefined_services;
CREATE POLICY "Providers can read predefined services"
  ON public.predefined_services
  FOR SELECT
  USING (
    public.is_active_admin()
    OR EXISTS (
      SELECT 1
      FROM public.users me
      WHERE me.id = auth.uid()
        AND me.user_type = 'provider'
        AND COALESCE(me.status, 'active') = 'active'
    )
  );

DROP POLICY IF EXISTS "Providers can manage own provider services" ON public.provider_services;
CREATE POLICY "Providers can manage own provider services"
  ON public.provider_services
  FOR ALL
  USING (auth.uid() = provider_id)
  WITH CHECK (auth.uid() = provider_id);

DROP POLICY IF EXISTS "Admins can read provider services" ON public.provider_services;
CREATE POLICY "Admins can read provider services"
  ON public.provider_services
  FOR SELECT
  USING (public.is_active_admin());
