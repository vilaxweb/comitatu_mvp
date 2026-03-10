"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const MIN_PASSWORD_LENGTH = 6;

export type AuthResult = { error: string } | { success: true };

const ALLOWED_USER_TYPES = ["provider", "customer"] as const;

export async function register(formData: FormData): Promise<AuthResult> {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const username = (formData.get("username") as string)?.trim();
  const userType = (formData.get("user_type") as string)?.trim();

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
  if (!userType || !ALLOWED_USER_TYPES.includes(userType as (typeof ALLOWED_USER_TYPES)[number])) {
    return { error: "Selecciona un tipo de cuenta válido." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username, user_type: userType },
    },
  });

  if (error) {
    if (error.message.includes("already registered") || error.code === "user_already_exists") {
      return { error: "El correo ya está registrado." };
    }
    return { error: error.message || "Error al registrar. Inténtalo de nuevo." };
  }

  redirect("/auth/login");
}

/**
 * Resolves login identifier to email.
 * If the input contains '@', it is treated as email.
 * Otherwise we look up email by username in public.users.
 */
async function resolveEmail(supabase: Awaited<ReturnType<typeof createClient>>, emailOrUsername: string): Promise<string | null> {
  const trimmed = emailOrUsername.trim();
  if (trimmed.includes("@")) {
    return trimmed;
  }
  try {
    const { data } = await supabase.from("users").select("email").eq("username", trimmed).maybeSingle();
    return data?.email ?? null;
  } catch {
    return null;
  }
}

export async function login(formData: FormData): Promise<AuthResult> {
  const emailOrUsername = (formData.get("email_or_username") as string)?.trim();
  const password = formData.get("password") as string;

  if (!emailOrUsername) {
    return { error: "El correo o nombre de usuario es obligatorio." };
  }
  if (!password) {
    return { error: "La contraseña es obligatoria." };
  }

  const supabase = await createClient();
  const email = await resolveEmail(supabase, emailOrUsername);
  if (!email) {
    return { error: "Email o contraseña incorrectos." };
  }

  const { data: signInData, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message.includes("Invalid login") || error.message.includes("invalid")) {
      return { error: "Email o contraseña incorrectos." };
    }
    return { error: error.message || "Error al iniciar sesión. Inténtalo de nuevo." };
  }

  const userId = signInData.user?.id;
  if (userId) {
    const { data: profile } = await supabase
      .from("users")
      .select("user_type")
      .eq("id", userId)
      .single();
    if (profile?.user_type === "provider") {
      redirect("/provider");
    }
  }

  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}
