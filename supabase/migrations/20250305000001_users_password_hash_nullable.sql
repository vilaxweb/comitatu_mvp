-- Si la columna password_hash es NOT NULL, ejecuta esto para permitir NULL
-- (Supabase Auth guarda el hash en auth.users, no en esta tabla).
ALTER TABLE public.users
  ALTER COLUMN password_hash DROP NOT NULL;
