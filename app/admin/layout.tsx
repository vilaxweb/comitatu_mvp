import { ReactNode } from "react";
import { getAdminUser } from "@/lib/auth/get-admin-user";

export const metadata = {
  title: "Panel de administración",
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const admin = await getAdminUser();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">
          Panel de administración
        </h1>
        <p className="text-xs text-muted-foreground">
          Sesión: {admin.email} ({admin.user_type})
        </p>
      </header>
      <main className="flex-1 px-4 py-6">{children}</main>
    </div>
  );
}

