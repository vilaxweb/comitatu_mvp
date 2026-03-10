"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { createService, type ServiceActionResult } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
            <label htmlFor="name" className="text-sm font-medium text-foreground">
              Nombre del Servicio <span className="text-destructive">*</span>
            </label>
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
            <label htmlFor="description" className="text-sm font-medium text-foreground">
              Descripción del Servicio (opcional)
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Breve descripción del servicio"
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
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
