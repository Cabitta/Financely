# 0001. Arquitectura de Backend: Express, Prisma, PostgreSQL y Sincronización REST

## Contexto y Decisión

Financely requiere un backend en `api/` para sincronizar transacciones entre múltiples integrantes del hogar. Se evaluaron varias opciones de arquitectura y complejidad. Se decidió implementar una API REST con **Node.js, Express, Prisma ORM y PostgreSQL**, utilizando un modelo de autenticación basado en **JWT** y **Códigos de Invitación por Hogar**, combinado con una estrategia de **Sincronización Delta por timestamp (Last-Write-Wins)**.

## Razones de la Decisión

1. **Balance de Complejidad**: Proporciona una arquitectura limpia, modular y fácil de mantener sin la sobrecarga de WebSockets ni la dependencia de servicios propietarios de terceros.
2. **Modelo Offline-First Integrado**: La app móvil (`mobile/`) continúa respondiendo instantáneamente usando AsyncStorage + Zustand, enviando y recibiendo deltas a través del endpoint `/api/sync`.
3. **Control Total del Modelo de Datos**: Prisma ORM sobre PostgreSQL garantiza migraciones seguras y consultas fuertemente tipadas y relacionales para Hogares, Integrantes, Categorías y Transacciones.
