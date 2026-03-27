"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PROVIDER_SECTORS, type ProviderSector } from "@/lib/provider-sectors";

type SectorSelectorProps = {
  name?: string;
  defaultSelected?: ProviderSector[];
  selected?: ProviderSector[];
  onSelectedChange?: (next: ProviderSector[]) => void;
  className?: string;
};

export function SectorSelector({
  name = "sectors",
  defaultSelected = [...PROVIDER_SECTORS],
  selected,
  onSelectedChange,
  className,
}: SectorSelectorProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width: 288,
  });
  const [internalSelected, setInternalSelected] = useState<Set<ProviderSector>>(
    () => new Set(defaultSelected),
  );
  const currentSelected = useMemo(
    () => (selected ? new Set(selected) : internalSelected),
    [selected, internalSelected],
  );

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const updatePosition = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPopupPosition({
        top: rect.bottom + 8,
        left: rect.left,
        width: 288,
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  const label = useMemo(() => {
    if (currentSelected.size === 0) return "Seleccionar sectores";
    if (currentSelected.size === PROVIDER_SECTORS.length) return "Todos los sectores";
    return `${currentSelected.size} sector${currentSelected.size === 1 ? "" : "es"} seleccionado${currentSelected.size === 1 ? "" : "s"}`;
  }, [currentSelected]);

  return (
    <div ref={rootRef} className={className ?? "relative"}>
      <button
        type="button"
        ref={triggerRef}
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground shadow-xs"
        aria-expanded={open}
      >
        <span className="truncate">{label}</span>
        <span className="ml-2 text-muted-foreground">▾</span>
      </button>

      {open ? (
        <div
          className="fixed z-50 rounded-md border border-border bg-popover p-3 shadow-md"
          style={{
            top: popupPosition.top,
            left: popupPosition.left,
            width: popupPosition.width,
          }}
        >
          <p className="mb-2 text-xs font-medium text-muted-foreground">Sectores</p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
            {PROVIDER_SECTORS.map((sector) => (
              <label key={sector} className="flex items-center gap-2 text-xs text-popover-foreground">
                <input
                  type="checkbox"
                  name={name}
                  value={sector}
                  checked={currentSelected.has(sector)}
                  onChange={(event) => {
                    const applyChange = (prev: Set<ProviderSector>) => {
                      const next = new Set(prev);
                      if (event.target.checked) {
                        next.add(sector);
                      } else {
                        next.delete(sector);
                      }
                      return next;
                    };
                    if (selected && onSelectedChange) {
                      const next = applyChange(new Set(selected));
                      onSelectedChange(Array.from(next));
                    } else {
                      setInternalSelected((prev) => {
                        const next = applyChange(prev);
                        return next;
                      });
                    }
                  }}
                />
                {sector}
              </label>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Selecciona uno o más sectores.
          </p>
        </div>
      ) : null}
    </div>
  );
}
