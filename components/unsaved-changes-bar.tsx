"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type UnsavedChangesBarProps = {
  hasUnsavedChanges: boolean;
  onSave: () => void;
  onCancel: () => void;
  className?: string;
  message?: ReactNode;
};

export function UnsavedChangesBar({
  hasUnsavedChanges,
  onSave,
  onCancel,
  className,
  message = "Tienes cambios sin guardar",
}: UnsavedChangesBarProps) {
  return (
    <AnimatePresence>
      {hasUnsavedChanges && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: "easeOut", delay: 0.3 }}
          className={cn(
            // Barra flotante centrada dentro del área de contenido (main)
            "absolute top-4 left-1/2 z-40 flex w-full max-w-xl -translate-x-1/2 flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground shadow-sm",
            className,
          )}
        >
          <span className="font-medium">{message}</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              onClick={onSave}
            >
              Guardar cambios
            </button>
            <button
              type="button"
              className="inline-flex items-center rounded-md border border-border px-4 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted"
              onClick={onCancel}
            >
              Cancelar
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


