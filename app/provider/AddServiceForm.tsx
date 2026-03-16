"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { createService, type ServiceActionResult } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function AddServiceForm() {
  const router = useRouter();
  const [state, formAction] = useActionState<ServiceActionResult | null, FormData>(
    async (_prev, formData) => {
      const result = await createService(formData);
      if ("success" in result && result.success && result.id) {
        router.push(`/provider/services/${result.id}`);
        return result;
      }
      return result;
    },
    null
  );

  return (
    <Card className="border border-border bg-card">
      <CardHeader className="pb-4">
        <h2 className="text-lg font-medium text-card-foreground">Nuevo servicio</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Nombre del Servicio <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="ej. Diseño Web"
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción del Servicio (opcional)</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Breve descripción del servicio"
              rows={3}
            />
          </div>
          {state && "error" in state ? (
            <p className="text-sm text-destructive" role="alert">
              {state.error}
            </p>
          ) : null}
          <Button type="submit" className="w-full">
            Añadir Servicio
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
