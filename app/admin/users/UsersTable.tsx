"use client";

import { useTransition, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { AdminUserSummary } from "../actions";
import { updateUserFromAdmin } from "../actions";

type Props = {
  initialUsers: AdminUserSummary[];
};

export function UsersTable({ initialUsers }: Props) {
  const [users, setUsers] = useState<AdminUserSummary[]>(initialUsers);
  const [typeFilter, setTypeFilter] = useState<"" | "customer" | "provider" | "admin">("");
  const [statusFilter, setStatusFilter] = useState<"" | "active" | "inactive">("");
  const [search, setSearch] = useState("");
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredUsers = users.filter((u) => {
    if (typeFilter && u.user_type !== typeFilter) return false;
    if (statusFilter && u.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !u.email?.toLowerCase().includes(q) &&
        !u.username.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });

  const handleChange = (id: string, field: "user_type" | "status", value: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, [field]: value } : u)),
    );
    setPendingUserId(id);
    startTransition(async () => {
      const user = users.find((u) => u.id === id);
      const next = { ...(user as AdminUserSummary), [field]: value };
      const result = await updateUserFromAdmin(next);
      if ("error" in result) {
        // revert on error
        setUsers((prev) => prev);
        // eslint-disable-next-line no-alert
        alert(result.error);
      }
      setPendingUserId(null);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <select
          value={typeFilter}
          onChange={(e) =>
            setTypeFilter(e.target.value as "" | "customer" | "provider" | "admin")
          }
          className="h-9 rounded-md border border-input bg-background px-2 text-sm"
        >
          <option value="">Todos los tipos</option>
          <option value="customer">Cliente</option>
          <option value="provider">Proveedor</option>
          <option value="admin">Admin</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as "" | "active" | "inactive")
          }
          className="h-9 rounded-md border border-input bg-background px-2 text-sm"
        >
          <option value="">Todos los estados</option>
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
        </select>
        <Input
          placeholder="Buscar por email o usuario"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 max-w-xs"
        />
      </div>

      <div className="rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Servicios creados</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <select
                    value={user.user_type}
                    onChange={(e) =>
                      handleChange(user.id, "user_type", e.target.value)
                    }
                    className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                    disabled={isPending && pendingUserId === user.id}
                  >
                    <option value="customer">Cliente</option>
                    <option value="provider">Proveedor</option>
                    <option value="admin">Admin</option>
                  </select>
                </TableCell>
                <TableCell>
                  <select
                    value={user.status}
                    onChange={(e) =>
                      handleChange(user.id, "status", e.target.value)
                    }
                    className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                    disabled={isPending && pendingUserId === user.id}
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                  </select>
                </TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">
                  {user.services_count ?? 0}
                </TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-4 text-center text-sm text-muted-foreground">
                  No se encontraron usuarios con los filtros actuales.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => {
          setTypeFilter("");
          setStatusFilter("");
          setSearch("");
        }}
      >
        Limpiar filtros
      </Button>
    </div>
  );
}

