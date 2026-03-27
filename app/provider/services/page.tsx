import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getProviderUser } from "@/lib/auth/get-provider-user";
import { Button } from "@/components/ui/button";
import { ServicesListClient } from "./ServicesListClient";

export const metadata = {
  title: "Mis servicios",
  description: "Servicios que has creado",
};

type ServiceRow = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  active: boolean;
  items: { id: string; name: string; price: string; estimated_time: string; active: boolean }[];
};

export default async function ProviderServicesPage() {
  const { id: userId } = await getProviderUser();
  const supabase = await createClient();

  const { data: services, error } = await supabase
    .from("services")
    .select(
      `
      id,
      name,
      description,
      created_at,
      active,
      items ( id, name, price, estimated_time, active )
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="app-page">
        <p className="text-sm text-destructive">Error al cargar los servicios.</p>
      </div>
    );
  }

  const list = (services ?? []) as ServiceRow[];

  return (
    <div className="app-page">
      <div className="app-title-block">
        <h1 className="text-xl font-semibold text-foreground">Mis Servicios</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Despliega cada servicio para ver sus ítems en detalle y editarlos.
        </p>
      </div>

      {list.length === 0 ? (
        <div className="rounded-xl border border-border bg-background p-6 text-center text-muted-foreground">
          <p className="text-sm">Aún no tienes servicios.</p>
          <Link href="/provider">
            <Button className="mt-3">Crear primer servicio</Button>
          </Link>
        </div>
      ) : (
        <ServicesListClient services={list} />
      )}
    </div>
  );
}
