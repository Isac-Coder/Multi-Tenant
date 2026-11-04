import { Tenant } from "../../../entities/Tenant";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { Plus, AlertTriangle, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { getSessionIdentity } from "@/lib/auth-session";
import { notFound } from "next/navigation";

const TENANT_COLORS = ["bg-accent","bg-teal","bg-purple","bg-danger","bg-warning"];

function getInitials(name: string) {
  return name.split(" ").slice(0,2).map(n => n[0]).join("").toUpperCase();
}

export const dynamic = "force-dynamic";

export default async function TenantsPage() {
  const session = await getSessionIdentity();
  if (!session) notFound();

  const { AppDataSource, initializeDatabase } = await import("../../../database/data-source");
  await initializeDatabase();
  const tenants = session.role === "platform_admin"
    ? await AppDataSource.getRepository(Tenant).find({ order: { name: "ASC" } })
    : await AppDataSource.getRepository(Tenant).findBy({ id: session.tenantId });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[18px] font-medium text-brand-text">Tenants registrados</h1>
          <p className="text-[13px] text-brand-muted mt-0.5">{tenants.length} academias activas en la plataforma</p>
        </div>
        <Link href="/tenants/new">
          <Button variant="primary">
            <Plus className="w-4 h-4" /> Nuevo tenant
          </Button>
        </Link>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Tenants activos",    value: tenants.length, sub: "en la plataforma" },
          { label: "Total estudiantes",  value: "—",  sub: "a través de todos los tenants" },
          { label: "Peticiones hoy",     value: "—",  sub: "rate limit saludable" },
        ].map(m => (
          <div key={m.label} className="bg-surface-1 border border-brand-border rounded-card p-4">
            <p className="text-xs text-brand-muted mb-1">{m.label}</p>
            <p className="text-[22px] font-medium text-brand-text">{m.value}</p>
            <p className="text-[11px] text-brand-hint mt-0.5">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-surface-2 border border-brand-border rounded-card overflow-hidden mb-4">
        {tenants.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-4xl mb-3">🏢</p>
            <p className="text-brand-muted text-sm mb-4">Sin tenants registrados aún</p>
            <Link href="/tenants/new">
              <Button variant="primary" size="sm"><Plus className="w-4 h-4" /> Crear primero</Button>
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-border">
                {["Academia","Slug / Schema","Plan","Estado","Acciones"].map(h => (
                  <th key={h} className="text-left text-[11px] font-medium uppercase tracking-[0.05em] text-brand-hint px-4 py-2.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {tenants.map((t, i) => (
                <tr key={t.id} className="hover:bg-surface-1 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className={"w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 " + TENANT_COLORS[i % TENANT_COLORS.length]}>
                        {getInitials(t.name)}
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-brand-text">{t.name}</p>
                        <p className="text-[11px] text-brand-hint">{t.id.slice(0,8)}…</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-[12px] bg-surface-1 border border-brand-border px-1.5 py-0.5 rounded font-mono text-brand-muted">
                      {t.slug}
                    </code>
                  </td>
                  <td className="px-4 py-3"><Badge variant="purple">Pro</Badge></td>
                  <td className="px-4 py-3"><Badge variant="success">Activo</Badge></td>
                  <td className="px-4 py-3">
                    <Link href={`/tenants/${t.id}`}>
                      <Button size="sm" variant="ghost">Ver</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}
