import { listCatalogWithProviderServices } from "./actions";
import { CatalogClient } from "./CatalogClient";

export const metadata = {
  title: "Catálogo",
  description: "Activa servicios estandarizados y define tu precio y duración.",
};

export default async function ProviderCatalogServicesPage() {
  const { categories, providerServices, providerSector } = await listCatalogWithProviderServices();

  return (
    <CatalogClient
      categories={categories}
      providerServices={providerServices}
      providerSector={providerSector}
    />
  );
}

