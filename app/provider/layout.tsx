import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { getProviderUser } from "@/lib/auth/get-provider-user";
import { createClient } from "@/lib/supabase/server";
import { ProviderSidebar } from "./ProviderSidebar";
import { ProviderTopbar } from "./ProviderTopbar";

type ProviderDetailsForBilling = {
  nombre: string | null;
  nombre_empresa: string | null;
  direccion: string | null;
  telefono: string | null;
  email_facturacion: string | null;
  iban: string | null;
} | null;

function isBillingIncomplete(details: ProviderDetailsForBilling): boolean {
  if (!details) return true;

  const requiredFields: (keyof NonNullable<ProviderDetailsForBilling>)[] = [
    "nombre",
    "nombre_empresa",
    "direccion",
    "telefono",
    "email_facturacion",
    "iban",
  ];

  return requiredFields.some((field) => !details[field]);
}

export const metadata = {
  title: "Panel de proveedores",
  description: "Gestiona tus servicios e ítems",
};

export default async function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { id: userId } = await getProviderUser();
  const supabase = await createClient();
  const { data: details } = await supabase
    .from("provider_details")
    .select("nombre, nombre_empresa, direccion, telefono, email_facturacion, iban")
    .eq("user_id", userId)
    .maybeSingle();
  const billingIncomplete = isBillingIncomplete(details);

  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      <ProviderSidebar />
      <main className="relative flex-1 px-4 pb-28 md:px-6 md:pb-28">
        <ProviderTopbar />
        <div className="mx-auto max-w-5xl py-6 md:py-8">{children}</div>
        {billingIncomplete && (
          <div className="pointer-events-none fixed left-0 right-0 md:left-56 bottom-8 z-20 text-sm">
            <div className="pointer-events-auto mx-auto max-w-2xl rounded-md border border-amber-500 bg-amber-50 px-4 py-3 text-amber-900 shadow-sm dark:border-amber-400 dark:bg-amber-950/60 dark:text-amber-100">
              <div className="flex flex-wrap items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
                <p className="min-w-0 flex-1">
                  Tu cuenta de proveedor no estará operativa ni podrá recibir pagos hasta que completes tus datos de facturación.
                </p>
                <Link
                  href="/provider/details"
                  className="text-xs font-medium text-amber-900 underline underline-offset-4 hover:text-amber-700 dark:text-amber-100 dark:hover:text-amber-300"
                >
                  Completar configuración de la cuenta
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
