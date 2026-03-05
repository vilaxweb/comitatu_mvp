import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/login");

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Panel de proveedor</h1>
      <p className="text-sm text-gray-600">Sesión: {data.user.email}</p>

      <form action="/auth/signout" method="post">
        <button className="border rounded p-2">Cerrar sesión</button>
      </form>

      <a className="underline" href="/dashboard/services">Gestionar servicios</a>
    </main>
  );
}