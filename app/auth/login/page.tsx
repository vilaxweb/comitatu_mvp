import Link from "next/link";
import { LoginForm } from "@/app/auth/login/LoginForm";

export const metadata = {
  title: "Iniciar sesión",
  description: "Accede a tu cuenta",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; password_reset?: string; recovery_error?: string }>;
}) {
  const { next: nextPath, password_reset: passwordReset, recovery_error: recoveryError } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="app-title-block text-center">
          <h1 className="text-xl font-semibold text-foreground">Iniciar sesión</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Introduce tu email o nombre de usuario y contraseña
          </p>
        </div>
        <div className="app-card mx-auto w-full max-w-sm p-6 sm:p-8">
          <LoginForm nextPath={nextPath} />
        </div>
        {passwordReset ? (
          <p className="text-center text-sm text-emerald-600" role="status">
            Contraseña actualizada correctamente. Ya puedes iniciar sesión.
          </p>
        ) : null}
        {recoveryError ? (
          <p className="text-center text-sm text-destructive" role="alert">
            El enlace de recuperación es inválido o ha expirado.
          </p>
        ) : null}

        <p className="text-center text-sm text-muted-foreground">
          ¿No tienes cuenta?{" "}
          <Link href="/auth/register" className="font-medium text-primary underline-offset-4 hover:underline">
            Registrarse
          </Link>
        </p>
      </div>
    </div>
  );
}
