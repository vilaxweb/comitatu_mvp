import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type AdminUser = {
  id: string;
  email: string | null;
  user_type: string;
  status: string;
};

/**
 * Ensures the current user is authenticated and is an admin.
 * Use in admin layout/pages. Redirects to login or home if not allowed.
 */
export async function getAdminUser(): Promise<AdminUser> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile, error } = await supabase
    .from("users")
    .select("user_type, status")
    .eq("id", user.id)
    .single();

  if (
    error ||
    !profile ||
    profile.user_type !== "admin" ||
    profile.status !== "active"
  ) {
    redirect("/?error=admin_only");
  }

  return {
    id: user.id,
    email: user.email ?? null,
    user_type: profile.user_type,
    status: profile.status,
  };
}

