import Link from "next/link";
import { ForgotPasswordForm } from "@/app/auth/forgot-password/ForgotPasswordForm";

export const metadata = {
  title: "Recuperar contraseña",
  description: "Solicita un enlace para restablecer tu contraseña",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="app-card w-full max-w-md space-y-8 p-6 sm:p-8">
        <div className="app-title-block text-center">
          <h1 className="text-xl font-semibold text-foreground">Recuperar contraseña</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Te enviaremos un correo para restablecer el acceso.
          </p>
        </div>

        <ForgotPasswordForm />

        <p className="text-center text-sm text-muted-foreground">
          ¿Ya recuerdas tu contraseña?{" "}
          <Link href="/auth/login" className="font-medium text-primary underline-offset-4 hover:underline">
            Volver al login
          </Link>
        </p>
      </div>
    </div>
  );
}
