"use client";

import { useActionState } from "react";
import { upsertProviderDetails, type ProviderDetailsRow, type ProviderDetailsActionResult } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

type Props = {
  initialData: ProviderDetailsRow | null;
};

export function ProviderDetailsForm({ initialData }: Props) {
  const [state, formAction] = useActionState<ProviderDetailsActionResult | null, FormData>(
    async (_prev, formData) => upsertProviderDetails(formData),
    null
  );

  return (
    <Card className="border border-border bg-card">
      <CardHeader className="pb-4">
        <h2 className="text-lg font-medium text-card-foreground">Datos para facturación</h2>
        <p className="text-sm text-muted-foreground">
          Nombre, empresa, DNI/CIF, dirección, email de facturación e IBAN para pagos.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action={formAction} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre / contacto</Label>
              <Input
                id="nombre"
                name="nombre"
                type="text"
                placeholder="Nombre o persona de contacto"
                defaultValue={initialData?.nombre ?? ""}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nombre_empresa">Nombre de la empresa</Label>
              <Input
                id="nombre_empresa"
                name="nombre_empresa"
                type="text"
                placeholder="Razón social"
                defaultValue={initialData?.nombre_empresa ?? ""}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dni">DNI</Label>
              <Input
                id="dni"
                name="dni"
                type="text"
                placeholder="Documento nacional de identidad"
                defaultValue={initialData?.dni ?? ""}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cif">CIF</Label>
              <Input
                id="cif"
                name="cif"
                type="text"
                placeholder="Código de identificación fiscal"
                defaultValue={initialData?.cif ?? ""}
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              name="direccion"
              type="text"
              placeholder="Dirección fiscal"
              defaultValue={initialData?.direccion ?? ""}
              className="w-full"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                name="telefono"
                type="tel"
                placeholder="Teléfono de contacto"
                defaultValue={initialData?.telefono ?? ""}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email_facturacion">Email facturación</Label>
              <Input
                id="email_facturacion"
                name="email_facturacion"
                type="email"
                placeholder="email@facturacion.com"
                defaultValue={initialData?.email_facturacion ?? ""}
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="iban">IBAN para pagos</Label>
            <Input
              id="iban"
              name="iban"
              type="text"
              placeholder="ES00 0000 0000 00 0000000000"
              defaultValue={initialData?.iban ?? ""}
              className="w-full uppercase tracking-wide"
            />
            <p className="text-xs text-muted-foreground">
              Añade la cuenta bancaria donde quieres recibir los pagos de tus servicios.
            </p>
          </div>

          {state && "error" in state ? (
            <p className="text-sm text-destructive" role="alert">
              {state.error}
            </p>
          ) : null}
          {state && "success" in state && state.success ? (
            <p className="text-sm text-green-600 dark:text-green-400" role="status">
              Datos guardados correctamente.
            </p>
          ) : null}

          <Button type="submit" className="w-full sm:w-auto">
            Guardar datos
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
