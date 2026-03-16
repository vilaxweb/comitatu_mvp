"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { PlusCircle, LayoutList, UserCircle, LogOut, CreditCard, Briefcase } from "lucide-react";
import { signOut } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/provider", label: "Añadir Servicio", exact: true, icon: PlusCircle },
  { href: "/provider/services", label: "Servicios personalizados", exact: false, icon: LayoutList },
  { href: "/provider/catalog", label: "Servicios del catálogo", exact: false, icon: Briefcase },
  { href: "/provider/details", label: "Datos de facturación", exact: true, icon: CreditCard },
] as const;

export function ProviderSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-border bg-card px-4 py-4 md:sticky md:top-0 md:h-screen md:w-56 md:border-b-0 md:border-r md:py-6">
      <nav className="flex flex-col gap-2">
        <div className="mb-6 flex items-center justify-center md:justify-start">
          <Image
            src="/comitatu-logo.png"
            alt="Comitatu"
            width={126}
            height={29}
            className="h-7 w-auto"
            priority
          />
        </div>
        <p className="mb-2 hidden text-xs font-medium uppercase tracking-wider text-muted-foreground md:block">
          Panel
        </p>
        <button
          type="button"
          disabled
          className="flex cursor-not-allowed items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground/80"
        >
          <Briefcase className="size-4 shrink-0" aria-hidden />
          Trabajos activos
        </button>
        {navItems.map(({ href, label, exact, icon: Icon }) => {
          const isActive = exact
            ? pathname === href
            : pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              {label}
            </Link>
          );
        })}
        <div className="mt-4 border-t border-border pt-4 space-y-1">
          <Link
            href="/provider/account"
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname === "/provider/account"
                ? "bg-accent text-accent-foreground"
                : "text-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <UserCircle className="size-4 shrink-0" aria-hidden />
            Mi cuenta
          </Link>
          <form action={signOut}>
            <Button type="submit" variant="ghost" size="sm" className="w-full justify-start gap-2">
              <LogOut className="size-4 shrink-0" aria-hidden />
              Cerrar sesión
            </Button>
          </form>
        </div>
      </nav>
    </aside>
  );
}
