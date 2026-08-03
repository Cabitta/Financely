# 🌐 Financely API

Backend API para la sincronización y gestión centralizada de finanzas familiares en **Financely**. Construido con Node.js, Express, Prisma ORM, PostgreSQL y Swagger UI.

---

## 🚀 Guía de Ejecución Local y Pruebas

### 1. Requisitos Previos
* Node.js (v18+)
* Docker y Docker Desktop (Recomendado para la base de datos PostgreSQL)

---

### 2. Configuración Paso a Paso

#### Paso 1: Levantar la Base de Datos PostgreSQL con Docker
En la carpeta `api/`, ejecuta:
```bash
docker compose up -d
```
> Esto iniciará un contenedor PostgreSQL en `localhost:5432` con la base de datos `financely_db`.

#### Paso 2: Configurar Variables de Entorno
Copia el archivo `.env.example` a `.env` (si aún no existe):
```bash
cp .env.example .env
```

#### Paso 3: Ejecutar Migraciones de Prisma
Genera las tablas de la base de datos basándote en el esquema de Prisma:
```bash
npx prisma migrate dev --name init
```

#### Paso 4: Iniciar el Servidor en Modo Desarrollo
```bash
npm run dev
```
> El servidor se iniciará en `http://localhost:4000`.

---

## 📚 Documentación Interactiva (Swagger UI)

Una vez iniciado el servidor, abre en tu navegador:
* **Swagger UI (Interactiva)**: [http://localhost:4000/docs](http://localhost:4000/docs)
* **Especificación OpenAPI (JSON)**: [http://localhost:4000/swagger.json](http://localhost:4000/swagger.json)
* **Verificación de Salud (Health Check)**: [http://localhost:4000/health](http://localhost:4000/health)

---

## 📂 Estructura del Proyecto `api/`

```
api/
├── docker-compose.yml     # Configuración local de PostgreSQL
├── prisma/
│   └── schema.prisma      # Modelos relacionales de Prisma
├── src/
│   ├── config/
│   │   ├── index.js       # Variables de entorno
│   │   └── swaggerSpec.js # Especificación OpenAPI 3.0
│   ├── controllers/       # Lógica de Auth, Hogares y Sync
│   ├── middlewares/       # Middleware JWT
│   ├── routes/            # Rutas de Express
│   ├── app.js             # Configuración del servidor Express
│   └── prisma.js          # Cliente Prisma (Singleton)
├── index.js               # Punto de entrada principal (puerto 4000)
├── package.json
└── README.md
```
