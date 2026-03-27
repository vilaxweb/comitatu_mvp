"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function getSectionLabel(pathname: string): string {
  if (pathname === "/provider" || pathname === "/provider/") {
    return "Crear servicio";
  }

  if (pathname.startsWith("/provider/catalog")) {
    return "Catálogo";
  }

  if (pathname === "/provider/services" || pathname === "/provider/services/") {
    return "Servicios a medida";
  }

  if (pathname.startsWith("/provider/services/")) {
    return "Detalle del servicio";
  }

  if (pathname.startsWith("/provider/account")) {
    return "Mi cuenta";
  }

  if (pathname.startsWith("/provider/details")) {
    return "Datos de facturación";
  }

  return "Panel de proveedor";
}

export function ProviderTopbar() {
  const pathname = usePathname();
  const sectionLabel = getSectionLabel(pathname ?? "/provider");

  return (
    <header className="sticky top-0 z-30 -mx-4 border-b border-border bg-background/80 px-4 py-3 backdrop-blur md:-mx-6 md:px-6">
      <div className="flex items-center">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/provider">Panel de proveedor</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{sectionLabel}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}

