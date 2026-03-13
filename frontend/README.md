# Theme Customizer Frontend

Frontend en React + Vite para personalizacion de temas con autenticacion.

## Requisitos

- Node.js 18+
- Backend corriendo en http://localhost:4000

## Configuracion

1. Crear archivo de entorno:

```bash
cp .env.example .env
```

2. Instalar dependencias:

```bash
npm install
```

3. Ejecutar en desarrollo:

```bash
npm run dev
```

## Flujo de autenticacion

- Registro: /register
- Login: /login
- Dashboard: /dashboard (protegido)
- Admin: /admin (solo rol admin)

La sesion usa cookie HttpOnly para refresh token y access token en memoria de la app.