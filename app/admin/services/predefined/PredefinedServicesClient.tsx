"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UnsavedChangesBar } from "@/components/unsaved-changes-bar";
import { deletePredefinedService, updatePredefinedService } from "./actions";
import { SectorSelector } from "./SectorSelector";
import { type ProviderSector } from "@/lib/provider-sectors";
import { Trash2 } from "lucide-react";

type EditablePredefinedService = {
  id: string;
  name: string;
  description: string | null;
  default_price: number | null;
  default_duration: number | null;
  sectors: ProviderSector[] | null;
};

type CategoryWithServices = {
  id: string;
  name: string;
  description: string | null;
  predefined_services: EditablePredefinedService[] | null;
};

type Props = {
  initialCategoriesWithServices: CategoryWithServices[];
};

function cloneCategories(categories: CategoryWithServices[]): CategoryWithServices[] {
  return categories.map((category) => ({
    ...category,
    predefined_services:
      category.predefined_services?.map((service) => ({
        ...service,
        sectors: service.sectors ? [...service.sectors] : [],
      })) ?? [],
  }));
}

export function PredefinedServicesClient({ initialCategoriesWithServices }: Props) {
  const [categories, setCategories] = useState<CategoryWithServices[]>(
    () => cloneCategories(initialCategoriesWithServices),
  );
  const [savedSnapshot, setSavedSnapshot] = useState<CategoryWithServices[]>(
    () => cloneCategories(initialCategoriesWithServices),
  );
  const [dirtyIds, setDirtyIds] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);

  const serviceIndex = useMemo(() => {
    const index = new Map<string, EditablePredefinedService>();
    for (const category of categories) {
      for (const service of category.predefined_services ?? []) {
        index.set(service.id, service);
      }
    }
    return index;
  }, [categories]);

  const hasUnsavedChanges = dirtyIds.size > 0;

  const markDirty = (serviceId: string) => {
    setDirtyIds((prev) => {
      const next = new Set(prev);
      next.add(serviceId);
      return next;
    });
  };

  const updateServiceInState = (
    serviceId: string,
    updater: (service: EditablePredefinedService) => EditablePredefinedService,
  ) => {
    setCategories((prev) =>
      prev.map((category) => ({
        ...category,
        predefined_services:
          category.predefined_services?.map((service) =>
            service.id === serviceId ? updater(service) : service,
          ) ?? [],
      })),
    );
    markDirty(serviceId);
  };

  const handleSave = async () => {
    if (dirtyIds.size === 0) return;
    setIsSaving(true);
    try {
      const updates = Array.from(dirtyIds)
        .map((serviceId) => serviceIndex.get(serviceId))
        .filter((service): service is EditablePredefinedService => Boolean(service))
        .map((service) =>
          updatePredefinedService(service.id, {
            name: service.name.trim(),
            description: service.description?.trim() || undefined,
            defaultPrice: Number(service.default_price ?? 0),
            defaultDuration: Number(service.default_duration ?? 0),
            sectors: service.sectors ?? [],
          }),
        );

      await Promise.all(updates);
      setSavedSnapshot(cloneCategories(categories));
      setDirtyIds(new Set());
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setCategories(cloneCategories(savedSnapshot));
    setDirtyIds(new Set());
  };

  return (
    <section className="space-y-4 pt-14 md:pt-16">
      <UnsavedChangesBar
        hasUnsavedChanges={hasUnsavedChanges}
        onSave={handleSave}
        onCancel={handleCancel}
      />
      {categories.length === 0 ? (
        <div className="rounded-xl border border-border bg-background p-6 text-center text-muted-foreground">
          <p className="text-sm">Aún no hay servicios estandarizados configurados en el catálogo.</p>
          <p className="mt-1 text-xs">
            Crea primero categorías y luego añade servicios predefinidos para que los proveedores puedan activarlos desde su panel.
          </p>
        </div>
      ) : (
        categories.map((category) => (
          <section key={category.id} className="space-y-2.5 md:space-y-3">
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-card-foreground">{category.name}</h3>
              {category.description ? (
                <p className="text-sm text-muted-foreground">{category.description}</p>
              ) : null}
            </div>

            {category.predefined_services?.length ? (
              <div className="admin-index-surface">
                <div className="admin-index-header hidden xl:grid xl:grid-cols-[minmax(220px,2fr)_minmax(260px,3fr)_minmax(120px,1fr)_minmax(120px,1fr)_minmax(220px,2fr)_auto] xl:items-center xl:gap-3">
                  <span>Nombre</span>
                  <span>Descripción</span>
                  <span>Precio</span>
                  <span>Duración (h)</span>
                  <span>Sectores</span>
                  <span className="text-right">Acciones</span>
                </div>
                <ul className="admin-index-list">
                {category.predefined_services.map((service) => (
                  <li
                    key={service.id}
                    className="px-3 py-2.5 md:px-4 md:py-3 lg:px-5"
                  >
                    <div className="grid gap-2.5 md:gap-3 xl:grid-cols-[minmax(220px,2fr)_minmax(260px,3fr)_minmax(120px,1fr)_minmax(120px,1fr)_minmax(220px,2fr)_auto] xl:items-end">
                      <div>
                        <Input
                          value={service.name}
                          onChange={(event) =>
                            updateServiceInState(service.id, (prev) => ({
                              ...prev,
                              name: event.target.value,
                            }))
                          }
                          className="h-8 w-full"
                          aria-label="Nombre del servicio predefinido"
                          required
                        />
                      </div>
                      <div>
                        <Input
                          value={service.description ?? ""}
                          onChange={(event) =>
                            updateServiceInState(service.id, (prev) => ({
                              ...prev,
                              description: event.target.value,
                            }))
                          }
                          placeholder="Descripción (opcional)"
                          aria-label="Descripción del servicio predefinido"
                          className="h-8 w-full"
                        />
                      </div>
                      <div>
                        <Input
                          type="number"
                          min={0.01}
                          step="0.01"
                          value={service.default_price ?? 0}
                          onChange={(event) =>
                            updateServiceInState(service.id, (prev) => ({
                              ...prev,
                              default_price: Number(event.target.value),
                            }))
                          }
                          aria-label="Precio por defecto del servicio predefinido"
                          className="h-8 w-full"
                          required
                        />
                      </div>
                      <div>
                        <Input
                          type="number"
                          min={1}
                          step="1"
                          value={service.default_duration ?? 1}
                          onChange={(event) =>
                            updateServiceInState(service.id, (prev) => ({
                              ...prev,
                              default_duration: Number(event.target.value),
                            }))
                          }
                          aria-label="Duración por defecto en horas del servicio predefinido"
                          className="h-8 w-full"
                          required
                        />
                      </div>
                      <div>
                        <SectorSelector
                          className="relative w-full"
                          selected={service.sectors ?? []}
                          onSelectedChange={(nextSectors) =>
                            updateServiceInState(service.id, (prev) => ({
                              ...prev,
                              sectors: nextSectors,
                            }))
                          }
                        />
                      </div>
                      <div className="flex items-end xl:justify-end">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="group shrink-0 border-destructive/40 px-2.5 text-destructive hover:bg-destructive hover:!text-destructive-foreground"
                          disabled={isSaving}
                          aria-label="Eliminar servicio predefinido"
                          title="Eliminar servicio predefinido"
                          onClick={async () => {
                            if (!window.confirm(`Se eliminará el servicio predefinido "${service.name}".`)) {
                              return;
                            }
                            await deletePredefinedService(service.id);
                            setCategories((prev) =>
                              prev.map((cat) => ({
                                ...cat,
                                predefined_services:
                                  cat.predefined_services?.filter((item) => item.id !== service.id) ?? [],
                              })),
                            );
                            setSavedSnapshot((prev) =>
                              prev.map((cat) => ({
                                ...cat,
                                predefined_services:
                                  cat.predefined_services?.filter((item) => item.id !== service.id) ?? [],
                              })),
                            );
                            setDirtyIds((prev) => {
                              const next = new Set(prev);
                              next.delete(service.id);
                              return next;
                            });
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive group-hover:!text-white" aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No hay servicios en esta categoría.</p>
            )}
          </section>
        ))
      )}
    </section>
  );
}
