import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProviderUser } from "@/lib/auth/get-provider-user";
import { ServiceDetailClient } from "./ServiceDetailClient";

export const metadata = {
  title: "Detalle del servicio",
  description: "Editar servicio e ítems",
};

type ItemRow = {
  id: string;
  name: string;
  price: string;
  estimated_time: string;
  active: boolean;
};

type ServiceRow = {
  id: string;
  name: string;
  description: string | null;
  user_id: string;
  active: boolean;
  items: ItemRow[];
};

export default async function ProviderServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: serviceId } = await params;
  const { id: userId } = await getProviderUser();
  const supabase = await createClient();

  const { data: service, error } = await supabase
    .from("services")
    .select(
      `
      id,
      name,
      description,
      user_id,
      active,
      items ( id, name, price, estimated_time, active )
    `
    )
    .eq("id", serviceId)
    .eq("user_id", userId)
    .single();

  if (error || !service) {
    notFound();
  }

  const typedService = service as unknown as ServiceRow;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/provider/services" className="hover:underline">
          Mis Servicios
        </Link>
        <span>/</span>
        <span className="text-foreground">{typedService.name}</span>
      </div>

      <ServiceDetailClient
        service={{
          id: typedService.id,
          name: typedService.name,
          description: typedService.description ?? "",
        }}
        items={typedService.items ?? []}
      />
    </div>
  );
}
