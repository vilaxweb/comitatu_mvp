"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, type AuthResult } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ nextPath }: { nextPath?: string }) {
  const [state, formAction] = useActionState<AuthResult | null, FormData>(
    async (_prev, formData) => login(formData),
    null
  );

  return (
    <form action={formAction} className="space-y-4">
      {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}
      <div className="space-y-2">
        <Label htmlFor="email_or_username">Email o nombre de usuario</Label>
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
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full"
        />
      </div>
      <div className="text-right">
        <Link href="/auth/forgot-password" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
          ¿Olvidaste tu contraseña?
        </Link>
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
  );
}
