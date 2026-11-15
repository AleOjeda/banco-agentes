# Proyecto Banco Agentes

Aplicación educativa para registrar transferencias bancarias ficticias y administrar sus estados.

No existe integración con bancos reales.
No se deben almacenar credenciales bancarias ni información financiera real.

## Stack

### Backend

- Node.js
- Express
- JavaScript
- Sequelize
- MySQL 8
- Vitest
- Supertest

### Frontend

- React
- Vite
- JavaScript
- Material UI
- React Router
- Axios

### Infraestructura local

- MySQL se ejecuta mediante Docker Compose.
- Backend y frontend se ejecutan localmente con npm.

## Estructura

- `backend/`: API REST.
- `frontend/`: aplicación React.
- `docs/`: requerimientos y decisiones.
- `.claude/agents/`: agentes especializados.

## Arquitectura backend

Usar esta estructura:

- `src/config`: configuración.
- `src/models`: modelos Sequelize.
- `src/controllers`: manejo HTTP.
- `src/services`: reglas de negocio.
- `src/routes`: rutas Express.
- `src/middlewares`: middleware.
- `src/validators`: validaciones.
- `tests`: pruebas automatizadas.

Los controladores deben ser pequeños.

Las reglas de negocio deben estar en servicios.

No colocar consultas directas a Sequelize dentro de las rutas.

## Arquitectura frontend

Usar esta estructura:

- `src/components`: componentes reutilizables.
- `src/pages`: pantallas.
- `src/services`: llamadas a la API.
- `src/hooks`: hooks reutilizables.
- `src/utils`: utilidades.
- `src/constants`: constantes.

## Reglas de código

- Usar JavaScript, no TypeScript.
- Usar módulos ES.
- Usar async/await.
- Usar indentación de 2 espacios.
- Evitar archivos excesivamente grandes.
- No instalar dependencias sin explicar para qué se necesitan.
- Reutilizar patrones ya existentes.
- No alterar archivos ajenos al requerimiento.
- No realizar commits automáticamente.
- No conectarse a entornos externos.
- No ejecutar comandos destructivos.
- No usar `sequelize.sync({ force: true })`.
- Los cambios de base de datos deben hacerse mediante migraciones.
- Nunca incluir secretos dentro del repositorio.

## Reglas funcionales

Los estados válidos de una transferencia son:

- `NUEVA`
- `APROBADA`
- `PAGADA`

Transiciones permitidas:

- `NUEVA` a `APROBADA`
- `APROBADA` a `PAGADA`

No están permitidas:

- Transiciones hacia atrás.
- Pasar directamente de `NUEVA` a `PAGADA`.
- Cambiar una transferencia `PAGADA`.
- Eliminar una transferencia `PAGADA`.

El backend es la autoridad de las reglas de estado.
El frontend no debe ser la única capa de validación.

## Seguridad

- Validar todo dato recibido.
- No confiar en IDs o estados enviados por el frontend.
- No exponer errores internos de MySQL.
- No registrar datos sensibles en logs.
- Limitar el tamaño de los campos de texto.
- El monto debe almacenarse como DECIMAL, nunca FLOAT.
- Las operaciones que cambien estado deben validar el estado actual.

## Comandos esperados

### Base de datos

```bash
docker compose up -d db
docker compose down
```

### Backend

```bash
cd backend
npm install
npm run dev
npm test
npm run lint
```

### Frontend

```bash
cd frontend
npm install
npm run dev
npm run build
npm run lint
```

### Ciclo de desarrollo

Para cada funcionalidad:

Analizar el requerimiento.
Examinar el repositorio.
Diseñar la solución.
Implementar backend.
Implementar frontend.
Ejecutar pruebas y build.
Revisar el diff.
Corregir problemas críticos.
Volver a verificar.
Resumir cambios y pendientes.

### Definition of Done

Una funcionalidad está terminada cuando:

Cumple los criterios de aceptación.
Las reglas se validan en backend.
Las migraciones son reproducibles.
Las pruebas backend pasan.
El frontend compila.
No se introducen errores de lint.
Los estados de carga y error están contemplados.
El diff fue revisado.
Los riesgos y pendientes fueron informados.
