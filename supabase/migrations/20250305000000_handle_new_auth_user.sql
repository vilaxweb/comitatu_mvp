-- Trigger: al crear un usuario en Supabase Auth, insertar una fila en public.users
-- Requisito: la columna password_hash debe aceptar NULL (Supabase Auth guarda el hash en auth.users).

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    password_hash,
    username,
    user_type,
    status,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    NULL,  -- Supabase Auth gestiona la contraseña en auth.users
    COALESCE(
      NULLIF(TRIM(COALESCE(NEW.raw_user_meta_data->>'username', '')), ''),
      NULLIF(TRIM(NEW.email), ''),
      'u' || replace(NEW.id::text, '-', '')  -- fallback único si se crea desde Dashboard sin metadata
    ),
    CASE
      WHEN NEW.raw_user_meta_data->>'user_type' IN ('provider', 'customer', 'admin') THEN NEW.raw_user_meta_data->>'user_type'
      ELSE 'customer'
    END,
    COALESCE(
      NULLIF(TRIM(COALESCE(NEW.raw_user_meta_data->>'status', '')), ''),
      'active'
    ),
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    username = EXCLUDED.username,
    updated_at = now();
  RETURN NEW;
EXCEPTION
  WHEN not_null_violation THEN
    RAISE EXCEPTION 'La tabla users tiene una columna NOT NULL sin valor (¿password_hash?). Revisa la migración o permite NULL en esa columna.';
  WHEN OTHERS THEN
    RAISE;
END;
$$;

-- Trigger en auth.users (solo si no existe)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_auth_user();
