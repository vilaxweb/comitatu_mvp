-- Añade una columna de estado a la tabla public.users
-- Estados previstos: 'active' | 'inactive'

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';

-- Índice opcional para filtrar por estado en el panel de administración
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);

