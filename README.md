# Multi-Tenant SaaS - Academias e Institutos

Este es un proyecto de software como servicio (SaaS) diseñado para la gestión de múltiples academias e institutos bajo una arquitectura **Multi-tenant**.

## 🚀 Tecnologías Principales

- **Frontend:** [Next.js 15+](https://nextjs.org/) (App Router)
- **Base de Datos:** [Supabase](https://supabase.com/) (PostgreSQL)
- **ORM:** [TypeORM](https://typeorm.io/)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)

## 🏗️ Arquitectura de Aislamiento

El proyecto utiliza una estrategia de **Shared Schema** (Esquema Compartido). Todos los datos residen en la misma base de datos, pero están aislados lógicamente mediante una columna `tenantId` en cada tabla relevante (`Students`, `Courses`, `Enrollments`).

## 🛠️ Configuración del Proyecto

### 1. Requisitos Previos

- Node.js 20+
- Una cuenta en Supabase con un proyecto PostgreSQL creado.

### 2. Instalación

```bash
npm install
```

### 3. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto y configura tu URL de conexión de Supabase:

```env
DATABASE_URL=postgresql://postgres.[USUARIO]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```

### 4. Inicialización de la Base de Datos

El proyecto está configurado para sincronizar el esquema automáticamente en desarrollo mediante `synchronize: true` en el DataSource. Para producción, usar el sistema de migraciones.

## 🗄️ Migraciones

El proyecto incluye scripts pre-configurados para manejar migraciones de base de datos con TypeORM:

```bash
# Generar una nueva migración a partir de cambios en las entidades
npm run migration:generate -- src/database/migrations/NombreDeMigracion

# Ejecutar todas las migraciones pendientes
npm run migration:run

# Revertir la última migración ejecutada
npm run migration:revert
```

## 📂 Estructura del Proyecto

```
src/
├── app/              # Rutas y vistas de Next.js
├── entities/         # Modelos de datos TypeORM (Tenant, Student, Course, Enrollment)
├── database/
│   ├── data-source.ts    # Configuración de conexión TypeORM
│   └── migrations/       # Archivos de migración generados
└── features/         # Lógica de negocio organizada por dominios
trazabilidad/         # Registro detallado de los avances diarios
```

## 📖 Documentación Adicional

Para más detalles sobre el diseño, decisiones técnicas y guías de migración, consulta:
- [Contexto General del Proyecto](./contexto.general.md)
- [Registro del Día 1](./trazabilidad/dia-1.md)
- [Registro del Día 2](./trazabilidad/dia-2.md)

---
Desarrollado por [Isac-Coder](https://github.com/Isac-Coder).
