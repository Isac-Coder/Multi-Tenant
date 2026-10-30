# Configuración de Row Level Security (RLS) - SaaS Multitenant

Este documento detalla la implementación de la Seguridad a Nivel de Fila (RLS) aplicada en la base de datos de Supabase para garantizar el aislamiento estricto de datos entre los diferentes tenants (academias/institutos).

## 🎯 Objetivo
Asegurar el aislamiento de datos estricto mediante RLS en un modelo de **Shared Schema**. Ningún usuario debe poder acceder a datos que no pertenezcan al `tenantId` vinculado a su sesión.

## 🛠️ Estrategia de Implementación

### 1. Función de Identidad
Se utiliza el `tenant_id` almacenado en los `app_metadata` del JWT del usuario autenticado.

```sql
CREATE OR REPLACE FUNCTION auth.get_my_tenant_id() 
RETURNS uuid AS $$
  SELECT (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid;
$$ LANGUAGE sql STABLE;
```

### 2. Política General de Aislamiento
Para las tablas `students`, `courses` y `enrollments`, se aplicará la siguiente política (ejemplo para `students`):

```sql
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Política de lectura: Solo usuarios del mismo tenant
CREATE POLICY "Aislamiento de lectura" ON public.students
FOR SELECT USING (
  "tenantId" = auth.get_my_tenant_id()
);

-- Política de escritura: Solo usuarios del mismo tenant
CREATE POLICY "Aislamiento de escritura" ON public.students
FOR ALL USING (
  "tenantId" = auth.get_my_tenant_id()
) WITH CHECK (
  "tenantId" = auth.get_my_tenant_id()
);
```

## ⚠️ Consideraciones Críticas para el Proyecto

### Backend y Bypass de RLS
El usuario `postgres` (usado habitualmente en `DATABASE_URL`) es superusuario y **salta todas las RLS**. 
Para demostrar la efectividad de las RLS en la sustentación:
1. Debes crear un usuario de base de datos con menos privilegios en Supabase.
2. Configurar tu backend para usar este nuevo usuario en lugar de `postgres`.
3. Esto garantizará que las políticas RLS definidas arriba sean ejecutadas.

### Idempotencia y RLS
Para el requisito de idempotencia (4.4), debes asegurar que la tabla donde guardas las claves de idempotencia también tenga políticas RLS para evitar que un tenant vea las operaciones de otro.

---
**Última Actualización:** 2026-10-30
