"use client";

import { useActionState } from "react";
import { upsertProviderDetails, type ProviderDetailsRow, type ProviderDetailsActionResult } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
              <label htmlFor="nombre" className="text-sm font-medium text-foreground">
                Nombre / contacto
              </label>
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
              <label htmlFor="nombre_empresa" className="text-sm font-medium text-foreground">
                Nombre de la empresa
              </label>
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
              <label htmlFor="dni" className="text-sm font-medium text-foreground">
                DNI
              </label>
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
              <label htmlFor="cif" className="text-sm font-medium text-foreground">
                CIF
              </label>
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
            <label htmlFor="direccion" className="text-sm font-medium text-foreground">
              Dirección
            </label>
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
              <label htmlFor="telefono" className="text-sm font-medium text-foreground">
                Teléfono
              </label>
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
              <label htmlFor="email_facturacion" className="text-sm font-medium text-foreground">
                Email facturación
              </label>
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
            <label htmlFor="iban" className="text-sm font-medium text-foreground">
              IBAN para pagos
            </label>
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
