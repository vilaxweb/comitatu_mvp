"use client";

import { useActionState } from "react";
import { createAdminUser, type AdminCreateResult } from "../actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function CreateAdminForm() {
  const [state, formAction] = useActionState<AdminCreateResult | null, FormData>(
    async (_prev, formData) => createAdminUser(formData),
    null,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="username"
          className="text-sm font-medium text-foreground"
        >
          Nombre de usuario
        </label>
        <Input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-sm font-medium text-foreground"
        >
          Contraseña (mín. 6 caracteres)
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={6}
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="status" className="text-sm font-medium text-foreground">
          Estado
        </label>
        <select
          id="status"
          name="status"
          className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
          defaultValue="active"
        >
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
        </select>
      </div>

      {state && "error" in state ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
      {state && "success" in state && state.success ? (
        <p className="text-sm text-emerald-600" role="status">
          Administrador creado correctamente.
        </p>
      ) : null}

      <Button type="submit" className="w-full">
        Crear administrador
      </Button>
    </form>
  );
}

