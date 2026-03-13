"use server";

import { createClient } from "@/lib/supabase/server";

const MIN_PASSWORD_LENGTH = 6;

export type AdminCreateResult = { error: string } | { success: true };

export async function createAdminUser(
  formData: FormData,
): Promise<AdminCreateResult> {
  const supabase = await createClient();

  // 1) Verificar que el usuario actual es admin activo
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  if (!currentUser) {
    return { error: "No hay sesión activa." };
  }

  const { data: currentProfile } = await supabase
    .from("users")
    .select("user_type, status")
    .eq("id", currentUser.id)
    .single();

  if (
    !currentProfile ||
    currentProfile.user_type !== "admin" ||
    currentProfile.status !== "active"
  ) {
    return { error: "No tienes permisos para crear administradores." };
  }

  // 2) Leer datos del formulario
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const password = (formData.get("password") as string | null) ?? "";
  const username = (formData.get("username") as string | null)?.trim() ?? "";
  const status = (formData.get("status") as string | null)?.trim() ?? "active";

  if (!email) {
    return { error: "El correo electrónico es obligatorio." };
  }
  if (!password) {
    return { error: "La contraseña es obligatoria." };
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { error: "La contraseña debe tener al menos 6 caracteres." };
  }
  if (!username) {
    return { error: "El nombre de usuario es obligatorio." };
  }
  if (!["active", "inactive"].includes(status)) {
    return { error: "El estado debe ser activo o inactivo." };
  }

  // 3) Crear usuario en Supabase Auth con metadata de admin
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        user_type: "admin",
        status,
      },
    },
  });

  if (error) {
    if (
      error.message.includes("already registered") ||
      error.code === "user_already_exists"
    ) {
      return { error: "El correo ya está registrado." };
    }
    return {
      error:
        error.message ||
        "Error al crear el administrador. Inténtalo de nuevo.",
    };
  }

  return { success: true };
}

