import Link from "next/link";
import { RegisterForm } from "./RegisterForm";

export const metadata = {
  title: "Registro",
  description: "Crear una cuenta",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-foreground">Crear cuenta</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Introduce tu correo y contraseña
          </p>
        </div>

        <RegisterForm />

        <p className="text-center text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link href="/auth/login" className="font-medium text-primary underline-offset-4 hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
