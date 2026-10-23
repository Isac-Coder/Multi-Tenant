# Contexto General del Proyecto: SaaS Multitenant para Academias e Institutos

## 1. Descripción General
Este proyecto consiste en el desarrollo de una plataforma SaaS (Software as a Service) diseñada para la gestión de **Academias e Institutos**. La aplicación permite que múltiples instituciones (Tenants) utilicen la misma infraestructura de software, manteniendo sus datos estrictamente aislados.

## 2. Stack Tecnológico
- **Frontend/Framework**: Next.js (App Router).
- **Lenguaje**: TypeScript.
- **Base de Datos**: PostgreSQL (alojada en Supabase).
- **ORM**: TypeORM.
- **Estilos**: Tailwind CSS.

## 3. Arquitectura Multitenant
- **Estrategia de Aislamiento**: Shared Schema (Esquema Compartido).
- **Mecanismo**: Cada tabla de datos (estudiantes, cursos, inscripciones) posee una columna `tenantId` que vincula el registro a una academia específica.
- **Identificación**: El tenant es identificado a través de un `slug` único en la base de datos, lo que permite futuras implementaciones de subdominios o rutas dinámicas (ej. `/academia-abc/dashboard`).

## 4. Modelo de Datos
El sistema se basa en cuatro entidades principales:
- **Tenant**: La entidad raíz (la academia).
- **Student**: Alumnos pertenecientes a una academia.
- **Course**: Cursos creados por una academia.
- **Enrollment**: Relación muchos-a-muchos entre alumnos y cursos, vinculada también al tenant para seguridad.

## 5. Estructura de Carpetas
- `src/app`: Rutas y vistas de Next.js.
- `src/entities`: Definiciones de tablas de TypeORM.
- `src/database`: Configuración de conexión y DataSource.
- `src/features`: Lógica de negocio organizada por dominios (business/courses, students, etc.).
- `trazabilidad/`: Bitácoras diarias de progreso.

## 6. Guía de Migración a Supabase

Para desplegar el esquema definido en el código hacia la base de datos de Supabase, se han establecido dos caminos:

### Opción A: Sincronización Automática (Desarrollo)
En el archivo `src/database/data-source.ts`, la propiedad `synchronize: true` está activa.
- **Cómo funciona**: Cada vez que la aplicación se conecta a la base de datos, TypeORM compara las entidades en código con las tablas existentes y crea/modifica las tablas automáticamente.
- **Cuándo usar**: Únicamente en etapas tempranas de desarrollo.
- **Riesgo**: Puede borrar datos si se cambian nombres de columnas o tipos de datos.

### Opción B: Migraciones Controladas (Producción/Sustentable)
Para un entorno profesional, se debe desactivar `synchronize` y usar los scripts pre-configurados en `package.json`:

```bash
# Generar migración a partir de cambios en entidades
npm run migration:generate -- src/database/migrations/NombreDeMigracion

# Ejecutar todas las migraciones pendientes
npm run migration:run

# Revertir la última migración
npm run migration:revert
```

Estos scripts utilizan `NODE_OPTIONS='--loader ts-node/esm --no-warnings'` internamente para compatibilidad con ES Modules.

### Pasos Críticos para la Conexión
1. Obtener la **Connection String** en el panel de Supabase $\rightarrow$ Settings $\rightarrow$ Database.
2. Configurar la variable `DATABASE_URL` en el archivo `.env`.
3. Asegurarse de que el password no contenga caracteres especiales sin codificar en la URL.

---
**Última Actualización:** 2026-10-22
