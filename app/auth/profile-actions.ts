"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProviderUser } from "@/lib/auth/get-provider-user";
import { getPasswordPolicyMessage, isStrongPassword } from "@/lib/auth/security";

export type ProfileActionResult = { error: string } | { success: true };

export async function updateProfile(formData: FormData): Promise<ProfileActionResult> {
  const { id: userId } = await getProviderUser();
  const supabase = await createClient();

  const username = (formData.get("username") as string)?.trim();
  const avatarUrl = (formData.get("avatar_url") as string)?.trim() || null;

  if (!username) {
    return { error: "El nombre de usuario es obligatorio." };
  }

  const { error: updateAuthError } = await supabase.auth.updateUser({
    data: { username, avatar_url: avatarUrl },
  });

  if (updateAuthError) {
    return { error: updateAuthError.message || "Error al actualizar el perfil." };
  }

  const { error: updateProfileError } = await supabase
    .from("users")
    .update({ username, avatar_url: avatarUrl })
    .eq("id", userId);

  if (updateProfileError) {
    return { error: updateProfileError.message || "Error al actualizar el perfil." };
  }

  return { success: true };
}

export async function updatePassword(formData: FormData): Promise<ProfileActionResult> {
  await getProviderUser();
  const supabase = await createClient();

  const newPassword = (formData.get("new_password") as string) ?? "";
  const confirmPassword = (formData.get("confirm_password") as string) ?? "";

  if (!newPassword) {
    return { error: "La nueva contraseña es obligatoria." };
  }
  if (!isStrongPassword(newPassword)) {
    return { error: getPasswordPolicyMessage() };
  }
  if (newPassword !== confirmPassword) {
    return { error: "Las contraseñas no coinciden." };
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    return { error: error.message || "Error al actualizar la contraseña." };
  }

  return { success: true };
}

export async function deleteAccount(): Promise<ProfileActionResult> {
  const { id: userId } = await getProviderUser();
  const supabase = await createClient();

  const { error: providerServicesError } = await supabase.from("provider_services").delete().eq("provider_id", userId);
  if (providerServicesError) {
    return { error: providerServicesError.message || "No se pudo eliminar la cuenta." };
  }

  const { error: servicesError } = await supabase.from("services").delete().eq("user_id", userId);
  if (servicesError) {
    return { error: servicesError.message || "No se pudo eliminar la cuenta." };
  }

  const { error: providerDetailsError } = await supabase.from("provider_details").delete().eq("user_id", userId);
  if (providerDetailsError) {
    return { error: providerDetailsError.message || "No se pudo eliminar la cuenta." };
  }

  const { error: usersError } = await supabase.from("users").delete().eq("id", userId);
  if (usersError) {
    return { error: usersError.message || "No se pudo eliminar la cuenta." };
  }

  await supabase.auth.signOut();
  redirect("/auth/login?account_deleted=1");
}

