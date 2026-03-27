"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProviderUser } from "@/lib/auth/get-provider-user";
import { isProviderSector, type ProviderSector } from "@/lib/provider-sectors";

export type ServiceActionResult =
  | { error: string }
  | { success: true; id?: string };

export type ItemActionResult = { error: string } | { success: true };

type ItemValidationResult =
  | { ok: false; error: string }
  | { ok: true; name: string; price: number; estimatedTime: string };

function parseEstimatedHours(raw: string): number | null {
  const normalized = raw.trim().toLowerCase().replace(",", ".");
  if (!normalized) return null;

  const directNumber = Number(normalized);
  if (Number.isFinite(directNumber) && directNumber > 0) {
    return directNumber;
  }

  const matched = normalized.match(/^(\d+(?:\.\d+)?)\s*(h|hr|hrs|hora|horas)$/);
  if (!matched) return null;

  const parsed = Number(matched[1]);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function formatEstimatedHours(hours: number): string {
  const wholeHours = Number.isInteger(hours) ? String(hours) : String(hours).replace(/\.0+$/, "");
  return `${wholeHours} ${hours === 1 ? "hora" : "horas"}`;
}

function validateItemForm(formData: FormData): ItemValidationResult {
  const name = (formData.get("name") as string)?.trim();
  const priceRaw = (formData.get("price") as string)?.trim();
  const estimatedTime = (formData.get("estimated_time") as string)?.trim();

  if (!name) {
    return { ok: false, error: "El nombre del ítem es obligatorio." };
  }
  if (!priceRaw) {
    return { ok: false, error: "El precio es obligatorio." };
  }

  const price = Number(priceRaw);
  if (Number.isNaN(price) || price < 0) {
    return { ok: false, error: "Introduce un precio numérico válido." };
  }

  if (!estimatedTime) {
    return { ok: false, error: "El tiempo estimado es obligatorio." };
  }

  const estimatedHours = parseEstimatedHours(estimatedTime);
  if (estimatedHours == null) {
    return { ok: false, error: "El tiempo debe estar expresado en horas (ej. 2 o 1.5)." };
  }

  return {
    ok: true,
    name,
    price,
    estimatedTime: formatEstimatedHours(estimatedHours),
  };
}

async function ensureOwnedService(
  supabase: Awaited<ReturnType<typeof createClient>>,
  serviceId: string,
  userId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("services")
    .select("id")
    .eq("id", serviceId)
    .eq("user_id", userId)
    .maybeSingle();
  return !error && !!data;
}

async function ensureOwnedItem(
  supabase: Awaited<ReturnType<typeof createClient>>,
  itemId: string,
  userId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("items")
    .select("id, services!inner(user_id)")
    .eq("id", itemId)
    .eq("services.user_id", userId)
    .maybeSingle();
  return !error && !!data;
}

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

  const { id: userId } = await getProviderUser();
  const supabase = await createClient();
  if (!(await ensureOwnedService(supabase, serviceId, userId))) {
    return { error: "No tienes permiso para modificar este servicio." };
  }

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

export async function toggleServiceActive(formData: FormData): Promise<ServiceActionResult> {
  const serviceId = (formData.get("serviceId") as string)?.trim();
  const nextActiveRaw = (formData.get("nextActive") as string)?.trim();

  if (!serviceId) return { error: "ID de servicio no válido." };
  if (nextActiveRaw !== "true" && nextActiveRaw !== "false") {
    return { error: "Valor de estado no válido." };
  }

  const { id: userId } = await getProviderUser();
  const supabase = await createClient();
  if (!(await ensureOwnedService(supabase, serviceId, userId))) {
    return { error: "No tienes permiso para modificar este servicio." };
  }

  const { error } = await supabase
    .from("services")
    .update({ active: nextActiveRaw === "true" })
    .eq("id", serviceId);

  if (error) {
    return { error: error.message || "Error al actualizar el estado del servicio." };
  }

  revalidatePath("/provider");
  revalidatePath("/provider/services");
  revalidatePath(`/provider/services/${serviceId}`);
  return { success: true };
}

export async function deleteService(formData: FormData): Promise<ServiceActionResult> {
  const serviceId = (formData.get("serviceId") as string)?.trim();
  if (!serviceId) return { error: "ID de servicio no válido." };

  const { id: userId } = await getProviderUser();
  const supabase = await createClient();
  if (!(await ensureOwnedService(supabase, serviceId, userId))) {
    return { error: "No tienes permiso para eliminar este servicio." };
  }

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
  const validated = validateItemForm(formData);
  if (!validated.ok) return { error: validated.error };

  const { id: userId } = await getProviderUser();
  const supabase = await createClient();
  if (!(await ensureOwnedService(supabase, serviceId, userId))) {
    return { error: "No tienes permiso para añadir ítems a este servicio." };
  }

  const { error } = await supabase.from("items").insert({
    service_id: serviceId,
    name: validated.name,
    price: validated.price,
    estimated_time: validated.estimatedTime,
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

  if (!itemId) return { error: "ID de ítem no válido." };
  if (!serviceId) return { error: "ID de servicio no válido." };

  const validated = validateItemForm(formData);
  if (!validated.ok) return { error: validated.error };

  const { id: userId } = await getProviderUser();
  const supabase = await createClient();
  if (!(await ensureOwnedItem(supabase, itemId, userId))) {
    return { error: "No tienes permiso para modificar este ítem." };
  }

  const { error } = await supabase
    .from("items")
    .update({
      name: validated.name,
      price: validated.price,
      estimated_time: validated.estimatedTime,
    })
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

  const { id: userId } = await getProviderUser();
  const supabase = await createClient();
  if (!(await ensureOwnedItem(supabase, itemId, userId))) {
    return { error: "No tienes permiso para eliminar este ítem." };
  }

  const { error } = await supabase.from("items").delete().eq("id", itemId);

  if (error) {
    return { error: error.message || "Error al eliminar el ítem." };
  }

  if (serviceId) revalidatePath(`/provider/services/${serviceId}`);
  revalidatePath("/provider/services");
  return { success: true };
}

export async function toggleItemActive(formData: FormData): Promise<ItemActionResult> {
  const itemId = (formData.get("itemId") as string)?.trim();
  const serviceId = (formData.get("serviceId") as string)?.trim();
  const nextActiveRaw = (formData.get("nextActive") as string)?.trim();

  if (!itemId) return { error: "ID de ítem no válido." };
  if (nextActiveRaw !== "true" && nextActiveRaw !== "false") {
    return { error: "Valor de estado no válido." };
  }

  const { id: userId } = await getProviderUser();
  const supabase = await createClient();
  if (!(await ensureOwnedItem(supabase, itemId, userId))) {
    return { error: "No tienes permiso para modificar este ítem." };
  }

  const { error } = await supabase
    .from("items")
    .update({ active: nextActiveRaw === "true" })
    .eq("id", itemId);

  if (error) {
    return { error: error.message || "Error al actualizar el estado del ítem." };
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
  iban: string | null;
  sector: ProviderSector | null;
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

  const sectorRaw = (formData.get("sector") as string)?.trim() || "";
  if (!isProviderSector(sectorRaw)) {
    return { error: "Selecciona un sector válido para tu cuenta." };
  }

  const dni = (formData.get("dni") as string)?.trim() || null;
  const cif = (formData.get("cif") as string)?.trim() || null;
  const telefono = (formData.get("telefono") as string)?.trim() || null;
  const emailFacturacion = (formData.get("email_facturacion") as string)?.trim() || null;
  const ibanRaw = (formData.get("iban") as string)?.trim().replace(/\s+/g, "").toUpperCase() || null;

  if (emailFacturacion && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailFacturacion)) {
    return { error: "Introduce un email de facturación válido." };
  }
  if (telefono && !/^\+?[0-9()\-\s]{7,20}$/.test(telefono)) {
    return { error: "Introduce un teléfono válido." };
  }
  if (dni && !/^[A-Za-z0-9]{8,12}$/.test(dni)) {
    return { error: "El DNI debe tener entre 8 y 12 caracteres alfanuméricos." };
  }
  if (cif && !/^[A-Za-z0-9]{8,12}$/.test(cif)) {
    return { error: "El CIF debe tener entre 8 y 12 caracteres alfanuméricos." };
  }
  if (ibanRaw && !/^[A-Z]{2}[0-9A-Z]{13,32}$/.test(ibanRaw)) {
    return { error: "Introduce un IBAN válido." };
  }

  const payload = {
    user_id: userId,
    nombre: (formData.get("nombre") as string)?.trim() || null,
    dni,
    cif,
    nombre_empresa: (formData.get("nombre_empresa") as string)?.trim() || null,
    direccion: (formData.get("direccion") as string)?.trim() || null,
    telefono,
    email_facturacion: emailFacturacion,
    iban: ibanRaw,
    sector: sectorRaw,
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
