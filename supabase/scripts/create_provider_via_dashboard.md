# Crear usuario proveedor cuando falla "Database error creating new user"

Si el trigger falla al crear desde el Dashboard, hazlo en dos pasos:

## 1. Desactivar el trigger temporalmente

En **SQL Editor** ejecuta:

```sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
```

## 2. Crear el usuario en el Dashboard

- **Authentication** → **Users** → **Add user** → **Create new user**
- Email: el que quieras (ej. `proveedor@ejemplo.com`)
- Password: la que quieras
- Guarda y **copia el User UID**

## 3. Insertar en public.users

En **SQL Editor** (sustituye el UUID y el email):

```sql
INSERT INTO public.users (id, email, password_hash, user_type, created_at, updated_at, username)
VALUES (
  'PEGA_EL_UUID_AQUI',
  'proveedor@ejemplo.com',
  NULL,
  'provider',
  now(),
  now(),
  'proveedor'
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  user_type = EXCLUDED.user_type,
  username = EXCLUDED.username,
  updated_at = now();
```

## 4. Volver a activar el trigger

```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_auth_user();
```

Después podrás iniciar sesión con ese email y contraseña.
