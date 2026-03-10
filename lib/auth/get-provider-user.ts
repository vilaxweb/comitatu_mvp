import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type ProviderUser = {
  id: string;
  email: string | null;
  user_type: string;
};

/**
 * Ensures the current user is authenticated and is a provider.
 * Use in provider layout/pages. Redirects to login or home if not allowed.
 */
export async function getProviderUser(): Promise<ProviderUser> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile, error } = await supabase
    .from("users")
    .select("user_type")
    .eq("id", user.id)
    .single();

  if (error || !profile || profile.user_type !== "provider") {
    redirect("/?error=provider_only");
  }

  return {
    id: user.id,
    email: user.email ?? null,
    user_type: profile.user_type,
  };
}
