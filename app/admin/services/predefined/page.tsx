import { listPredefinedServicesByCategory, createPredefinedService, updatePredefinedService, deletePredefinedService } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { listServiceCategories } from "../actions";

export const metadata = {
  title: "Servicios predefinidos",
};

export default async function AdminPredefinedServicesPage() {
  const [categoriesWithServices, categories] = await Promise.all([
    listPredefinedServicesByCategory(),
    listServiceCategories(),
  ]);

  const flatCategories = categories ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Servicios predefinidos</h2>
        <p className="text-sm text-muted-foreground">
          Define servicios estándar dentro de cada categoría. Los proveedores podrán activarlos en su panel y fijar el precio y la duración estimada.
        </p>
      </div>

      <section className="rounded-lg border border-border bg-card p-4 space-y-4">
        <h3 className="text-base font-medium text-card-foreground">Nuevo servicio predefinido</h3>
        <form
          action={async (formData) => {
            "use server";
            const categoryId = formData.get("categoryId") as string;
            const name = formData.get("name") as string;
            const description = (formData.get("description") as string) || undefined;
            if (!categoryId || !name?.trim()) return;
            await createPredefinedService({ categoryId, name: name.trim(), description });
          }}
          className="grid gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)_minmax(0,2fr)_auto]"
        >
          <Select name="categoryId">
            <SelectTrigger>
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              {flatCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input name="name" placeholder="Nombre del servicio" required />
          <Input name="description" placeholder="Descripción (opcional)" />
          <Button type="submit">Crear</Button>
        </form>
      </section>

      <section className="space-y-4">
        {categoriesWithServices.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-6 text-center text-muted-foreground">
            <p className="text-sm">
              Aún no hay servicios estandarizados configurados en el catálogo.
            </p>
            <p className="mt-1 text-xs">
              Crea primero categorías y luego añade servicios predefinidos para que los proveedores puedan activarlos desde su panel.
            </p>
          </div>
        ) : (
          categoriesWithServices.map((category) => (
            <div key={category.id} className="space-y-2 rounded-lg border border-border bg-card p-4">
              <div>
                <h3 className="text-base font-semibold text-card-foreground">{category.name}</h3>
                {category.description ? (
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                ) : null}
              </div>

              {category.predefined_services?.length ? (
                <ul className="space-y-2">
                  {category.predefined_services.map((service) => (
                    <li
                      key={service.id}
                      className="flex flex-col gap-2 rounded-lg border border-border bg-background px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <form
                        action={async (formData) => {
                          "use server";
                          const name = formData.get("name") as string;
                          const description = (formData.get("description") as string) || undefined;
                          if (!name?.trim()) return;
                          await updatePredefinedService(service.id, { name: name.trim(), description });
                        }}
                        className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3"
                      >
                        <Input
                          name="name"
                          defaultValue={service.name}
                          className="sm:max-w-xs"
                          aria-label="Nombre del servicio predefinido"
                          required
                        />
                        <Input
                          name="description"
                          defaultValue={service.description ?? ""}
                          placeholder="Descripción (opcional)"
                          aria-label="Descripción del servicio predefinido"
                        />
                        <Button type="submit" size="sm" className="sm:self-stretch">
                          Guardar
                        </Button>
                      </form>
                      <form
                        action={async () => {
                          "use server";
                          await deletePredefinedService(service.id);
                        }}
                      >
                        <Button
                          type="submit"
                          size="sm"
                          variant="outline"
                          className="border-destructive/40 text-destructive"
                        >
                          Eliminar
                        </Button>
                      </form>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No hay servicios en esta categoría.</p>
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
}

