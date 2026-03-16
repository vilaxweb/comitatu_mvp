"use client";

import { useState } from "react";
import type { ServiceCategory } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UnsavedChangesBar } from "@/components/unsaved-changes-bar";

type CategoriesClientProps = {
  initialCategories: ServiceCategory[];
  onSave: (categories: ServiceCategory[]) => Promise<void>;
};

export function CategoriesClient({ initialCategories, onSave }: CategoriesClientProps) {
  const [categories, setCategories] = useState<ServiceCategory[]>(initialCategories);
  const [dirty, setDirty] = useState(false);

  const handleFieldChange = (id: string, field: "name" | "description", value: string) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, [field]: value } : cat)),
    );
    setDirty(true);
  };

  const handleSave = async () => {
    await onSave(categories);
    setDirty(false);
  };

  const handleCancel = () => {
    setCategories(initialCategories);
    setDirty(false);
  };

  return (
    <div className="space-y-3 pt-16">
      <UnsavedChangesBar hasUnsavedChanges={dirty} onSave={handleSave} onCancel={handleCancel} />
      <ul className="space-y-2">
        {categories.map((category) => (
          <li
            key={category.id}
            className="flex flex-col gap-2 rounded-lg border border-border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <Input
                name="name"
                value={category.name}
                onChange={(e) => handleFieldChange(category.id, "name", e.target.value)}
                className="sm:max-w-xs"
                aria-label="Nombre de la categoría"
                required
              />
              <Input
                name="description"
                value={category.description ?? ""}
                onChange={(e) => handleFieldChange(category.id, "description", e.target.value)}
                placeholder="Descripción (opcional)"
                aria-label="Descripción de la categoría"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

