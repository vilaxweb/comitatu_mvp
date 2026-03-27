# Comitatu MVP

Marketplace MVP con dos paneles principales:
- `admin`: gestión de usuarios, categorías y servicios predefinidos.
- `provider`: gestión de perfil, datos fiscales y catálogo de servicios.

Stack principal: Next.js App Router + Supabase (Auth + Postgres + RLS).

## Requisitos

- Node.js 20+
- npm 10+
- Proyecto Supabase con las variables de entorno configuradas

## Variables de entorno

Configura al menos:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` (URL pública canónica, usada en recuperación de contraseña)

## Desarrollo local

```bash
npm ci
npm run dev
```

## Calidad y pruebas

```bash
npm run lint
npm run typecheck
npm run build
npm run test:smoke
```

## Deploy checklist (mínimo)

1. Ejecutar migraciones SQL pendientes en Supabase.
2. Validar login, recovery y reset password en entorno de staging.
3. Validar flujo provider: completar perfil, activar servicio y guardar catálogo.
4. Validar flujo admin: alta usuario, edición de estado y edición de catálogo.
5. Verificar que CI (`lint`, `typecheck`, `build`, `test:smoke`) está en verde.

## Rollback básico

1. Revertir despliegue de aplicación al build anterior estable.
2. Si una migración rompe datos, aplicar migración correctiva explícita (no editar migraciones ya aplicadas).
3. Verificar acceso de usuarios críticos (admin y provider) tras rollback.
