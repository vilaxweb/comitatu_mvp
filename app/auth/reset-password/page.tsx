import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ResetPasswordForm } from "@/app/auth/reset-password/ResetPasswordForm";

export const metadata = {
  title: "Restablecer contraseña",
  description: "Actualiza tu contraseña de acceso",
};

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="app-card w-full max-w-md space-y-8 p-6 sm:p-8">
        <div className="app-title-block text-center">
          <h1 className="text-xl font-semibold text-foreground">Restablecer contraseña</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Define una nueva contraseña para tu cuenta.
          </p>
        </div>

        {user ? (
          <ResetPasswordForm />
        ) : (
          <div className="space-y-3 rounded-md border border-border bg-card p-4 text-sm text-muted-foreground">
            <p>El enlace de recuperación es inválido o ha expirado.</p>
            <Link href="/auth/forgot-password" className="font-medium text-primary underline-offset-4 hover:underline">
              Solicitar un nuevo enlace
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
