"use client";

import Link from "next/link";
import { useActionState } from "react";
import { updateRecoveredPassword, type AuthResult } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function ResetPasswordForm() {
  const [state, formAction] = useActionState<AuthResult | null, FormData>(
    async (_prev, formData) => updateRecoveredPassword(formData),
    null
  );

  return (
    <Card className="border border-border bg-card">
      <CardHeader className="pb-4">
        <h2 className="text-lg font-medium text-card-foreground">Nueva contraseña</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new_password">Nueva contraseña</Label>
            <Input
              id="new_password"
              name="new_password"
              type="password"
              autoComplete="new-password"
              minLength={10}
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm_password">Confirmar contraseña</Label>
            <Input
              id="confirm_password"
              name="confirm_password"
              type="password"
              autoComplete="new-password"
              minLength={10}
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
              Contraseña actualizada.{" "}
              <Link href="/auth/login?password_reset=1" className="underline underline-offset-4">
                Ir al login
              </Link>
            </p>
          ) : null}
          <Button type="submit" className="w-full">
            Guardar nueva contraseña
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
