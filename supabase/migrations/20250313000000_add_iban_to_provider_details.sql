-- Add IBAN field to provider_details to store provider payout account.

ALTER TABLE public.provider_details
ADD COLUMN IF NOT EXISTS iban TEXT;

