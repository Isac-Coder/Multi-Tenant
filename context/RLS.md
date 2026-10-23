# Configuración de Row Level Security (RLS) - SaaS Multitenant

Este documento detalla la implementación de la Seguridad a Nivel de Fila (RLS) aplicada en la base de datos de Supabase para garantizar el aislamiento estricto de datos entre los diferentes tenants (academias/institutos).

## 🎯 Objetivo
El objetivo principal es asegurar que ningún usuario pueda acceder, modificar o eliminar datos que no pertenezcan al tenant al que está vinculado, incluso si conoce el ID del registro.

## 🛠️ Estrategia de Implementación

La arquitectura utiliza la estrategia de **Shared Schema**. Para ejecutar la RLS, dependemos de la identidad del usuario autenticado a través de Supabase Auth.

### 1. Función de Identidad
Se implementó la función `get_my_tenant_id()`, la cual extrae el identificador del tenant almacenado en los metadatos del JWT del usuario (`app_metadata`).

```sql
CREATE OR REPLACE FUNCTION get_my_tenant_id() 
RETURNS uuid AS $$
  SELECT (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid;
$$ LANGUAGE sql STABLE;
```

### 2. Reglas por Tabla

| Tabla | Operación | Regla de Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| **Tenants** | ALL | `role == 'super_admin'` | Solo administradores globales pueden gestionar la tabla de tenants. |
| **Students** | SELECT | `tenantId == get_my_tenant_id()` | Solo pueden verse alumnos del propio tenant. |
| **Students** | ALL | `tenantId == get_my_tenant_id()` | Solo pueden gestionarse alumnos vinculados al tenant del usuario. |
| **Courses** | SELECT | `tenantId == get_my_tenant_id()` | Solo pueden verse cursos del propio tenant. |
| **Courses** | ALL | `tenantId == get_my_tenant_id()` | Solo pueden gestionarse cursos vinculados al tenant del usuario. |
| **Enrollments**| SELECT | `tenantId == get_my_tenant_id()` | Solo pueden verse inscripciones del propio tenant. |
| **Enrollments**| ALL | `tenantId == get_my_tenant_id()` | Solo pueden gestionarse inscripciones vinculadas al tenant del usuario. |

## ⚠️ Consideraciones Críticas

### Conexión de Administrador vs. Usuario
Es fundamental diferenciar cómo se accede a la base de datos:
- **Direct Connection (`DATABASE_URL`)**: Utilizada por el backend de Next.js con el usuario `postgres`. Este usuario es un superusuario y **salta (bypass) todas las reglas de RLS**.
- **Supabase Client (`anon`/`authenticated` keys)**: Utilizado en el cliente o vía API de Supabase. Estas peticiones **SÍ están sujetas a las RLS**.

### Flujo de Asignación de Tenant
Para que el sistema sea funcional, el proceso de registro debe incluir:
1. Creación del usuario en `auth.users`.
2. Asignación del `tenant_id` correspondiente en los `app_metadata` del usuario.
3. El usuario ahora puede realizar peticiones y la función `get_my_tenant_id()` resolverá su pertenencia.

---
**Última Actualización:** 2026-10-23
