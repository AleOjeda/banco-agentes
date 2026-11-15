# Banco Agentes

Aplicación educativa para registrar transferencias bancarias ficticias y administrar sus estados (`NUEVA`, `APROBADA`, `PAGADA`).

No existe integración con bancos reales. No se almacenan credenciales bancarias ni información financiera real.

## Stack

- **Backend**: Node.js, Express, Sequelize, MySQL 8, Vitest, Supertest.
- **Frontend**: React, Vite, Material UI, React Router, Axios.
- **Infraestructura local**: MySQL vía Docker Compose. Backend y frontend se ejecutan localmente con npm.

## Configuración del entorno

1. Copiar el archivo de variables de entorno de ejemplo en la raíz del proyecto:

   ```bash
   cp .env.example .env
   ```

2. Ajustar los valores en `.env` según sea necesario (usuario, contraseñas locales, puertos). El mismo archivo `.env` es utilizado por `docker-compose.yml` (credenciales de MySQL) y por el backend (conexión a la base de datos, puerto del servidor y origen permitido de CORS).

## Base de datos (Docker Compose)

Levantar únicamente el servicio de MySQL:

```bash
docker compose up -d db
```

Detener el contenedor:

```bash
docker compose down
```

Los datos se persisten en un volumen Docker nombrado, por lo que no se pierden al detener el contenedor (sí se pierden si se ejecuta `docker compose down -v`).

## Backend

```bash
cd backend
npm install
npm run dev
```

El servidor queda disponible en `http://localhost:<PORT>` (por defecto `3001`, configurable en `.env`). Endpoint de verificación:

```
GET /api/health
```

### Pruebas

```bash
cd backend
npm test
```

### Lint

```bash
cd backend
npm run lint
```

## Frontend

Aplicación React (Vite) con Material UI, React Router y Axios.

### Configuración del entorno

Copiar el archivo de variables de entorno de ejemplo dentro de `frontend/`:

```bash
cd frontend
cp .env.example .env
```

`VITE_API_URL` debe apuntar a la URL base de la API del backend (incluyendo el prefijo `/api`), por ejemplo `http://localhost:3001/api`. Si no se define, la aplicación usa ese mismo valor como fallback en desarrollo.

### Instalación y ejecución

```bash
cd frontend
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173` (puerto por defecto de Vite, coincide con `CORS_ORIGIN` configurado en el backend).

### Build de producción

```bash
cd frontend
npm run build
```

### Lint

```bash
cd frontend
npm run lint
```
