import { AddServiceForm } from "./AddServiceForm";

export const metadata = {
  title: "Añadir servicio",
  description: "Crear un nuevo servicio",
};

export default function ProviderAddServicePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Añadir Servicio</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Crea un nuevo servicio y luego podrás añadir ítems (nombre, precio, tiempo estimado).
        </p>
      </div>
      <AddServiceForm />
    </div>
  );
}
