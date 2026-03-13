import { getUsersForAdmin } from "../actions";
import { UsersTable } from "./UsersTable";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CreateAdminForm } from "./CreateAdminForm";

export default async function AdminUsersPage() {
  const users = await getUsersForAdmin();

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">
          Gestión de usuarios
        </h2>
        <p className="text-sm text-muted-foreground">
          Lista de clientes, proveedores y administradores. Usa los filtros para
          buscar por tipo y estado, y edita rol o estado cuando sea necesario.
        </p>
      </div>

      <UsersTable initialUsers={users} />

      <Card className="border border-border bg-card">
        <CardHeader className="pb-3">
          <h3 className="text-base font-medium text-card-foreground">
            Crear nuevo administrador
          </h3>
          <p className="text-xs text-muted-foreground">
            Solo los administradores activos pueden crear nuevas cuentas de
            admin.
          </p>
        </CardHeader>
        <CardContent>
          <CreateAdminForm />
        </CardContent>
      </Card>
    </div>
  );
}

