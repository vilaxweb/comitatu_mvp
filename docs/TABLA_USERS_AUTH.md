# Tabla `users` y autenticación

## Campos de la tabla `users`

| Campo         | Origen / Uso |
|--------------|---------------|
| **id**       | UUID de Supabase Auth (`auth.users.id`). Lo rellena el trigger. |
| **email**     | Del formulario de registro; se guarda también en Auth. Lo rellena el trigger. |
| **password_hash** | No se usa desde la app. Supabase Auth guarda el hash en `auth.users`. Dejar **NULL** en esta tabla. |
| **user_type**| Tipo de usuario: `'customer'`, `'provider'` o `'admin'`. Se rellena desde `raw_user_meta_data.user_type` o por defecto `'customer'`. |
| **status**   | Estado del usuario: `'active'` o `'inactive'`. Se rellena desde `raw_user_meta_data.status` o por defecto `'active'`. |
| **created_at** | Rellenado por el trigger con `now()`. |
| **updated_at** | Rellenado por el trigger con `now()`. |
| **username** | Del formulario de registro; se envía en `user_metadata` y el trigger lo guarda aquí. |

## Cómo se rellenan

1. **Registro**: el usuario introduce **username**, **email** y **contraseña** en `/auth/register`.
2. La app llama a `supabase.auth.signUp({ email, password, options: { data: { username, user_type } } })`. Para admins, además se puede pasar `status`.
3. Supabase crea el usuario en `auth.users` (el hash de la contraseña queda solo ahí).
4. El **trigger** `on_auth_user_created` inserta una fila en `public.users` con `id`, `email`, `username`, `user_type`, `status`, `created_at` y `updated_at`.

## Aplicar el trigger en Supabase

1. **Hacer nullable `password_hash`** (si en tu tabla es NOT NULL):
   - Ejecuta antes: `supabase/migrations/20250305000001_users_password_hash_nullable.sql`
2. Dashboard de Supabase → **SQL Editor**.
3. Ejecuta: `supabase/migrations/20250305000000_handle_new_auth_user.sql`

Si sigue saliendo "Database error saving new user", revisa en **Logs → Postgres** el error exacto (constraint, RLS, etc.).

Si tu tabla `users` tiene restricción `UNIQUE` en `username`, el trigger no la comprueba; si quieres evitar duplicados, añade esa restricción y maneja el error en la app (por ejemplo, “nombre de usuario ya existe”).
