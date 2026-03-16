"use server";

import { createClient } from "@/lib/supabase/server";
import { getProviderUser } from "@/lib/auth/get-provider-user";

export type PredefinedService = {
  id: string;
  name: string;
  description: string | null;
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
}> {
  const supabase = await createClient();
  const { id: providerId } = await getProviderUser();

  const [{ data: categories }, { data: providerServices }] = await Promise.all([
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
          description
        )
      `,
      )
      .order("name"),
    supabase
      .from("provider_services")
      .select("id, predefined_service_id, price, duration")
      .eq("provider_id", providerId),
  ]);

  return {
    categories: (categories ?? []) as ServiceCategoryWithPredefined[],
    providerServices: (providerServices ?? []) as ProviderServiceRow[],
  };
}

export async function upsertProviderService(input: {
  predefinedServiceId: string;
  price: number;
  duration: number;
}) {
  const supabase = await createClient();
  const { id: providerId } = await getProviderUser();

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

