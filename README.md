# Multi-Tenant SaaS - Academias e Institutos

Este es un proyecto de software como servicio (SaaS) diseñado para la gestión de múltiples academias e institutos bajo una arquitectura **Multi-tenant**.

## 🚀 Tecnologías Principales

- **Frontend/Backend:** [Next.js 15+](https://nextjs.org/) (Fullstack)
- **Base de Datos:** [Supabase](https://supabase.com/) (PostgreSQL)
- **ORM:** [TypeORM](https://typeorm.io/)
- **Seguridad:** JWT y aislamiento de datos por schema de PostgreSQL

## 🏗️ Arquitectura de Aislamiento

El proyecto utiliza **un schema de PostgreSQL por tenant**. El registro central `public.tenants` almacena el nombre del schema (`tenant_<uuid>`), mientras que `students`, `courses` y `enrollments` viven dentro de ese schema. Las cuentas de acceso permanecen en `public.users`.

El tenant se obtiene de la sesión JWT firmada. El servidor resuelve su schema desde el registro central y crea un datasource limitado a ese schema; ninguna ruta acepta el nombre del schema desde el cliente. Las APIs además validan el JWT y restringen las operaciones al tenant de la sesión.

La separación de schemas se aplica en la capa de aplicación. El usuario configurado en `DATABASE_URL` es una credencial de servidor con acceso a la base; no debe exponerse al cliente. Consulta [context/RLS.md](context/RLS.md) para conocer esta frontera de seguridad y las consideraciones de RLS.

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
