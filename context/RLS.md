# Aislamiento por Schema y consideraciones de RLS

## Arquitectura actual

La aplicación usa un schema PostgreSQL por tenant en la misma base de Supabase:

- `public.tenants` mantiene el registro central y el nombre validado del schema (`tenant_<uuid sin guiones>`).
- `public.users` mantiene las cuentas de autenticación y su `tenantId`.
- `students`, `courses` y `enrollments` se crean dentro del schema de cada tenant.

Al iniciar sesión, el JWT firmado incluye `tenant_id`. El servidor valida la firma y resuelve el nombre del schema desde `public.tenants`; el cliente no envía ni controla ese nombre. `getTenantDataSource` crea un datasource cuyo schema queda fijado al del tenant. Las páginas, acciones y APIs de negocio deben usar ese datasource y no consultar las tablas compartidas de `public`.

La migración `MigrateTenantDataToSchemas1793812000000` crea los schemas, copia las filas existentes por `tenantId`, comprueba que no haya filas huérfanas y valida los conteos antes de retirar las tablas compartidas.

## Frontera de seguridad

El aislamiento entre usuarios de la aplicación se aplica en el servidor al resolver el schema exclusivamente desde la sesión autenticada. Las rutas administrativas de tenants requieren el rol `platform_admin`; un tenant normal solo puede consultar su propio detalle.

Esto **no equivale a RLS**: una credencial de base de datos con permisos sobre todos los schemas puede leerlos directamente. `DATABASE_URL` debe permanecer exclusivamente en el servidor y no debe exponerse al cliente. Si se requiere aislamiento a nivel de conexión SQL, hay que desplegar roles/políticas de base de datos que no sean propietarios o superusuarios y verificar que no puedan cambiar libremente el `search_path`.

## Verificación

- La migración compara las filas migradas con las cantidades originales por tenant.
- Las páginas y APIs de negocio seleccionan el datasource usando el `tenant_id` firmado.
- Las pruebas de integración deben crear datos con una sesión y comprobar que otra sesión no los obtiene.

---
**Última Actualización:** 2026-11-04
