"use client";

import { useActionState } from "react";
import { createUserFromAdmin, type AdminCreateResult } from "../actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CreateUserForm() {
  const [state, formAction] = useActionState<AdminCreateResult | null, FormData>(
    async (_prev, formData) => createUserFromAdmin(formData),
    null,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username" className="text-sm font-medium text-foreground">
          Nombre de usuario
        </Label>
        <Input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-foreground">
          Contraseña (mín. 10, con mayúscula, minúscula y número)
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={10}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="user_type" className="text-sm font-medium text-foreground">
          Tipo de usuario
        </Label>
        <Select name="user_type" defaultValue="customer" required>
          <SelectTrigger id="user_type" className="w-full">
            <SelectValue placeholder="Selecciona el tipo de usuario" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="customer">Cliente</SelectItem>
            <SelectItem value="provider">Proveedor</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="status" className="text-sm font-medium text-foreground">
          Estado
        </Label>
        <Select name="status" defaultValue="active" required>
          <SelectTrigger id="status" className="w-full">
            <SelectValue placeholder="Selecciona el estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Activo</SelectItem>
            <SelectItem value="inactive">Inactivo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {state && "error" in state ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
      {state && "success" in state && state.success ? (
        <p className="text-sm text-emerald-600" role="status">
          Usuario creado correctamente.
        </p>
      ) : null}

      <Button type="submit" className="w-full">
        Crear usuario
      </Button>
    </form>
  );
}

