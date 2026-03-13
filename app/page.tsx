import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";

export default async function HomePage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { error: queryError } = searchParams;

  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("user_type, status")
      .eq("id", user.id)
      .single();
    if (profile?.user_type === "admin" && profile.status === "active") {
      redirect("/admin");
    }
    if (profile?.user_type === "provider") {
      redirect("/provider");
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <main className="flex w-full max-w-md flex-col items-center gap-8 text-center">
        <h1 className="text-2xl font-semibold text-foreground">
          {user ? "Bienvenido" : "Plataforma"}
        </h1>
        {user ? (
          <div className="flex flex-col gap-3">
            {queryError === "provider_only" && (
              <p className="text-sm text-muted-foreground" role="alert">
                No tienes acceso al panel de proveedores. Solo usuarios tipo proveedor pueden acceder.
              </p>
            )}
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <form action={signOut}>
              <Button type="submit" variant="outline">
                Cerrar sesión
              </Button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button asChild className="w-full sm:w-auto">
              <Link href="/auth/login">Iniciar sesión</Link>
            </Button>
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/auth/register">Registrarse</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
