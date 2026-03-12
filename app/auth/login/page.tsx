import Link from "next/link";
import { LoginForm } from "@/app/auth/login/LoginForm";

export const metadata = {
  title: "Iniciar sesión",
  description: "Accede a tu cuenta",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  const nextPath = searchParams?.next;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-foreground">Iniciar sesión</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Introduce tu email o nombre de usuario y contraseña
          </p>
        </div>

        <LoginForm nextPath={nextPath} />

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
