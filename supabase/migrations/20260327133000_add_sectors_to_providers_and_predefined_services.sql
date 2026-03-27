ALTER TABLE public.provider_details
  ADD COLUMN IF NOT EXISTS sector TEXT;

ALTER TABLE public.provider_details
  DROP CONSTRAINT IF EXISTS provider_details_sector_check;

ALTER TABLE public.provider_details
  ADD CONSTRAINT provider_details_sector_check
  CHECK (
    sector IS NULL OR sector IN (
      'Legal',
      'Fiscal',
      'Administración',
      'Tech',
      'Operaciones',
      'Marketing',
      'Finanzas'
    )
  );

ALTER TABLE public.predefined_services
  ADD COLUMN IF NOT EXISTS sectors TEXT[];

UPDATE public.predefined_services
SET sectors = ARRAY[
  'Legal',
  'Fiscal',
  'Administración',
  'Tech',
  'Operaciones',
  'Marketing',
  'Finanzas'
]
WHERE sectors IS NULL OR cardinality(sectors) = 0;

ALTER TABLE public.predefined_services
  ALTER COLUMN sectors SET DEFAULT ARRAY[
    'Legal',
    'Fiscal',
    'Administración',
    'Tech',
    'Operaciones',
    'Marketing',
    'Finanzas'
  ]::TEXT[],
  ALTER COLUMN sectors SET NOT NULL;

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

CREATE INDEX IF NOT EXISTS idx_predefined_services_sectors
  ON public.predefined_services USING GIN (sectors);
