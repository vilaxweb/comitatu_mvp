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
   if (pathname === "/admin" || pathname === "/admin/") {
     return "Resumen";
   }

   if (pathname.startsWith("/admin/users")) {
     return "Usuarios";
   }

   if (pathname.startsWith("/admin/services")) {
     return "Catálogo de Servicios";
   }

   return "Panel de administración";
 }

 export function AdminTopbar() {
   const pathname = usePathname() ?? "/admin";
   const sectionLabel = getSectionLabel(pathname);

   return (
     <header className="sticky top-0 z-30 -mx-4 border-b border-border bg-background/80 px-4 py-3 backdrop-blur md:-mx-6 md:px-6">
       <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
         <Breadcrumb>
           <BreadcrumbList>
             <BreadcrumbItem>
               <BreadcrumbLink href="/admin">Panel de administración</BreadcrumbLink>
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

