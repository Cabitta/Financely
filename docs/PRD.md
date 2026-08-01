# 📄 PRD — Financely (App de Finanzas Familiares)

> **Estado**: Borrador Actualizado  
> **Framework de diseño**: Inspired by `refoundai/lenny-skills@writing-prds` (Lenny's 1-Pager & Problem-First PRD)

---

## 1. Problema Central

Gestionar las finanzas del hogar entre múltiples integrantes suele ser caótico y poco transparente. Las aplicaciones tradicionales de presupuesto asumen el control de un usuario único o cuentas compartidas genéricas, lo que dificulta responder a dos preguntas fundamentales:
1. **¿A dónde se va el dinero del hogar mes a mes según la categoría?**
2. **¿Quién dentro de la familia realizó exactamente cada gasto o ingreso?**

**Financely** resuelve esto ofreciendo un registro ultrarrápido y enfocado en la **atribución familiar por integrante**, garantizando claridad sin sobrecargar al usuario.

---

## 2. Usuarios Objetivos

* **Integrantes de la Familia**: Necesitan registrar un gasto e ingreso en menos de 10 segundos desde su teléfono móvil.
* **Administrador del Hogar / Presupuesto**: Requiere un tablero consolidado para visualizar el estado del presupuesto mensual, el gasto por categoría y el desglose por integrante.

---

## 3. Métrica de Éxito (Success Metrics)

* **Tiempo de Registro**: `< 10 segundos` para crear una transacción completa.
* **Atribución 100%**: Toda transacción debe estar vinculada a un integrante de la familia.
* **Visibilidad del Presupuesto**: Indicador visual claro en tiempo real de cuánto presupuesto queda en cada categoría antes de fin de mes.

---

## 4. Alcance y Alcance Limitado (Scope & Boundaries)

### 🟢 En Alcance (MVP - Versión 1.0)
* **Gestión de Integrantes**: Crear y editar los perfiles de la familia (ej: Papá, Mamá, Hijo 1).
* **Registro de Transacciones**: Formulario ágil para *Ingresos* y *Gastos* (Monto, Categoría, Fecha, Nota e Integrante).
* **Presupuestos por Categoría**: Definir límites mensuales por categoría (ej. Supermercado, Servicios, Salidas) con barras de progreso.
* **Tablero Principal (Dashboard)**:
  * Resumen general: Total Ingresos vs Total Gastos vs Saldo Neto.
  * Desglose por Integrante ("¿Quién gastó qué?").
  * Desglose por Categoría.
* **Persistencia Local (AsyncStorage)**: Zustand con middleware `persist` (`@react-native-async-storage/async-storage`) para persistencia local ultrarrápida.
* **Frontend Mobile**: Construido en **JavaScript (JS)** con React Native + Expo (`mobile/App.js`, `mobile/store.js`).
* **Estilos**: Sistema de Diseño iOS / Apple Minimalist.

---

## 5. Arquitectura del Proyecto

```
Financely/
├── api/             # API / Backend (Node.js / Express / futuro sync)
├── mobile/          # Aplicación móvil Expo / React Native
└── docs/            # Documentación del proyecto (PRD, arquitectura, guías)
```
