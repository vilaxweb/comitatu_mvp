"use client";

import { useTransition, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
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
        <Select
          value={typeFilter || "all-types"}
          onValueChange={(value) =>
            setTypeFilter(
              (value === "all-types" ? "" : value) as "" | "customer" | "provider" | "admin",
            )
          }
        >
          <SelectTrigger className="h-9 w-[160px]">
            <SelectValue placeholder="Todos los tipos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-types">Todos los tipos</SelectItem>
            <SelectItem value="customer">Cliente</SelectItem>
            <SelectItem value="provider">Proveedor</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={statusFilter || "all-statuses"}
          onValueChange={(value) =>
            setStatusFilter(
              (value === "all-statuses" ? "" : value) as "" | "active" | "inactive",
            )
          }
        >
          <SelectTrigger className="h-9 w-[160px]">
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-statuses">Todos los estados</SelectItem>
            <SelectItem value="active">Activo</SelectItem>
            <SelectItem value="inactive">Inactivo</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Buscar por email o usuario"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 max-w-xs"
        />
      </div>

      <Separator className="border-border" />

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
                  <Select
                    value={user.user_type}
                    onValueChange={(value) =>
                      handleChange(user.id, "user_type", value)
                    }
                    disabled={isPending && pendingUserId === user.id}
                  >
                    <SelectTrigger className="h-8 w-[130px] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Cliente</SelectItem>
                      <SelectItem value="provider">Proveedor</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={user.status}
                    onValueChange={(value) =>
                      handleChange(user.id, "status", value)
                    }
                    disabled={isPending && pendingUserId === user.id}
                  >
                    <SelectTrigger className="h-8 w-[130px] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="inactive">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
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

