import { getProviderUser } from "@/lib/auth/get-provider-user";
import { ProviderSidebar } from "./ProviderSidebar";

export const metadata = {
  title: "Panel de proveedores",
  description: "Gestiona tus servicios e ítems",
};

export default async function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await getProviderUser();

  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      <ProviderSidebar />
      <main className="flex-1 px-4 py-6 md:px-6 md:py-8">{children}</main>
    </div>
  );
}
