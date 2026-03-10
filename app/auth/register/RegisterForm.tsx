"use client";

import { useActionState } from "react";
import { register, type AuthResult } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function RegisterForm() {
  const [state, formAction] = useActionState<AuthResult | null, FormData>(
    async (_prev, formData) => register(formData),
    null
  );

  return (
    <Card className="border border-border bg-card">
      <CardHeader className="pb-4">
        <h2 className="text-lg font-medium text-card-foreground">Registro</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-foreground">
              Nombre de usuario
            </label>
            <Input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="nombre_usuario"
              required
              className="w-full"
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
              placeholder="tu@correo.com"
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="user_type" className="text-sm font-medium text-foreground">
              Tipo de cuenta
            </label>
            <select
              id="user_type"
              name="user_type"
              required
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
            >
              <option value="customer">Cliente</option>
              <option value="provider">Proveedor</option>
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Contraseña (mín. 6 caracteres)
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={6}
              required
              className="w-full"
            />
          </div>
          {state && "error" in state ? (
            <p className="text-sm text-destructive" role="alert">
              {state.error}
            </p>
          ) : null}
          <Button type="submit" className="w-full">
            Registrar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
