"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlusCircle, LayoutList, UserCircle, LogOut } from "lucide-react";
import { signOut } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/provider", label: "Añadir Servicio", exact: true, icon: PlusCircle },
  { href: "/provider/services", label: "Mis Servicios", exact: false, icon: LayoutList },
  { href: "/provider/details", label: "Mis datos", exact: true, icon: UserCircle },
] as const;

export function ProviderSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-border bg-card px-4 py-4 md:w-56 md:border-b-0 md:border-r md:py-6">
      <nav className="flex flex-col gap-2">
        <p className="mb-2 hidden text-xs font-medium uppercase tracking-wider text-muted-foreground md:block">
          Panel
        </p>
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
        <div className="mt-4 border-t border-border pt-4">
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
