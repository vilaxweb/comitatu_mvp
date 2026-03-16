"use client";

import { useState } from "react";
import { ProviderServiceForm } from "./ProviderServiceForm";
import type { ServiceCategoryWithPredefined, ProviderServiceRow } from "./actions";
import { UnsavedChangesBar } from "@/components/unsaved-changes-bar";

type CatalogClientProps = {
  categories: ServiceCategoryWithPredefined[];
  providerServices: ProviderServiceRow[];
};

export function CatalogClient({ categories, providerServices }: CatalogClientProps) {
  const [dirtyServices, setDirtyServices] = useState<Record<string, () => void>>({});
  const [resetToken, setResetToken] = useState(0);

  const hasUnsavedChanges = Object.keys(dirtyServices).length > 0;

  const byPredefinedId = new Map<string, ProviderServiceRow>(
    providerServices.map((ps) => [ps.predefined_service_id, ps]),
  );

  return (
    <div className="mx-auto max-w-3xl space-y-4 pt-16">
      <UnsavedChangesBar
        hasUnsavedChanges={hasUnsavedChanges}
        onSave={() => {
          const saves = Object.values(dirtyServices);
          saves.forEach((save) => save());
          setDirtyServices({});
        }}
        onCancel={() => {
          setDirtyServices({});
          setResetToken((token) => token + 1);
        }}
      />

      <div className="space-y-2">
        <h1 className="text-xl font-semibold text-foreground">Servicios del catálogo</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Activa los servicios estandarizados que quieras ofrecer. Solo podrás modificar el precio y la
          duración estimada.
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-6 text-center text-muted-foreground">
          <p className="text-sm">
            Aún no hay servicios disponibles en el catálogo para activar.
          </p>
          <p className="mt-1 text-xs">
            Cuando el equipo de administración publique nuevos servicios estandarizados, podrás activarlos desde aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((category: ServiceCategoryWithPredefined) => (
            <section
              key={category.id}
              className="space-y-2 rounded-lg border border-border bg-card p-4"
            >
              <div>
                <h2 className="text-base font-semibold text-card-foreground">
                  {category.name}
                </h2>
                {category.description ? (
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                ) : null}
              </div>

              {category.predefined_services?.length ? (
                <ul className="space-y-2">
                  {category.predefined_services.map((service) => {
                    const providerService = byPredefinedId.get(service.id);
                    return (
                      <li
                        key={service.id}
                        className="rounded-lg border border-border bg-background px-3 py-2"
                      >
                        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                          <div className="min-w-0 flex-1">
                            <h3 className="truncate text-sm font-medium text-foreground">
                              {service.name}
                            </h3>
                            {service.description ? (
                              <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                                {service.description}
                              </p>
                            ) : null}
                          </div>
                          <ProviderServiceForm
                            key={`${service.id}-${resetToken}`}
                            predefinedServiceId={service.id}
                            initialPrice={providerService?.price ?? null}
                            initialDuration={providerService?.duration ?? null}
                            onDirtyChange={(dirty, save) => {
                              setDirtyServices((prev) => {
                                const next = { ...prev };
                                if (dirty) {
                                  next[service.id] = save;
                                } else {
                                  delete next[service.id];
                                }
                                return next;
                              });
                            }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No hay servicios en esta categoría por ahora.
                </p>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

