import { getProviderUser } from "@/lib/auth/get-provider-user";
import { createClient } from "@/lib/supabase/server";
import { AccountSettingsForm } from "./AccountSettingsForm";

export const metadata = {
  title: "Mi cuenta | Panel de proveedores",
  description: "Gestiona tu perfil, contraseña y cuenta",
};

export default async function ProviderAccountPage() {
  const { id: userId, email } = await getProviderUser();
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("users")
    .select("username, avatar_url")
    .eq("id", userId)
    .maybeSingle();

  const initialUsername = profile?.username ?? "";
  const initialAvatarUrl = (profile as { avatar_url?: string | null } | null)?.avatar_url ?? null;

  return (
    <div className="app-page flex flex-col">
      <div className="app-title-block">
        <h1 className="text-xl font-semibold text-foreground">Mi cuenta</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Edita tu información de perfil, actualiza tu contraseña o elimina tu cuenta.
        </p>
      </div>

      <AccountSettingsForm
        initialUsername={initialUsername}
        initialEmail={email}
        initialAvatarUrl={initialAvatarUrl}
      />
    </div>
  );
}

