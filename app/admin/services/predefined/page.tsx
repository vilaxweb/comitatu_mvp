import { listPredefinedServicesByCategory, createPredefinedService } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { listServiceCategories } from "../actions";
import { PROVIDER_SECTORS, type ProviderSector } from "@/lib/provider-sectors";
import { SectorSelector } from "./SectorSelector";
import { PredefinedServicesClient } from "./PredefinedServicesClient";

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
    <div className="app-page">
      <div className="app-title-block">
        <h2 className="text-xl font-semibold text-foreground">Servicios predefinidos</h2>
        <p className="text-sm text-muted-foreground">
          Define servicios estándar dentro de cada categoría. También puedes establecer un precio y tiempo en horas por defecto para facilitar la activación por parte de proveedores.
        </p>
      </div>

      <section className="app-card space-y-4 p-5">
        <h3 className="text-base font-medium text-card-foreground">Nuevo servicio predefinido</h3>
        <form
          action={async (formData) => {
            "use server";
            const categoryId = formData.get("categoryId") as string;
            const name = formData.get("name") as string;
            const description = (formData.get("description") as string) || undefined;
            const defaultPrice = Number(formData.get("defaultPrice"));
            const defaultDuration = Number(formData.get("defaultDuration"));
            const sectors = formData
              .getAll("sectors")
              .map((value) => String(value))
              .filter((value) => PROVIDER_SECTORS.includes(value as ProviderSector)) as ProviderSector[];
            if (!categoryId || !name?.trim()) return;
            if (!Number.isFinite(defaultPrice) || defaultPrice <= 0) return;
            if (!Number.isInteger(defaultDuration) || defaultDuration <= 0) return;
            if (sectors.length === 0) return;
            await createPredefinedService({
              categoryId,
              name: name.trim(),
              description,
              defaultPrice,
              defaultDuration,
              sectors,
            });
          }}
          className="grid gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)_minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,2fr)_auto]"
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
          <Input
            name="defaultPrice"
            type="number"
            min={0.01}
            step="0.01"
            placeholder="Precio por defecto"
            required
          />
          <Input
            name="defaultDuration"
            type="number"
            min={1}
            step="1"
            placeholder="Duración por defecto (h)"
            required
          />
          <SectorSelector className="relative" />
          <Button type="submit">Crear</Button>
        </form>
      </section>

      <PredefinedServicesClient initialCategoriesWithServices={categoriesWithServices} />
    </div>
  );
}

