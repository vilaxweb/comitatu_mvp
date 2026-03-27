"use server";

import { createClient } from "@/lib/supabase/server";
import { getAdminUser } from "@/lib/auth/get-admin-user";
import { isProviderSector, type ProviderSector } from "@/lib/provider-sectors";

async function assertAdmin() {
  await getAdminUser();
}

export async function listPredefinedServicesByCategory() {
  await assertAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
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
          sectors,
        created_at
      )
    `
    )
    .order("name");

  if (error) throw error;
  return data ?? [];
}

export async function createPredefinedService(input: {
  categoryId: string;
  name: string;
  description?: string;
  defaultPrice: number;
  defaultDuration: number;
  sectors: ProviderSector[];
}) {
  if (input.sectors.length === 0 || !input.sectors.every((sector) => isProviderSector(sector))) {
    throw new Error("Selecciona al menos un sector válido.");
  }
  await assertAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("predefined_services").insert({
    category_id: input.categoryId,
    name: input.name,
    description: input.description ?? null,
    default_price: input.defaultPrice,
    default_duration: input.defaultDuration,
    sectors: input.sectors,
  });
  if (error) throw error;
}

export async function updatePredefinedService(
  id: string,
  input: {
    name: string;
    description?: string;
    defaultPrice: number;
    defaultDuration: number;
    sectors: ProviderSector[];
  },
) {
  if (input.sectors.length === 0 || !input.sectors.every((sector) => isProviderSector(sector))) {
    throw new Error("Selecciona al menos un sector válido.");
  }
  await assertAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("predefined_services")
    .update({
      name: input.name,
      description: input.description ?? null,
      default_price: input.defaultPrice,
      default_duration: input.defaultDuration,
      sectors: input.sectors,
    })
    .eq("id", id);
  if (error) throw error;
}

export async function deletePredefinedService(id: string) {
  await assertAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("predefined_services").delete().eq("id", id);
  if (error) throw error;
}

