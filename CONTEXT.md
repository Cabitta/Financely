# Financely Domain Context

Financely es una plataforma de gestión financiera familiar orientada a la colaboración en el hogar, donde la atribución por integrante y la rapidez en el registro son los pilares fundamentales.

## Language

### Core Concepts

**Household (Hogar)**:
La unidad organizacional y límite de seguridad principal. Agrupa a todos los integrantes, categorías y transacciones compartidas.
_Avoid_: Family, Group, Organization, Account

**Household Member (Integrante)**:
Un perfil dentro de un Hogar que realiza o registra transacciones. Puede estar asociado a una cuenta de usuario autenticada o ser un perfil administrado.
_Avoid_: User (cuando se refiere al miembro de la familia), Profile, Family Member

**Transaction (Transacción)**:
Un movimiento de dinero registrado dentro de un Hogar, clasificado como Ingreso o Gasto, atribuido explícitamente a un Integrante.
_Avoid_: Movement, Record, Expense (cuando se refiere a ambos tipos)

**Budget (Presupuesto)**:
El límite mensual asignado a una Categoría dentro de un Hogar para controlar el gasto acumulado en dicho período.
_Avoid_: Allocation, Limit, Threshold

**Category (Categoría)**:
La clasificación temática de una Transacción (ej. Supermercado, Servicios, Salud) que define si se le aplica un Presupuesto.
_Avoid_: Tag, Label, Type

**Sync Ledger / Event Delta (Delta de Sincronización)**:
El mecanismo mediante el cual los cambios realizados offline u online en los clientes móviles se transmiten y reconcilian con el servidor Backend.
_Avoid_: Backup, State Dump

## Domain Rules & Boundaries

1. **Atribución Estricta**: Toda Transacción PERTENECE a exactamente 1 Hogar, 1 Categoría y 1 Integrante.
2. **Aislamiento por Hogar**: Ningún integrante de un Hogar puede leer o modificar datos de otro Hogar.
3. **Persistencia Híbrida / Offline-First**: El cliente móvil opera primariamente con estado local (Zustand + AsyncStorage) y sincroniza cambios del delta hacia la API Backend.
