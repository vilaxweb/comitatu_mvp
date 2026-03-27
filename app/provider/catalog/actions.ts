"use server";

import { createClient } from "@/lib/supabase/server";
import { getProviderUser } from "@/lib/auth/get-provider-user";
import { type ProviderSector } from "@/lib/provider-sectors";

export type PredefinedService = {
  id: string;
  name: string;
  description: string | null;
  default_price: number | null;
  default_duration: number | null;
  sectors: ProviderSector[];
};

export type ServiceCategoryWithPredefined = {
  id: string;
  name: string;
  description: string | null;
  predefined_services: PredefinedService[] | null;
};

export type ProviderServiceRow = {
  id: string;
  predefined_service_id: string;
  price: number;
  duration: number;
};

export async function listCatalogWithProviderServices(): Promise<{
  categories: ServiceCategoryWithPredefined[];
  providerServices: ProviderServiceRow[];
  providerSector: ProviderSector | null;
}> {
  const supabase = await createClient();
  const { id: providerId } = await getProviderUser();

  const [{ data: categories }, { data: providerServices }, { data: providerDetails }] = await Promise.all([
    supabase
      .from("service_categories")
      .select(
        `
        id,
        name,
        description,
        predefined_services (
          id,
          name,
          description,
          default_price,
          default_duration,
          sectors
        )
      `,
      )
      .order("name"),
    supabase
      .from("provider_services")
      .select("id, predefined_service_id, price, duration")
      .eq("provider_id", providerId),
    supabase.from("provider_details").select("sector").eq("user_id", providerId).maybeSingle(),
  ]);

  const providerSector = (providerDetails?.sector ?? null) as ProviderSector | null;
  const filteredCategories = providerSector
    ? ((categories ?? []) as ServiceCategoryWithPredefined[])
        .map((category) => ({
          ...category,
          predefined_services:
            category.predefined_services?.filter((service) =>
              (service.sectors ?? []).includes(providerSector),
            ) ?? [],
        }))
        .filter((category) => (category.predefined_services?.length ?? 0) > 0)
    : [];

  return {
    categories: filteredCategories,
    providerServices: (providerServices ?? []) as ProviderServiceRow[],
    providerSector,
  };
}

export async function upsertProviderService(input: {
  predefinedServiceId: string;
  price: number;
  duration: number;
}) {
  const supabase = await createClient();
  const { id: providerId } = await getProviderUser();
  const { data: providerDetails } = await supabase
    .from("provider_details")
    .select("sector")
    .eq("user_id", providerId)
    .maybeSingle();
  const providerSector = (providerDetails?.sector ?? null) as ProviderSector | null;
  if (!providerSector) {
    throw new Error("Completa tu sector en datos de proveedor antes de activar servicios.");
  }

  const { data: predefinedService, error: predefinedServiceError } = await supabase
    .from("predefined_services")
    .select("id, sectors")
    .eq("id", input.predefinedServiceId)
    .single();

  if (predefinedServiceError || !predefinedService) {
    throw new Error("El servicio seleccionado no existe.");
  }

  if (!(predefinedService.sectors ?? []).includes(providerSector)) {
    throw new Error("No puedes activar servicios fuera del sector de tu cuenta.");
  }

  const { error } = await supabase
    .from("provider_services")
    .upsert(
      {
        provider_id: providerId,
        predefined_service_id: input.predefinedServiceId,
        price: input.price,
        duration: input.duration,
      },
      {
        onConflict: "provider_id,predefined_service_id",
      },
    );

  if (error) throw error;
}

export async function deleteProviderService(predefinedServiceId: string) {
  const supabase = await createClient();
  const { id: providerId } = await getProviderUser();

  const { error } = await supabase
    .from("provider_services")
    .delete()
    .eq("provider_id", providerId)
    .eq("predefined_service_id", predefinedServiceId);

  if (error) throw error;
}

