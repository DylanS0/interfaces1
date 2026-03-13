# Backend - Theme Customizer

API de autenticacion con Node.js, Express y PostgreSQL.

## Requisitos

- Node.js 18+
- PostgreSQL 14+

## Configuracion

1. Copiar variables de entorno:

```bash
cp .env.example .env
```

2. Editar .env y asegurar estos valores:

- DB_USER=postgres
- DB_PORT=5432
- DB_PASSWORD=1234

3. Crear la base de datos si no existe:

```sql
CREATE DATABASE theme_customizer;
```

4. Ejecutar SQL manual en tu cliente de PostgreSQL:

- sql/schema.sql
- sql/seed.sql

## Ejecutar

```bash
npm run dev
```

API base: http://localhost:4000

## Endpoints

- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh
- POST /api/auth/logout
- GET /api/auth/me
- GET /api/admin/ping (requiere rol admin)
