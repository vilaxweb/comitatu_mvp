-- Add active flag to services and items so providers can
-- activate/deactivate them without deleting.

ALTER TABLE public.services
ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE public.items
ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT TRUE;

