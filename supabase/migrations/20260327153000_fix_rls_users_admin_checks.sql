-- Fix RLS recursion/permission issues introduced by admin checks
-- that queried public.users from policies on the same table.

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

DROP POLICY IF EXISTS "Admins can read provider services" ON public.provider_services;
CREATE POLICY "Admins can read provider services"
  ON public.provider_services
  FOR SELECT
  USING (public.is_active_admin());
