import { listServiceCategories, createServiceCategory, updateServiceCategory, deleteServiceCategory } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata = {
  title: "Categorías de servicios",
};

export default async function AdminServiceCategoriesPage() {
  const categories = await listServiceCategories();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Categorías</h2>
        <p className="text-sm text-muted-foreground">
          Crea y edita las categorías que agrupan los servicios estandarizados del catálogo.
        </p>
      </div>

      <section className="rounded-lg border border-border bg-card p-4">
        <h3 className="mb-3 text-base font-medium text-card-foreground">Nueva categoría</h3>
        <form
          action={async (formData) => {
            "use server";
            const name = formData.get("name") as string;
            const description = (formData.get("description") as string) || undefined;
            if (!name?.trim()) return;
            await createServiceCategory({ name: name.trim(), description });
          }}
          className="grid gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)_auto]"
        >
          <Input name="name" placeholder="Nombre de la categoría" required />
          <Input name="description" placeholder="Descripción (opcional)" />
          <Button type="submit">Crear</Button>
        </form>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-medium text-foreground">Categorías existentes</h3>
        {categories.length === 0 ? (
          <p className="text-sm text-muted-foreground">Todavía no hay categorías creadas.</p>
        ) : (
          <ul className="space-y-2">
            {categories.map((category) => (
              <li
                key={category.id}
                className="flex flex-col gap-2 rounded-lg border border-border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <form
                  action={async (formData) => {
                    "use server";
                    const name = formData.get("name") as string;
                    const description = (formData.get("description") as string) || undefined;
                    if (!name?.trim()) return;
                    await updateServiceCategory(category.id, { name: name.trim(), description });
                  }}
                  className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3"
                >
                  <Input
                    name="name"
                    defaultValue={category.name}
                    className="sm:max-w-xs"
                    aria-label="Nombre de la categoría"
                    required
                  />
                  <Input
                    name="description"
                    defaultValue={category.description ?? ""}
                    placeholder="Descripción (opcional)"
                    aria-label="Descripción de la categoría"
                  />
                  <Button type="submit" size="sm" className="sm:self-stretch">
                    Guardar
                  </Button>
                </form>
                <form
                  action={async () => {
                    "use server";
                    await deleteServiceCategory(category.id);
                  }}
                >
                  <Button type="submit" size="sm" variant="outline" className="text-destructive border-destructive/40">
                    Eliminar
                  </Button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

