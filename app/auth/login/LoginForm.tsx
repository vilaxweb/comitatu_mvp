"use client";

import { useActionState } from "react";
import { login, type AuthResult } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function LoginForm() {
  const [state, formAction] = useActionState<AuthResult | null, FormData>(
    async (_prev, formData) => login(formData),
    null
  );

  return (
    <Card className="border border-border bg-card">
      <CardHeader className="pb-4">
        <h2 className="text-lg font-medium text-card-foreground">Acceso</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email_or_username" className="text-sm font-medium text-foreground">
              Email o nombre de usuario
            </label>
            <Input
              id="email_or_username"
              name="email_or_username"
              type="text"
              autoComplete="username"
              placeholder="tu@correo.com o usuario"
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Contraseña
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
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
            Iniciar sesión
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
