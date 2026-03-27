"use server";

import { createClient } from "@/lib/supabase/server";
import { getPasswordPolicyMessage, isStrongPassword } from "@/lib/auth/security";

export type AdminDashboardStats = {
  totalActiveUsers: number;
  totalAvailableProviders: number;
  totalActiveCustomers: number;
  totalActiveAdmins: number;
  newUsersLast7Days: number;
  newProvidersLast7Days: number;
  newServicesLast7Days: number;
  newUsersSeriesLast7Days: number[];
  newProvidersSeriesLast7Days: number[];
  newServicesSeriesLast7Days: number[];
};

export type AdminCreateResult = { error: string } | { success: true };

export type AdminUserSummary = {
  id: string;
  email: string | null;
  username: string;
  user_type: "customer" | "provider" | "admin";
  status: "active" | "inactive";
  services_count: number | null;
};

export async function createUserFromAdmin(
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
    return { error: "No tienes permisos para crear usuarios." };
  }

  // 2) Leer datos del formulario
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const password = (formData.get("password") as string | null) ?? "";
  const username = (formData.get("username") as string | null)?.trim() ?? "";
  const userType = (formData.get("user_type") as string | null)?.trim() ?? "customer";
  const status = (formData.get("status") as string | null)?.trim() ?? "active";

  if (!email) {
    return { error: "El correo electrónico es obligatorio." };
  }
  if (!password) {
    return { error: "La contraseña es obligatoria." };
  }
  if (!isStrongPassword(password)) {
    return { error: getPasswordPolicyMessage() };
  }
  if (!username) {
    return { error: "El nombre de usuario es obligatorio." };
  }
  if (!["customer", "provider", "admin"].includes(userType)) {
    return { error: "El tipo de usuario no es válido." };
  }
  if (!["active", "inactive"].includes(status)) {
    return { error: "El estado debe ser activo o inactivo." };
  }

  // 3) Crear usuario en Supabase Auth con metadata del tipo seleccionado
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        user_type: userType,
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
        error.message || "Error al crear el usuario. Inténtalo de nuevo.",
    };
  }

  return { success: true };
}

export type AdminUpdateResult = { error: string } | { success: true };

export async function getUsersForAdmin(): Promise<AdminUserSummary[]> {
  const supabase = await createClient();

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  if (!currentUser) {
    return [];
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
    return [];
  }

  const { data, error } = await supabase
    .from("users")
    .select("id, email, username, user_type, status")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  const rows = data as {
    id: string;
    email: string | null;
    username: string;
    user_type: "customer" | "provider" | "admin";
    status: "active" | "inactive";
  }[];

  const providerIds = rows.filter((row) => row.user_type === "provider").map((row) => row.id);

  const servicesCountByUser: Record<string, number> = {};

  if (providerIds.length > 0) {
    const { data: servicesData, error: servicesError } = await supabase
      .from("services")
      .select(
        `
        id,
        user_id,
        items ( id, active )
      `,
      )
      .in("user_id", providerIds);

    if (!servicesError && servicesData) {
      for (const svc of servicesData as {
        id: string;
        user_id: string;
        items: { id: string; active: boolean }[] | null;
      }[]) {
        const userId = svc.user_id;
        if (!userId || !providerIds.includes(userId)) continue;
        const activeItems = (svc.items ?? []).filter((item) => item.active);
        if (!activeItems.length) continue;
        servicesCountByUser[userId] =
          (servicesCountByUser[userId] ?? 0) + activeItems.length;
      }
    }
  }

  return rows
    .filter((row) => row.user_type !== "admin")
    .map((row) => {
    const base: AdminUserSummary = {
      id: row.id,
      email: row.email,
      username: row.username,
      user_type: row.user_type,
      status: row.status,
      services_count: null,
    };

    if (row.user_type === "provider") {
      base.services_count = servicesCountByUser[row.id] ?? 0;
    }

      return base;
    });
}

export async function updateUserFromAdmin(
  user: AdminUserSummary,
): Promise<AdminUpdateResult> {
  const supabase = await createClient();

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
    return { error: "No tienes permisos para editar usuarios." };
  }

  const { error } = await supabase
    .from("users")
    .update({
      user_type: user.user_type,
      status: user.status,
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message || "No se pudo actualizar el usuario." };
  }

  return { success: true };
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const supabase = await createClient();

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  if (!currentUser) {
    return {
      totalActiveUsers: 0,
      totalAvailableProviders: 0,
      totalActiveCustomers: 0,
      totalActiveAdmins: 0,
      newUsersLast7Days: 0,
      newProvidersLast7Days: 0,
      newServicesLast7Days: 0,
      newUsersSeriesLast7Days: [],
      newProvidersSeriesLast7Days: [],
      newServicesSeriesLast7Days: [],
    };
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
    return {
      totalActiveUsers: 0,
      totalAvailableProviders: 0,
      totalActiveCustomers: 0,
      totalActiveAdmins: 0,
      newUsersLast7Days: 0,
      newProvidersLast7Days: 0,
      newServicesLast7Days: 0,
      newUsersSeriesLast7Days: [],
      newProvidersSeriesLast7Days: [],
      newServicesSeriesLast7Days: [],
    };
  }

  const [
    { count: totalActiveUsers },
    { count: totalAvailableProviders },
    { count: totalActiveCustomers },
    { count: totalActiveAdmins },
  ] = await Promise.all([
    supabase
      .from("users")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("users")
      .select("id", { count: "exact", head: true })
      .eq("status", "active")
      .eq("user_type", "provider"),
    supabase
      .from("users")
      .select("id", { count: "exact", head: true })
      .eq("status", "active")
      .eq("user_type", "customer"),
    supabase
      .from("users")
      .select("id", { count: "exact", head: true })
      .eq("status", "active")
      .eq("user_type", "admin"),
  ]);

  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;
  const dayWindows = Array.from({ length: 7 }, (_, index) => {
    const start = new Date(now - (7 - index) * oneDayMs);
    const end = new Date(now - (6 - index) * oneDayMs);
    return {
      start: start.toISOString(),
      end: end.toISOString(),
    };
  });

  const usersSeriesResults = await Promise.all(
    dayWindows.map(({ start, end }) =>
      supabase
        .from("users")
        .select("id", { count: "exact", head: true })
        .gte("created_at", start)
        .lt("created_at", end),
    ),
  );

  const providersSeriesResults = await Promise.all(
    dayWindows.map(({ start, end }) =>
      supabase
        .from("users")
        .select("id", { count: "exact", head: true })
        .eq("user_type", "provider")
        .gte("created_at", start)
        .lt("created_at", end),
    ),
  );

  const servicesSeriesResults = await Promise.all(
    dayWindows.map(({ start, end }) =>
      supabase
        .from("services")
        .select("id", { count: "exact", head: true })
        .gte("created_at", start)
        .lt("created_at", end),
    ),
  );

  const newUsersSeriesLast7Days = usersSeriesResults.map(
    (r) => r.count ?? 0,
  );
  const newProvidersSeriesLast7Days = providersSeriesResults.map(
    (r) => r.count ?? 0,
  );
  const newServicesSeriesLast7Days = servicesSeriesResults.map(
    (r) => r.count ?? 0,
  );

  const newUsersLast7Days = newUsersSeriesLast7Days.reduce(
    (acc, v) => acc + v,
    0,
  );
  const newProvidersLast7Days = newProvidersSeriesLast7Days.reduce(
    (acc, v) => acc + v,
    0,
  );
  const newServicesLast7Days = newServicesSeriesLast7Days.reduce(
    (acc, v) => acc + v,
    0,
  );

  return {
    totalActiveUsers: totalActiveUsers ?? 0,
    totalAvailableProviders: totalAvailableProviders ?? 0,
    totalActiveCustomers: totalActiveCustomers ?? 0,
    totalActiveAdmins: totalActiveAdmins ?? 0,
    newUsersLast7Days: newUsersLast7Days ?? 0,
    newProvidersLast7Days: newProvidersLast7Days ?? 0,
    newServicesLast7Days: newServicesLast7Days ?? 0,
    newUsersSeriesLast7Days,
    newProvidersSeriesLast7Days,
    newServicesSeriesLast7Days,
  };
}


