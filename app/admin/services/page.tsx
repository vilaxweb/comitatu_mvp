import Link from "next/link";

export const metadata = {
  title: "Catálogo de Servicios",
};

export default function AdminServicesHomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Catálogo de Servicios</h2>
        <p className="text-sm text-muted-foreground">
          Define el catálogo estandarizado que los proveedores podrán activar en su panel.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/services/categories"
          className="block rounded-lg border border-border bg-card p-4 transition-colors hover:border-accent"
        >
          <h3 className="text-base font-medium text-card-foreground">Categorías</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Crea y organiza categorías para agrupar los servicios del catálogo.
          </p>
        </Link>

        <Link
          href="/admin/services/predefined"
          className="block rounded-lg border border-border bg-card p-4 transition-colors hover:border-accent"
        >
          <h3 className="text-base font-medium text-card-foreground">Servicios predefinidos</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Define los servicios estándar que los proveedores podrán activar en su oferta.
          </p>
        </Link>
      </div>
    </div>
  );
}

