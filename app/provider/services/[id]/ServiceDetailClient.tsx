"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import {
  updateService,
  deleteService,
  createItem,
  deleteItem,
  type ServiceActionResult,
  type ItemActionResult,
} from "../../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/formatPrice";

type VoidFormAction = (formData: FormData) => void | Promise<void>;

type Service = { id: string; name: string; description: string };
type Item = { id: string; name: string; price: string; estimated_time: string; active: boolean };

export function ServiceDetailClient({
  service,
  items: initialItems,
}: {
  service: Service;
  items: Item[];
}) {
  return (
    <div className="space-y-8">
      <Card className="border border-border bg-card">
        <CardHeader className="pb-4">
          <h2 className="text-lg font-medium text-card-foreground">Editar servicio</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <EditServiceForm service={service} />
          <Separator className="my-4" />
          <form action={deleteService as unknown as VoidFormAction}>
            <input type="hidden" name="serviceId" value={service.id} />
            <Button
              type="submit"
              variant="destructive"
              size="sm"
              className="gap-2"
              aria-label="Eliminar servicio y sus ítems"
            >
              <Trash2 className="size-4" aria-hidden />
              Eliminar servicio y sus ítems
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border border-border bg-card">
        <CardHeader className="pb-4">
          <h2 className="text-lg font-medium text-card-foreground">Añadir ítem</h2>
          <p className="text-sm text-muted-foreground">
            Nombre, precio y tiempo estimado (ej. 2 días, 1 mes).
          </p>
        </CardHeader>
        <CardContent>
          <AddItemForm serviceId={service.id} />
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-lg font-medium text-foreground">Ítems del servicio</h2>
        {initialItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aún no hay ítems. Añade el primero arriba.</p>
        ) : (
          <ul className="space-y-2">
            {initialItems.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-card px-4 py-3"
              >
                <div>
                  <span className="font-medium text-foreground">{item.name}</span>
                  <span className="ml-2 text-sm text-muted-foreground">
                    {formatPrice(item.price)} · {item.estimated_time}
                  </span>
                </div>
                <form action={deleteItem as unknown as VoidFormAction}>
                  <input type="hidden" name="itemId" value={item.id} />
                  <input type="hidden" name="serviceId" value={service.id} />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    aria-label={`Eliminar ítem ${item.name}`}
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </Button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        <Link href="/provider/services" className="underline hover:no-underline">
          ← Volver a Mis Servicios
        </Link>
      </p>
    </div>
  );
}

function EditServiceForm({ service }: { service: Service }) {
  const [state, formAction] = useActionState<ServiceActionResult | null, FormData>(
    (_prev, formData) => updateService(service.id, formData),
    null
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">
          Nombre del Servicio <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          defaultValue={service.name}
          required
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Descripción (opcional)</Label>
        <Textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={service.description}
        />
      </div>
      {state && "error" in state ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button type="submit">Guardar cambios</Button>
    </form>
  );
}

function AddItemForm({ serviceId }: { serviceId: string }) {
  const [state, formAction] = useActionState<ItemActionResult | null, FormData>(
    (_prev, formData) => createItem(serviceId, formData),
    null
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="item-name">
          Nombre del ítem <span className="text-destructive">*</span>
        </Label>
        <Input
          id="item-name"
          name="name"
          type="text"
          placeholder="ej. Diseño Landing Page"
          required
          className="w-full"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="item-price">
            Precio <span className="text-destructive">*</span>
          </Label>
          <Input
            id="item-price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            placeholder="1000"
            required
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="item-time">
            Tiempo estimado <span className="text-destructive">*</span>
          </Label>
          <Input
            id="item-time"
            name="estimated_time"
            type="text"
            placeholder="ej. 2 días, 1 mes"
            required
            className="w-full"
          />
        </div>
      </div>
      {state && "error" in state ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button type="submit">Añadir ítem</Button>
    </form>
  );
}
