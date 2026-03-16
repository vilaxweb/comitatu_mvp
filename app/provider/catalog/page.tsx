import { listCatalogWithProviderServices } from "./actions";
import { CatalogClient } from "./CatalogClient";

export const metadata = {
  title: "Servicios del catálogo",
  description: "Activa servicios estandarizados y define tu precio y duración.",
};

export default async function ProviderCatalogServicesPage() {
  const { categories, providerServices } = await listCatalogWithProviderServices();

  return (
    <CatalogClient categories={categories} providerServices={providerServices} />
  );
}

