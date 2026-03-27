"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { upsertProviderService, deleteProviderService } from "./actions";

type ProviderServiceFormProps = {
  predefinedServiceId: string;
  initialPrice?: number | null;
  initialDuration?: number | null;
  defaultPrice?: number | null;
  defaultDuration?: number | null;
  onDirtyChange?: (hasUnsaved: boolean, save: () => void) => void;
  compact?: boolean;
};

export function ProviderServiceForm({
  predefinedServiceId,
  initialPrice,
  initialDuration,
  defaultPrice,
  defaultDuration,
  onDirtyChange,
  compact = false,
}: ProviderServiceFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [active, setActive] = useState<boolean>(
    initialPrice != null && initialDuration != null,
  );
  const [price, setPrice] = useState<string>(
    initialPrice != null
      ? String(initialPrice)
      : defaultPrice != null
        ? String(defaultPrice)
        : "",
  );
  const [duration, setDuration] = useState<string>(
    initialDuration != null
      ? String(initialDuration)
      : defaultDuration != null
        ? String(defaultDuration)
        : "",
  );
  const [error, setError] = useState<string | null>(null);

  const saving = isPending;

  const handleSave = () => {
    setError(null);
    const priceNumber = Number(price);
    const durationNumber = Number(duration);
    if (!Number.isFinite(priceNumber) || priceNumber <= 0) {
      setError("Introduce un precio válido mayor que 0.");
      return;
    }
    if (!Number.isInteger(durationNumber) || durationNumber <= 0) {
      setError("Introduce una duración válida en horas (entero mayor que 0).");
      return;
    }

    startTransition(async () => {
      await upsertProviderService({
        predefinedServiceId,
        price: priceNumber,
        duration: durationNumber,
      });
      setActive(true);
      router.refresh();
      onDirtyChange?.(false, handleSave);
    });
  };

  const handleDeactivate = () => {
    setError(null);
    startTransition(async () => {
      await deleteProviderService(predefinedServiceId);
      setActive(false);
      router.refresh();
      onDirtyChange?.(false, handleSave);
    });
  };

  const handleActivate = () => {
    setError(null);
    const nextPrice = price || (defaultPrice != null ? String(defaultPrice) : "0");
    const nextDuration =
      duration || (defaultDuration != null ? String(defaultDuration) : "1");
    const priceNumber = Number(nextPrice);
    const durationNumber = Number(nextDuration);

    if (!Number.isFinite(priceNumber) || priceNumber <= 0) {
      setError("No se pudo activar: precio por defecto inválido.");
      return;
    }
    if (!Number.isInteger(durationNumber) || durationNumber <= 0) {
      setError("No se pudo activar: duración por defecto inválida.");
      return;
    }

    setPrice(nextPrice);
    setDuration(nextDuration);
    startTransition(async () => {
      await upsertProviderService({
        predefinedServiceId,
        price: priceNumber,
        duration: durationNumber,
      });
      setActive(true);
      router.refresh();
      onDirtyChange?.(false, handleSave);
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-end gap-2">
        <div className="space-y-1">
          <Label
            className={compact ? "sr-only" : "text-xs font-medium text-muted-foreground"}
            htmlFor={`price-${predefinedServiceId}`}
          >
            Precio
          </Label>
          <Input
            id={`price-${predefinedServiceId}`}
            type="number"
            min={0}
            step="0.01"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
              onDirtyChange?.(true, handleSave);
            }}
            disabled={!active || saving}
            className="h-8 w-28"
          />
        </div>
        <div className="space-y-1">
          <Label
            className={compact ? "sr-only" : "text-xs font-medium text-muted-foreground"}
            htmlFor={`duration-${predefinedServiceId}`}
          >
            Duración (h)
          </Label>
          <Input
            id={`duration-${predefinedServiceId}`}
            type="number"
            min={0}
            step="1"
            value={duration}
            onChange={(e) => {
              setDuration(e.target.value);
              onDirtyChange?.(true, handleSave);
            }}
            disabled={!active || saving}
            className="h-8 w-28"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className={`relative inline-flex h-6 w-11 items-center rounded-full border px-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
              active ? "bg-emerald-500 border-emerald-600" : "bg-muted border-border"
            }`}
            aria-label={active ? "Desactivar servicio del catálogo" : "Activar servicio del catálogo"}
            aria-pressed={active}
            onClick={() => {
              if (active) {
                if (!saving) {
                  handleDeactivate();
                }
              } else {
                if (!saving) {
                  handleActivate();
                }
              }
            }}
            disabled={saving}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-background shadow-sm transition-transform ${
                active ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>

        </div>
      </div>
      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

