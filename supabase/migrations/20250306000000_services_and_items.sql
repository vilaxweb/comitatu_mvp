-- Tabla services: servicios creados por proveedores (user_type = 'provider')
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabla items: ítems asociados a cada servicio
CREATE TABLE IF NOT EXISTS public.items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL,
  estimated_time TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices para consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_services_user_id ON public.services(user_id);
CREATE INDEX IF NOT EXISTS idx_items_service_id ON public.items(service_id);

-- Trigger para actualizar updated_at en services
CREATE OR REPLACE FUNCTION public.set_services_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS services_updated_at ON public.services;
CREATE TRIGGER services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE PROCEDURE public.set_services_updated_at();

-- Trigger para actualizar updated_at en items
CREATE OR REPLACE FUNCTION public.set_items_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS items_updated_at ON public.items;
CREATE TRIGGER items_updated_at
  BEFORE UPDATE ON public.items
  FOR EACH ROW EXECUTE PROCEDURE public.set_items_updated_at();

-- RLS: solo el proveedor dueño puede ver/crear/actualizar/eliminar sus servicios
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Providers can manage own services"
  ON public.services
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS: solo se pueden ver/crear/actualizar/eliminar ítems de servicios propios
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Providers can manage items of own services"
  ON public.items
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.services s
      WHERE s.id = items.service_id AND s.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.services s
      WHERE s.id = items.service_id AND s.user_id = auth.uid()
    )
  );
