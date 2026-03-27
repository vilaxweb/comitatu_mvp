"use client";

import { useState } from "react";
import { ProviderServiceForm } from "./ProviderServiceForm";
import type { ServiceCategoryWithPredefined, ProviderServiceRow } from "./actions";
import { UnsavedChangesBar } from "@/components/unsaved-changes-bar";
import type { ProviderSector } from "@/lib/provider-sectors";

type CatalogClientProps = {
  categories: ServiceCategoryWithPredefined[];
  providerServices: ProviderServiceRow[];
  providerSector: ProviderSector | null;
};

export function CatalogClient({ categories, providerServices, providerSector }: CatalogClientProps) {
  const [dirtyServices, setDirtyServices] = useState<Record<string, () => void>>({});
  const [resetToken, setResetToken] = useState(0);

  const hasUnsavedChanges = Object.keys(dirtyServices).length > 0;

  const byPredefinedId = new Map<string, ProviderServiceRow>(
    providerServices.map((ps) => [ps.predefined_service_id, ps]),
  );

  return (
    <div className="app-page space-y-4 pt-14 md:pt-16">
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

      <div className="app-title-block space-y-2">
        <h1 className="text-xl font-semibold text-foreground">Catálogo</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Activa los servicios estandarizados que quieras ofrecer. Solo podrás modificar el precio y la
          duración estimada.
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="rounded-xl border border-border bg-background p-6 text-center text-muted-foreground">
          {providerSector ? (
            <>
              <p className="text-sm">
                No hay servicios disponibles para tu sector ({providerSector}).
              </p>
              <p className="mt-1 text-xs">
                Cuando administración asocie servicios predefinidos a este sector, aparecerán aquí para activarlos.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm">
                Debes completar tu sector antes de activar servicios del catálogo.
              </p>
              <p className="mt-1 text-xs">
                Ve a tu perfil de proveedor y selecciona un sector para ver los servicios predefinidos aplicables.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((category: ServiceCategoryWithPredefined) => (
            <section key={category.id} className="space-y-2.5 md:space-y-3">
              <div className="space-y-1">
                <h2 className="text-base font-semibold text-card-foreground">
                  {category.name}
                </h2>
                {category.description ? (
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                ) : null}
              </div>

              {category.predefined_services?.length ? (
                <div className="admin-index-surface">
                  <div className="admin-index-header hidden xl:grid xl:grid-cols-[minmax(260px,3fr)_minmax(320px,4fr)_minmax(320px,3fr)] xl:items-center xl:gap-3">
                    <span>Servicio</span>
                    <span>Descripción</span>
                    <span>Configuración</span>
                  </div>
                  <ul className="admin-index-list">
                  {category.predefined_services.map((service) => {
                    const providerService = byPredefinedId.get(service.id);
                    return (
                      <li
                        key={service.id}
                        className="px-3 py-2.5 md:px-4 md:py-3 lg:px-5"
                      >
                        <div className="grid gap-2.5 md:gap-3 xl:grid-cols-[minmax(260px,3fr)_minmax(320px,4fr)_minmax(320px,3fr)] xl:items-end">
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-medium text-foreground xl:pt-1">
                              {service.name}
                            </h3>
                          </div>
                          <div className="min-w-0">
                            <p className="line-clamp-2 text-xs text-muted-foreground xl:pt-1">
                              {service.description ?? "Sin descripción"}
                            </p>
                          </div>
                          <ProviderServiceForm
                            key={`${service.id}-${resetToken}`}
                            predefinedServiceId={service.id}
                            initialPrice={providerService?.price ?? null}
                            initialDuration={providerService?.duration ?? null}
                            defaultPrice={service.default_price ?? null}
                            defaultDuration={service.default_duration ?? null}
                            compact
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
                </div>
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

