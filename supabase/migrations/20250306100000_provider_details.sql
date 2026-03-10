-- provider_details ya existe en Supabase con:
-- id (UUID, PK), user_id (UUID, FK → users), nombre, dni, cif, nombre_empresa,
-- direccion, telefono, email_facturacion (TEXT), created_at, updated_at (Timestamp)

-- Índice único en user_id para upsert (un registro por proveedor)
CREATE UNIQUE INDEX IF NOT EXISTS idx_provider_details_user_id ON public.provider_details(user_id);

-- Trigger para actualizar updated_at al modificar
CREATE OR REPLACE FUNCTION public.set_provider_details_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS provider_details_updated_at ON public.provider_details;
CREATE TRIGGER provider_details_updated_at
  BEFORE UPDATE ON public.provider_details
  FOR EACH ROW EXECUTE PROCEDURE public.set_provider_details_updated_at();

-- RLS: solo el proveedor dueño puede ver y modificar sus datos
ALTER TABLE public.provider_details ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Providers can manage own details" ON public.provider_details;
CREATE POLICY "Providers can manage own details"
  ON public.provider_details
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
