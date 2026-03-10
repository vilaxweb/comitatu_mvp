-- Crear usuario proveedor manualmente en public.users
--
-- Paso 1: Crea primero el usuario en Supabase:
--   Dashboard → Authentication → Users → "Add user" → Introduce email y contraseña.
-- Paso 2: Copia el "User UID" de ese usuario (en la lista de Users).
-- Paso 3: Sustituye abajo los valores entre comillas y ejecuta este SQL.

INSERT INTO public.users (
  id,
  email,
  password_hash,
  user_type,
  created_at,
  updated_at,
  username
)
VALUES (
  'PEGA_AQUI_EL_UUID_DEL_USUARIO_DE_AUTH',  -- User UID de Authentication → Users
  'proveedor@ejemplo.com',                    -- mismo email que en Auth
  NULL,
  'provider',
  now(),
  now(),
  'proveedor'                                 -- nombre de usuario (para login por username)
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  user_type = EXCLUDED.user_type,
  username = EXCLUDED.username,
  updated_at = now();
