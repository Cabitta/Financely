# 📐 Plan de Diseño y Arquitectura — Financely

> **Documento de Arquitectura y Especificación Técnica**

---

## 1. Estructura General del Proyecto (Monorepo Estructurado)

```
Financely/
├── api/             # Backend / Servicios API
│   ├── package.json
│   ├── index.js     # Punto de entrada de la API
│   └── README.md
├── mobile/          # Aplicación Móvil (React Native + Expo)
│   ├── App.js       # Interfaz principal (iOS Minimalist UI)
│   ├── store.js     # Estado global (Zustand + AsyncStorage)
│   └── package.json
├── docs/            # Documentación general del proyecto
│   ├── PRD.md       # Product Requirement Document
│   └── architecture_plan.md
├── .gitignore       # Reglas de git raíz
└── README.md        # Documentación principal del repositorio
```

---

## 2. Modelo de Dominio en Mobile (`mobile/store.js`)

* **`Member`**: Integrante de la familia (`id`, `name`, `avatar`, `color`).
* **`Category`**: Categoría de gasto o ingreso (`id`, `name`, `icon`, `type`, `budgetLimit`, `color`).
* **`Transaction`**: Movimiento (`id`, `amount`, `type`, `categoryId`, `memberId`, `date`, `note`).

---

## 3. Integración Futura con `api/`

La carpeta `api/` servirá como backend Node.js / Express para sincronizar transacciones entre múltiples dispositivos familiares mediante WebSockets / REST API en versiones posteriores.
