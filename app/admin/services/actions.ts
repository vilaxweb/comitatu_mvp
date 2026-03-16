// app/admin/services/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { getAdminUser } from "@/lib/auth/get-admin-user";

async function assertAdmin() {
  await getAdminUser();
}

export async function listServiceCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("service_categories")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}

export async function createServiceCategory(form: { name: string; description?: string }) {
  await assertAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("service_categories").insert({
    name: form.name,
    description: form.description ?? null,
  });
  if (error) throw error;
}

export async function updateServiceCategory(id: string, form: { name: string; description?: string }) {
  await assertAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("service_categories")
    .update({ name: form.name, description: form.description ?? null })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteServiceCategory(id: string) {
  await assertAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("service_categories").delete().eq("id", id);
  if (error) throw error;
}