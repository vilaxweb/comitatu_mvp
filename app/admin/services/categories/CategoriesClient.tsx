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
    <div className="space-y-3 pt-14 md:pt-16">
      <UnsavedChangesBar hasUnsavedChanges={dirty} onSave={handleSave} onCancel={handleCancel} />
      <div className="admin-index-surface">
        <div className="admin-index-header hidden sm:grid sm:grid-cols-[minmax(220px,2fr)_minmax(320px,3fr)] sm:gap-3">
          <span>Nombre</span>
          <span>Descripción</span>
        </div>
        <ul className="admin-index-list">
          {categories.map((category) => (
            <li key={category.id} className="px-3 py-2.5 md:px-4 md:py-3 lg:px-5">
              <div className="grid gap-2.5 md:gap-3 sm:grid-cols-[minmax(220px,2fr)_minmax(320px,3fr)] sm:items-center">
                <Input
                  name="name"
                  value={category.name}
                  onChange={(e) => handleFieldChange(category.id, "name", e.target.value)}
                  className="h-8 w-full"
                  aria-label="Nombre de la categoría"
                  required
                />
                <Input
                  name="description"
                  value={category.description ?? ""}
                  onChange={(e) => handleFieldChange(category.id, "description", e.target.value)}
                  placeholder="Descripción (opcional)"
                  aria-label="Descripción de la categoría"
                  className="h-8 w-full"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

