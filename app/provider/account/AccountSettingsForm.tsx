"use client";

import { useActionState, useState } from "react";
import type { ProfileActionResult } from "@/app/auth/profile-actions";
import { updateProfile, updatePassword, deleteAccount } from "@/app/auth/profile-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

type AccountSettingsFormProps = {
  initialUsername: string;
  initialEmail: string | null;
  initialAvatarUrl: string | null;
};

function PasswordFields() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordsFilled = newPassword.length > 0 || confirmPassword.length > 0;
  const passwordsMatch = passwordsFilled && newPassword === confirmPassword;
  const passwordsMismatch = passwordsFilled && newPassword !== confirmPassword;

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="new_password">Nueva contraseña</Label>
        <div className="relative">
          <Input
            id="new_password"
            name="new_password"
            type={showNewPassword ? "text" : "password"}
            minLength={10}
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className={cn(
              "pr-10",
              passwordsMismatch && "border-destructive focus-visible:ring-destructive",
              passwordsMatch && "border-emerald-500 focus-visible:ring-emerald-500"
            )}
          />
          <button
            type="button"
            onClick={() => setShowNewPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
            aria-label={showNewPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm_password">Confirmar nueva contraseña</Label>
        <div className="relative">
          <Input
            id="confirm_password"
            name="confirm_password"
            type={showConfirmPassword ? "text" : "password"}
            minLength={10}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className={cn(
              "pr-10",
              passwordsMismatch && "border-destructive focus-visible:ring-destructive",
              passwordsMatch && "border-emerald-500 focus-visible:ring-emerald-500"
            )}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
            aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {passwordsMismatch ? (
        <p className="text-sm text-destructive">Las contraseñas no coinciden.</p>
      ) : null}
      {passwordsMatch ? (
        <p className="text-sm text-emerald-600 dark:text-emerald-400">
          Las contraseñas coinciden.
        </p>
      ) : null}
    </>
  );
}

export function AccountSettingsForm({
  initialUsername,
  initialEmail,
  initialAvatarUrl,
}: AccountSettingsFormProps) {
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [profileState, profileAction] = useActionState<ProfileActionResult | null, FormData>(
    async (_prev, formData) => updateProfile(formData),
    null
  );

  const [passwordState, passwordAction] = useActionState<ProfileActionResult | null, FormData>(
    async (_prev, formData) => updatePassword(formData),
    null
  );

  const [deleteState, deleteAction] = useActionState<ProfileActionResult | null, FormData>(
    async () => deleteAccount(),
    null
  );

  return (
    <div className="admin-index-surface">
      <section className="px-4 py-4 md:px-5 md:py-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          <div className="pb-1 md:w-1/2">
            <div className="space-y-2">
              <h2 className="text-lg font-medium text-card-foreground">Perfil</h2>
              <p className="text-sm text-muted-foreground">
                Actualiza tu nombre de usuario y la imagen de perfil que se mostrará a tus clientes.
              </p>
              <p className="text-xs text-muted-foreground">
                Solo tú podrás ver estos datos en el panel. Tus clientes verán únicamente la información
                pública de tu perfil.
              </p>
            </div>
          </div>
          <div className="md:w-1/2">
            <form action={profileAction} className="space-y-4 md:max-w-sm md:ml-auto">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={initialEmail ?? ""} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Nombre de usuario</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  defaultValue={initialUsername}
                  placeholder="Tu nombre de usuario"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar_url">URL de imagen de perfil</Label>
                <Input
                  id="avatar_url"
                  name="avatar_url"
                  type="url"
                  defaultValue={initialAvatarUrl ?? ""}
                  placeholder="https://..."
                />
                <p className="text-xs text-muted-foreground">
                  Pega aquí la URL de tu imagen de perfil. Más adelante podrás subirla directamente.
                </p>
              </div>
              {profileState && "error" in profileState ? (
                <p className="text-sm text-destructive" role="alert">
                  {profileState.error}
                </p>
              ) : null}
              {profileState && "success" in profileState && profileState.success ? (
                <p className="text-sm text-green-600 dark:text-green-400" role="status">
                  Perfil actualizado correctamente.
                </p>
              ) : null}
              <Button type="submit" className="w-full sm:w-auto">
                Guardar cambios
              </Button>
            </form>
          </div>
        </div>
      </section>

      <section className="border-t border-border/70 px-4 py-4 md:px-5 md:py-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          <div className="pb-1 md:w-1/2">
            <div className="space-y-2">
              <h2 className="text-lg font-medium text-card-foreground">Contraseña</h2>
              <p className="text-sm text-muted-foreground">
                Cambia tu contraseña de acceso. Utiliza una contraseña segura que no uses en otros sitios.
              </p>
              <p className="text-xs text-muted-foreground">
                Te pediremos que vuelvas a iniciar sesión si cambias tu contraseña desde otros dispositivos.
              </p>
            </div>
          </div>
          <div className="md:w-1/2">
            <form action={passwordAction} className="space-y-4 md:max-w-sm md:ml-auto">
              <PasswordFields />
              {passwordState && "error" in passwordState ? (
                <p className="text-sm text-destructive" role="alert">
                  {passwordState.error}
                </p>
              ) : null}
              {passwordState && "success" in passwordState && passwordState.success ? (
                <p className="text-sm text-green-600 dark:text-green-400" role="status">
                  Contraseña actualizada correctamente.
                </p>
              ) : null}
              <Button type="submit" className="w-full sm:w-auto">
                Actualizar contraseña
              </Button>
            </form>
          </div>
        </div>
      </section>

      <section className="border-t border-border/70 px-4 py-4 md:px-5 md:py-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          <div className="pb-1 md:w-1/2">
            <h2 className="text-lg font-medium text-card-foreground">Eliminar cuenta</h2>
            <p className="text-sm text-muted-foreground">
              Eliminar tu cuenta borrará tus datos de proveedor, servicios e ítems asociados y cerrará tu sesión.
            </p>
          </div>
          <div className="md:w-1/2">
            <form action={deleteAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="delete_confirmation">
                  Escribe ELIMINAR para confirmar
                </Label>
                <Input
                  id="delete_confirmation"
                  value={deleteConfirmation}
                  onChange={(event) => setDeleteConfirmation(event.target.value)}
                  placeholder="ELIMINAR"
                  autoComplete="off"
                />
              </div>
              {deleteState && "error" in deleteState ? (
                <p className="text-sm text-destructive" role="alert">
                  {deleteState.error}
                </p>
              ) : null}
              <Button
                type="submit"
                variant="destructive"
                className="w-full sm:w-auto"
                disabled={deleteConfirmation !== "ELIMINAR"}
                onClick={(event) => {
                  if (!window.confirm("Esta acción eliminará tu cuenta y no se puede deshacer.")) {
                    event.preventDefault();
                  }
                }}
              >
                Eliminar mi cuenta
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

