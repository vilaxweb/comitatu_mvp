import { getProviderDetails } from "../actions";
import { ProviderDetailsForm } from "./ProviderDetailsForm";

export const metadata = {
  title: "Mis datos | Panel de proveedores",
  description: "Datos para facturación y pagos",
};

export default async function ProviderDetailsPage() {
  const details = await getProviderDetails();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Mis datos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Completa o edita tu información. Se utilizará para facturas y pagos.
        </p>
      </div>
      <ProviderDetailsForm initialData={details} />
    </div>
  );
}
