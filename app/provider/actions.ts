"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProviderUser } from "@/lib/auth/get-provider-user";

export type ServiceActionResult =
  | { error: string }
  | { success: true; id?: string };

export type ItemActionResult = { error: string } | { success: true };

export async function createService(formData: FormData): Promise<ServiceActionResult> {
  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;

  if (!name) {
    return { error: "El nombre del servicio es obligatorio." };
  }

  const { id: userId } = await getProviderUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("services")
    .insert({
      user_id: userId,
      name,
      description: description || undefined,
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message || "Error al crear el servicio." };
  }

  revalidatePath("/provider");
  revalidatePath("/provider/services");
  if (data?.id) revalidatePath(`/provider/services/${data.id}`);
  return { success: true, id: data?.id };
}

export async function updateService(
  serviceId: string,
  formData: FormData
): Promise<ServiceActionResult> {
  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;

  if (!name) {
    return { error: "El nombre del servicio es obligatorio." };
  }

  await getProviderUser();
  const supabase = await createClient();

  const { error } = await supabase
    .from("services")
    .update({
      name,
      description: description || undefined,
    })
    .eq("id", serviceId);

  if (error) {
    return { error: error.message || "Error al actualizar el servicio." };
  }

  revalidatePath("/provider");
  revalidatePath("/provider/services");
  revalidatePath(`/provider/services/${serviceId}`);
  return { success: true };
}

export async function deleteService(formData: FormData): Promise<ServiceActionResult> {
  const serviceId = (formData.get("serviceId") as string)?.trim();
  if (!serviceId) return { error: "ID de servicio no válido." };

  await getProviderUser();
  const supabase = await createClient();

  const { error } = await supabase.from("services").delete().eq("id", serviceId);

  if (error) {
    return { error: error.message || "Error al eliminar el servicio." };
  }

  revalidatePath("/provider");
  revalidatePath("/provider/services");
  redirect("/provider/services");
}

export async function createItem(
  serviceId: string,
  formData: FormData
): Promise<ItemActionResult> {
  const name = (formData.get("name") as string)?.trim();
  const priceRaw = (formData.get("price") as string)?.trim();
  const estimatedTime = (formData.get("estimated_time") as string)?.trim();

  if (!name) {
    return { error: "El nombre del ítem es obligatorio." };
  }
  if (!priceRaw) {
    return { error: "El precio es obligatorio." };
  }
  const price = Number(priceRaw);
  if (Number.isNaN(price) || price < 0) {
    return { error: "Introduce un precio numérico válido." };
  }
  if (!estimatedTime) {
    return { error: "El tiempo estimado es obligatorio." };
  }

  await getProviderUser();
  const supabase = await createClient();

  const { error } = await supabase.from("items").insert({
    service_id: serviceId,
    name,
    price,
    estimated_time: estimatedTime,
  });

  if (error) {
    return { error: error.message || "Error al añadir el ítem." };
  }

  revalidatePath(`/provider/services/${serviceId}`);
  revalidatePath("/provider/services");
  return { success: true };
}

export async function updateItem(formData: FormData): Promise<ItemActionResult> {
  const itemId = (formData.get("itemId") as string)?.trim();
  const serviceId = (formData.get("serviceId") as string)?.trim();
  const name = (formData.get("name") as string)?.trim();
  const priceRaw = (formData.get("price") as string)?.trim();
  const estimatedTime = (formData.get("estimated_time") as string)?.trim();

  if (!itemId) return { error: "ID de ítem no válido." };
  if (!serviceId) return { error: "ID de servicio no válido." };
  if (!name) return { error: "El nombre del ítem es obligatorio." };
  if (!priceRaw) return { error: "El precio es obligatorio." };
  const price = Number(priceRaw);
  if (Number.isNaN(price) || price < 0) return { error: "Introduce un precio numérico válido." };
  if (!estimatedTime) return { error: "El tiempo estimado es obligatorio." };

  await getProviderUser();
  const supabase = await createClient();

  const { error } = await supabase
    .from("items")
    .update({ name, price, estimated_time: estimatedTime })
    .eq("id", itemId);

  if (error) {
    return { error: error.message || "Error al actualizar el ítem." };
  }

  revalidatePath(`/provider/services/${serviceId}`);
  revalidatePath("/provider/services");
  return { success: true };
}

export async function deleteItem(formData: FormData): Promise<ItemActionResult> {
  const itemId = (formData.get("itemId") as string)?.trim();
  const serviceId = (formData.get("serviceId") as string)?.trim();
  if (!itemId) return { error: "ID de ítem no válido." };

  await getProviderUser();
  const supabase = await createClient();

  const { error } = await supabase.from("items").delete().eq("id", itemId);

  if (error) {
    return { error: error.message || "Error al eliminar el ítem." };
  }

  if (serviceId) revalidatePath(`/provider/services/${serviceId}`);
  revalidatePath("/provider/services");
  return { success: true };
}

// --- Provider details (datos para facturación / pagos) ---

export type ProviderDetailsRow = {
  id: string;
  user_id: string;
  nombre: string | null;
  dni: string | null;
  cif: string | null;
  nombre_empresa: string | null;
  direccion: string | null;
  telefono: string | null;
  email_facturacion: string | null;
  created_at: string;
  updated_at: string;
};

export type ProviderDetailsActionResult =
  | { error: string }
  | { success: true };

export async function getProviderDetails(): Promise<ProviderDetailsRow | null> {
  const { id: userId } = await getProviderUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("provider_details")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) return null;
  return data as ProviderDetailsRow | null;
}

export async function upsertProviderDetails(
  formData: FormData
): Promise<ProviderDetailsActionResult> {
  const { id: userId } = await getProviderUser();
  const supabase = await createClient();

  const payload = {
    user_id: userId,
    nombre: (formData.get("nombre") as string)?.trim() || null,
    dni: (formData.get("dni") as string)?.trim() || null,
    cif: (formData.get("cif") as string)?.trim() || null,
    nombre_empresa: (formData.get("nombre_empresa") as string)?.trim() || null,
    direccion: (formData.get("direccion") as string)?.trim() || null,
    telefono: (formData.get("telefono") as string)?.trim() || null,
    email_facturacion: (formData.get("email_facturacion") as string)?.trim() || null,
  };

  const { error } = await supabase.from("provider_details").upsert(payload, {
    onConflict: "user_id",
  });

  if (error) {
    return { error: error.message || "Error al guardar los datos." };
  }

  revalidatePath("/provider/details");
  return { success: true };
}
