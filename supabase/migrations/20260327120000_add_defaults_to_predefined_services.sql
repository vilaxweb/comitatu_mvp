ALTER TABLE public.predefined_services
  ADD COLUMN IF NOT EXISTS default_price NUMERIC(12, 2),
  ADD COLUMN IF NOT EXISTS default_duration INTEGER;

UPDATE public.predefined_services
SET
  default_price = COALESCE(default_price, 10),
  default_duration = COALESCE(default_duration, 60)
WHERE default_price IS NULL OR default_duration IS NULL;

ALTER TABLE public.predefined_services
  ALTER COLUMN default_price SET NOT NULL,
  ALTER COLUMN default_duration SET NOT NULL;
