import { getProviderDetails } from "../actions";
import { ProviderDetailsForm } from "./ProviderDetailsForm";

export const metadata = {
  title: "Mis datos | Panel de proveedores",
  description: "Datos para facturación y pagos",
};

export default async function ProviderDetailsPage() {
  const details = await getProviderDetails();

  return (
    <div className="app-page flex flex-col">
      <div className="app-title-block">
        <h1 className="text-xl font-semibold text-foreground">Datos de facturación</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Completa o edita tus datos. Los utilizaremos para emitir facturas y realizar pagos.
        </p>
      </div>
      <ProviderDetailsForm initialData={details} />
    </div>
  );
}
