# Multi-Tenant SaaS - Academias e Institutos

Este es un proyecto de software como servicio (SaaS) diseñado para la gestión de múltiples academias e institutos bajo una arquitectura **Multi-tenant**.

## 🚀 Tecnologías Principales

- **Frontend/Backend:** [Next.js 15+](https://nextjs.org/) (Fullstack)
- **Base de Datos:** [Supabase](https://supabase.com/) (PostgreSQL)
- **ORM:** [TypeORM](https://typeorm.io/)
- **Seguridad:** JWT, RLS (Row Level Security)

## 🏗️ Arquitectura de Aislamiento

El proyecto utiliza una estrategia de **Shared Schema** (Esquema Compartido). Todos los datos residen en la misma base de datos, pero están aislados lógicamente mediante:

1.  **Seguridad a Nivel de Fila (RLS):** Implementada en PostgreSQL para asegurar que los usuarios solo puedan acceder a datos de su `tenantId`.
2.  **Proxy de API:** Una capa funcional que valida el JWT de la sesión y extrae el `tenantId` de forma segura, inyectándolo en las operaciones de base de datos.

## 🛠️ Requisitos de Robustez (En progreso)

- **Idempotencia:** (Requerimiento 4.4 - Planificado) Implementación mediante el header `Idempotency-Key` en operaciones de escritura.
- **Rate Limiting:** (Requerimiento 4.5 - Planificado) Limitación de peticiones mediante middleware de Next.js.
- **Docker:** (Requerimiento 4.6 - Planificado) Docker Compose para entorno local.
- **CI/CD:** (Requerimiento 4.7 - Planificado) Pipeline de despliegue automatizado.

## 🌐 API Endpoints (Protegidos)

La aplicación utiliza un proxy seguro para gestionar el acceso a los datos:

- **Tenants**: `GET /api/tenants`, `POST /api/tenants`
- **Students**: `GET /api/students`, `POST /api/students`
- **Courses**: `GET /api/courses`, `POST /api/courses`
- **Enrollments**: `GET /api/enrollments`, `POST /api/enrollments`

## 📂 Estructura del Proyecto

- [src/app/api](src/app/api): Endpoints de la API protegidos por el proxy.
- [src/proxy.ts](src/proxy.ts): Capa de seguridad y validación de JWT.
- [src/entities](src/entities): Modelos de datos TypeORM.
- [trazabilidad](trazabilidad): Informe de avances diarios.

## 📖 Documentación Adicional

- [Contexto General del Proyecto](contexto.general.md)
- [Registro Día 1](trazabilidad/dia-1.md)
- [Registro Día 2](trazabilidad/dia-2.md)
- [Registro Día 3](trazabilidad/dia-3.md)

---
Desarrollado por [Isac-Coder](https://github.com/Isac-Coder).
