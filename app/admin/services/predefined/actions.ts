"use server";

import { createClient } from "@/lib/supabase/server";
import { getAdminUser } from "@/lib/auth/get-admin-user";

async function assertAdmin() {
  await getAdminUser();
}

export async function listPredefinedServicesByCategory() {
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
}) {
  await assertAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("predefined_services").insert({
    category_id: input.categoryId,
    name: input.name,
    description: input.description ?? null,
  });
  if (error) throw error;
}

export async function updatePredefinedService(
  id: string,
  input: {
    name: string;
    description?: string;
  },
) {
  await assertAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("predefined_services")
    .update({
      name: input.name,
      description: input.description ?? null,
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

