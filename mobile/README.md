# Financely Mobile App

Aplicación móvil ligera y reactiva para la gestión de finanzas familiares con atribución por integrante y control de presupuestos en tiempo real.

> [!NOTE]
> Este módulo contiene la interfaz móvil de **Financely** construida con **React Native** y **Expo**, diseñada con la estética minimalista de iOS para ofrecer un registro de transacciones en menos de 10 segundos.

---

## 🚀 Características Principales

* **👥 Atribución Familiar por Integrante**: Identifica al instante quién realizó cada gasto o ingreso en el hogar con perfiles, avatares y colores personalizados.
* **🎯 Presupuestos por Categoría**: Asigna límites mensuales a categorías clave (Supermercado, Servicios, Ocio, etc.) con barras de progreso e indicadores de alerta (Normal, Advertencia >80%, Excedido >100%).
* **📊 Dashboard Consolidado**: Resumen financiero en tiempo real con balance neto disponible, total de ingresos y total de gastos.
* **📜 Historial y Búsqueda Inteligente**: Filtrado rápido por integrante y buscador en tiempo real por notas o categorías.
* **⚡ Persistencia Local Ultra-rápida**: Almacenamiento local mediante Zustand y AsyncStorage para funcionamiento continuo sin conexión a internet.
* **🎨 Diseño iOS Minimalista**: Componentes optimizados, controles segmentados, sombras de profundidad y modales tipo bottom sheet.

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
| :--- | :--- | :--- |
| **React Native** | `0.85.3` | Framework móvil multiplataforma |
| **Expo** | `~56.0.18` | Toolchain y entorno de ejecución nativo |
| **Zustand** | `^5.0.14` | Gestión de estado global ligera |
| **AsyncStorage** | `^3.1.1` | Persistencia de datos en almacenamiento local |

---

## 📂 Estructura del Módulo

```text
mobile/
├── assets/            # Iconos, splash screen y recursos gráficos
├── App.js             # Componente principal e interfaz de usuario (Dashboard, Filtros, Modales)
├── store.js           # Store global de Zustand con selectores y persistencia local
├── app.json           # Configuración del proyecto Expo
├── index.js           # Punto de entrada de la aplicación
└── package.json       # Dependencias y scripts de ejecución
```

---

## 📋 Requisitos Previos

Asegúrate de contar con el siguiente entorno configurado:

* **Node.js** v18.0 o superior
* **npm** v9.0 o superior
* **Expo Go** instalado en un dispositivo físico (iOS / Android) o un **Simulador iOS / Emulador Android**.

---

## 📦 Instalación y Ejecución

1. **Navega al directorio de la aplicación móvil**:
   ```bash
   cd mobile
   ```

2. **Instala las dependencias del proyecto**:
   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo de Expo**:
   ```bash
   npm start
   ```

4. **Opciones de inicio rápido**:
   * Para iOS (Simulador): `npm run ios`
   * Para Android (Emulador): `npm run android`
   * Para Web (Navegador): `npm run web`

> [!TIP]
> Escanea el código QR generado en la terminal utilizando la cámara de tu iPhone o la app **Expo Go** en Android para probar la aplicación directamente en tu teléfono.

---

## 🧠 Arquitectura de Datos (`store.js`)

El estado de la aplicación se gestiona de forma reactiva con los siguientes modelos principales:

```typescript
// Integrante de la familia
interface Member {
  id: string;
  name: string;
  avatar: string;
  color: string;
}

// Categoría y Límite de Presupuesto
interface Category {
  id: string;
  name: string;
  icon: string;
  type: 'EXPENSE' | 'INCOME';
  budgetLimit: number;
  color: string;
}

// Transacción o Movimiento
interface Transaction {
  id: string;
  amount: number;
  type: 'EXPENSE' | 'INCOME';
  categoryId: string;
  memberId: string;
  note?: string;
  date: string;
}
```

> [!IMPORTANT]
> Los datos se guardan de forma automática en la memoria del dispositivo bajo la clave `financely-storage-v2`. Al cerrar o reiniciar la aplicación, el saldo y las transacciones se mantienen intactos.
