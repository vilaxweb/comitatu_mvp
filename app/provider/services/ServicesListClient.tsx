"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronDown, ChevronRight, Pencil, Trash2, Check, X } from "lucide-react";
import { deleteService, deleteItem, updateItem } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type ServiceWithItems = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  items: { id: string; name: string; price: string; estimated_time: string }[];
};

function formatPrice(price: string): string {
  const n = Number(price);
  if (Number.isNaN(n)) return price;
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(n);
}

type Item = { id: string; name: string; price: string; estimated_time: string };

function ItemRow({
  item,
  serviceId,
  isEditing,
  onStartEdit,
  onSave,
  onCancel,
}: {
  item: Item;
  serviceId: string;
  isEditing: boolean;
  onStartEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [error, setError] = useState<string | null>(null);

  if (isEditing) {
    return (
      <TableRow className="bg-muted/30">
        <TableCell colSpan={4} className="p-2">
          <form
            className="flex flex-wrap items-end gap-2"
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              const form = e.currentTarget;
              const formData = new FormData(form);
              formData.set("itemId", item.id);
              formData.set("serviceId", serviceId);
              const result = await updateItem(formData);
              if ("error" in result) {
                setError(result.error);
                return;
              }
              onSave();
            }}
          >
            <input type="hidden" name="itemId" value={item.id} />
            <input type="hidden" name="serviceId" value={serviceId} />
            <div className="flex flex-col gap-1">
              <label htmlFor={`item-name-${item.id}`} className="text-xs font-medium text-muted-foreground">
                Nombre
              </label>
              <Input
                id={`item-name-${item.id}`}
                name="name"
                defaultValue={item.name}
                required
                className="h-8 w-full min-w-[140px]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor={`item-price-${item.id}`} className="text-xs font-medium text-muted-foreground">
                Precio
              </label>
              <Input
                id={`item-price-${item.id}`}
                name="price"
                type="number"
                step="0.01"
                min={0}
                defaultValue={item.price}
                required
                className="h-8 w-24"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor={`item-time-${item.id}`} className="text-xs font-medium text-muted-foreground">
                Tiempo
              </label>
              <Input
                id={`item-time-${item.id}`}
                name="estimated_time"
                defaultValue={item.estimated_time}
                placeholder="ej. 2 días"
                required
                className="h-8 w-28"
              />
            </div>
            <div className="flex gap-1">
              <Button type="submit" size="sm" className="h-8 gap-1" aria-label="Guardar">
                <Check className="size-4" aria-hidden />
                Guardar
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-8 gap-1"
                onClick={() => { setError(null); onCancel(); }}
                aria-label="Cancelar"
              >
                <X className="size-4" aria-hidden />
                Cancelar
              </Button>
            </div>
            {error && (
              <p className="w-full text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
          </form>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell className="font-medium">{item.name}</TableCell>
      <TableCell className="text-right tabular-nums">
        {formatPrice(item.price)}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {item.estimated_time}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={onStartEdit}
            aria-label={`Editar ítem ${item.name}`}
          >
            <Pencil className="size-4" aria-hidden />
          </Button>
          <form action={deleteItem} className="inline">
            <input type="hidden" name="itemId" value={item.id} />
            <input type="hidden" name="serviceId" value={serviceId} />
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
        </div>
      </TableCell>
    </TableRow>
  );
}

export function ServicesListClient({ services }: { services: ServiceWithItems[] }) {
  return (
    <ul className="space-y-2">
      {services.map((service) => (
        <ExpandableServiceCard key={service.id} service={service} />
      ))}
    </ul>
  );
}

function ExpandableServiceCard({ service }: { service: ServiceWithItems }) {
  const [open, setOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const hasItems = service.items?.length > 0;
  const router = useRouter();

  return (
    <li className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors"
        aria-expanded={open}
      >
        <span className="flex shrink-0 text-muted-foreground" aria-hidden>
          {open ? (
            <ChevronDown className="size-5" />
          ) : (
            <ChevronRight className="size-5" />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-medium text-foreground">{service.name}</h2>
          {service.description ? (
            <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
              {service.description}
            </p>
          ) : null}
          <p className="mt-1 text-xs text-muted-foreground">
            {hasItems ? `${service.items.length} ítem(s)` : "Sin ítems"}
          </p>
        </div>
      </button>

      <div
        className={cn(
          "border-t border-border bg-muted/30 transition-all",
          open ? "visible" : "hidden"
        )}
      >
        <div className="p-4 space-y-4">
          {hasItems ? (
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Nombre</TableHead>
                    <TableHead className="text-right">Precio</TableHead>
                    <TableHead>Tiempo estimado</TableHead>
                    <TableHead className="w-24 text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {service.items.map((item) => (
                    <ItemRow
                      key={item.id}
                      item={item}
                      serviceId={service.id}
                      isEditing={editingItemId === item.id}
                      onStartEdit={() => setEditingItemId(item.id)}
                      onSave={() => {
                        setEditingItemId(null);
                        router.refresh();
                      }}
                      onCancel={() => setEditingItemId(null)}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-2">
              Aún no hay ítems. Añade el primero desde el detalle del servicio.
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <Link href={`/provider/services/${service.id}`}>
                <Pencil className="size-4" aria-hidden />
                Editar servicio
              </Link>
            </Button>
            <form action={deleteService} className="inline">
              <input type="hidden" name="serviceId" value={service.id} />
              <Button
                type="submit"
                variant="destructive"
                size="sm"
                className="gap-2"
                aria-label="Eliminar servicio"
              >
                <Trash2 className="size-4" aria-hidden />
                Eliminar servicio
              </Button>
            </form>
          </div>
        </div>
      </div>
    </li>
  );
}
