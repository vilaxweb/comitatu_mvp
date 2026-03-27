export const PROVIDER_SECTORS = [
  "Legal",
  "Fiscal",
  "Administración",
  "Tech",
  "Operaciones",
  "Marketing",
  "Finanzas",
] as const;

export type ProviderSector = (typeof PROVIDER_SECTORS)[number];

export function isProviderSector(value: string): value is ProviderSector {
  return PROVIDER_SECTORS.includes(value as ProviderSector);
}
