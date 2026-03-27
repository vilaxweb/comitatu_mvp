"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";

export function AdminContentContainer({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  const isServicesRoute = pathname.startsWith("/admin/services");

  return (
    <div
      className={`mx-auto w-full py-6 md:py-8 ${
        isServicesRoute ? "max-w-none" : "max-w-5xl"
      }`}
    >
      {children}
    </div>
  );
}

