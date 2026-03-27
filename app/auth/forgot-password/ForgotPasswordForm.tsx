"use client";

import { useActionState } from "react";
import { requestPasswordRecovery, type AuthMessageResult } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState<AuthMessageResult | null, FormData>(
    async (_prev, formData) => requestPasswordRecovery(formData),
    null
  );

  return (
    <Card className="border border-border bg-card">
      <CardHeader className="pb-4">
        <h2 className="text-lg font-medium text-card-foreground">Recuperar contraseña</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action={formAction} className="space-y-4">
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
          {state && "error" in state ? (
            <p className="text-sm text-destructive" role="alert">
              {state.error}
            </p>
          ) : null}
          {state && "success" in state ? (
            <p className="text-sm text-emerald-600" role="status">
              {state.success}
            </p>
          ) : null}
          <Button type="submit" className="w-full">
            Enviar enlace de recuperación
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
