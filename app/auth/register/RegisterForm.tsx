"use client";

import { useActionState } from "react";
import { useState } from "react";
import { register, type AuthResult } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROVIDER_SECTORS } from "@/lib/provider-sectors";

export function RegisterForm() {
  const [userType, setUserType] = useState("customer");
  const [state, formAction] = useActionState<AuthResult | null, FormData>(
    async (_prev, formData) => register(formData),
    null
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Nombre de usuario</Label>
        <Input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          placeholder="nombre_usuario"
          required
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="tu@correo.com"
          required
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="user_type">Tipo de cuenta</Label>
        <Select
          name="user_type"
          defaultValue="customer"
          required
          onValueChange={setUserType}
        >
          <SelectTrigger id="user_type" className="w-full">
            <SelectValue placeholder="Selecciona un tipo de cuenta" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="customer">Cliente</SelectItem>
            <SelectItem value="provider">Proveedor</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {userType === "provider" ? (
        <div className="space-y-2">
          <Label htmlFor="provider_sector">Sector del proveedor</Label>
          <select
            id="provider_sector"
            name="provider_sector"
            defaultValue=""
            required
            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground shadow-xs"
          >
            <option value="" disabled>
              Selecciona un sector
            </option>
            {PROVIDER_SECTORS.map((sector) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </select>
        </div>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña (mín. 10, con mayúscula, minúscula y número)</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={10}
          required
          className="w-full"
        />
      </div>
      {state && "error" in state ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" className="w-full">
        Registrar
      </Button>
    </form>
  );
}
