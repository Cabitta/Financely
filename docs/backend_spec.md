# 🛠️ Especificación de Requerimientos Backend — Financely (`api/`)

> **Estado**: Aprobado y Definido  
> **Tecnologías**: Node.js, Express, Prisma ORM, PostgreSQL, JWT Authentication.

---

## 1. Visión General de la Arquitectura Backend

El backend de Financely reside en la carpeta `api/` dentro del monorepo. Su propósito es actuar como la **fuente de la verdad** y el motor de **sincronización entre dispositivos móviles del mismo hogar**.

```
mobile/ (React Native + Zustand + AsyncStorage) 
   │
   ├─► [Operación Local Inmediata] (<10ms)
   │
   └─► [Sincronización Delta /api/sync] (vía REST / HTTPS)
            │
            ▼
      api/ (Express + Prisma ORM)
            │
            ▼
      PostgreSQL Database
```

---

## 2. Modelo de Datos y Esquema Prisma (`prisma/schema.prisma`)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum TransactionType {
  EXPENSE
  INCOME
}

enum CategoryType {
  EXPENSE
  INCOME
}

model User {
  id           String      @id @default(uuid())
  email        String      @unique
  passwordHash String
  name         String
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
  households   HouseholdMemberUser[]
}

model Household {
  id          String            @id @default(uuid())
  name        String
  inviteCode  String            @unique
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt
  members     HouseholdMember[]
  categories  Category[]
  transactions Transaction[]
  users       HouseholdMemberUser[]
}

model HouseholdMemberUser {
  userId      String
  householdId String
  role        String            @default("MEMBER") // ADMIN | MEMBER
  user        User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  household   Household         @relation(fields: [householdId], references: [id], onDelete: Cascade)

  @@id([userId, householdId])
}

model HouseholdMember {
  id           String        @id @default(uuid())
  householdId  String
  name         String
  avatar       String?
  color        String?
  isDeleted    Boolean       @default(false)
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  household    Household     @relation(fields: [householdId], references: [id], onDelete: Cascade)
  transactions Transaction[]
}

model Category {
  id           String        @id @default(uuid())
  householdId  String
  name         String
  icon         String
  type         CategoryType  @default(EXPENSE)
  budgetLimit  Float?        @default(0)
  color        String?
  isDeleted    Boolean       @default(false)
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  household    Household     @relation(fields: [householdId], references: [id], onDelete: Cascade)
  transactions Transaction[]
}

model Transaction {
  id          String          @id @default(uuid())
  householdId String
  amount      Float
  type        TransactionType @default(EXPENSE)
  categoryId  String
  memberId    String
  date        DateTime
  note        String?
  isDeleted   Boolean         @default(false)
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt

  household   Household       @relation(fields: [householdId], references: [id], onDelete: Cascade)
  category    Category        @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  member      HouseholdMember @relation(fields: [memberId], references: [id], onDelete: Cascade)
}
```

---

## 3. Autenticación y Flujo de Invitación por Hogar

1. **Registro / Inicio de Sesión**:
   * `POST /api/auth/register`: Registro de usuario principal (Email, Contraseña, Nombre).
   * `POST /api/auth/login`: Retorna un Token JWT firmado.
2. **Creación o Unión a un Hogar**:
   * `POST /api/households`: Crea un nuevo Hogar (ej. "Familia Pérez") y genera un `inviteCode` de 6 caracteres alfanuméricos.
   * `POST /api/households/join`: Permite a otro familiar unirse al Hogar introduciendo el `inviteCode`.

---

## 4. Endpoints de la API REST

### Auth & User
* `POST /api/auth/register` — Registrar usuario.
* `POST /api/auth/login` — Autenticarse y recibir Token JWT.
* `GET /api/auth/me` — Perfil del usuario autenticado y sus hogares.

### Household & Management
* `POST /api/households` — Crear un Hogar.
* `POST /api/households/join` — Unirse con código de invitación.
* `GET /api/households/:id/summary` — Resumen consolidado (Total Ingresos vs Gastos vs Presupuestos).

### Sincronización Delta (Offline-First Protocol)
* `POST /api/sync`
  * **Header**: `Authorization: Bearer <JWT_TOKEN>`
  * **Body Payload**:
    ```json
    {
      "householdId": "uuid-hogar",
      "lastSyncedAt": "2026-08-01T00:00:00.000Z",
      "changes": {
        "members": [ ... ],
        "categories": [ ... ],
        "transactions": [ ... ]
      }
    }
    ```
  * **Response**:
    ```json
    {
      "syncedAt": "2026-08-02T23:45:00.000Z",
      "updates": {
        "members": [ ... ],
        "categories": [ ... ],
        "transactions": [ ... ]
      }
    }
    ```
  * **Estrategia de resolución**: *Last-Write-Wins* basada en `updatedAt`. Si un registro fue eliminado en el móvil, se marca `isDeleted = true` (Soft Delete) para propagar la eliminación a los demás dispositivos.

---

## 5. Estructura Proyectada para la Carpeta `api/`

```
api/
├── prisma/
│   ├── schema.prisma      # Modelo de base de datos
│   └── migrations/        # Historial de migraciones SQL
├── src/
│   ├── config/            # Variables de entorno (db, jwt secret, port)
│   ├── middlewares/       # Auth JWT middleware, error handler
│   ├── controllers/       # Auth, Household, Sync controllers
│   ├── services/          # Lógica de negocio y consultas Prisma
│   ├── routes/            # Definición de rutas Express
│   └── app.js             # Configuración de Express
├── index.js               # Punto de entrada del servidor (puerto 3000/4000)
├── .env.example
└── package.json
```

---

## 6. Siguientes Pasos de Implementación

1. Inicializar la estructura `api/` e instalar dependencias (`express`, `@prisma/client`, `prisma`, `jsonwebtoken`, `bcryptjs`, `cors`).
2. Configurar la base de datos PostgreSQL local/Docker y ejecutar `npx prisma migrate dev`.
3. Conectar el almacén Zustand de la app móvil (`mobile/store.js`) con el endpoint `/api/sync`.
