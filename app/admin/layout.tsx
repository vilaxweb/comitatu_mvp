import { ReactNode } from "react";
import { getAdminUser } from "@/lib/auth/get-admin-user";
import { AdminSidebar } from "./AdminSidebar";

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
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      <AdminSidebar />
      <main className="relative flex-1 px-4 py-6 md:px-6 md:py-8">
        <header className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-foreground">
            Panel de administración
          </h1>
          <p className="text-xs text-muted-foreground">
            Sesión: {admin.email} ({admin.user_type})
          </p>
        </header>
        {children}
      </main>
    </div>
  );
}

