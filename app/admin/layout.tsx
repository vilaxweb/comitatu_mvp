import { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";
import { AdminContentContainer } from "./AdminContentContainer";

export const metadata = {
  title: "Panel de administración",
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      <AdminSidebar />
      <main className="relative flex-1 px-4 pb-28 md:px-6 md:pb-28">
        <AdminTopbar />
        <AdminContentContainer>{children}</AdminContentContainer>
      </main>
    </div>
  );
}

