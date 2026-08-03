# 💰 Financely

Monorepo de **Financely**, la aplicación de gestión financiera familiar centrada en la rápida atribución de gastos por integrante del hogar.

---

## 🏗️ Estructura del Monorepo

* [📱 **`mobile/`**](mobile/README.md) — Aplicación móvil en React Native con Expo, Zustand y AsyncStorage.
* [🌐 **`api/`**](api/README.md) — Backend API REST en Node.js, Express, Prisma ORM y PostgreSQL con sincronización Delta Offline-First y **Swagger UI**.
* [📖 **`docs/`**](docs/) — Documentación de diseño y arquitectura:
  * [`docs/PRD.md`](docs/PRD.md) — Product Requirement Document.
  * [`docs/backend_spec.md`](docs/backend_spec.md) — Especificación técnica del backend y esquemas de base de datos.
  * [`docs/adr/0001-backend-tech-stack-and-sync.md`](docs/adr/0001-backend-tech-stack-and-sync.md) — Registro de decisión de arquitectura (ADR).
  * [`CONTEXT.md`](CONTEXT.md) — Modelo de dominio y lenguaje ubicuo.

---

## 🚀 Inicio Rápido (Backend API)

Para ejecutar y probar el backend de forma local:

```bash
# 1. Ir a la carpeta api
cd api

# 2. Levantar la base de datos PostgreSQL con Docker
docker compose up -d

# 3. Correr las migraciones de base de datos
npx prisma migrate dev --name init

# 4. Iniciar la API en modo desarrollo
npm run dev
```

Abre en tu navegador la documentación interactiva de Swagger UI en **[http://localhost:4000/docs](http://localhost:4000/docs)**.

Consulta [`api/README.md`](api/README.md) para más detalles.
