import { Badge } from "../../../components/ui/Badge";
import { User, Mail, Building2 } from "lucide-react";
import { getSessionIdentity } from "@/lib/auth-session";
import { Tenant } from "../../../entities/Tenant";

export default async function ProfilePage() {
  const identity = await getSessionIdentity();
  const { AppDataSource, initializeDatabase } = await import("../../../database/data-source");
  await initializeDatabase();
  const tenant = identity
    ? await AppDataSource.getRepository(Tenant).findOneBy({ id: identity.tenantId })
    : null;
  const user = { name: identity?.name ?? "Usuario", email: identity?.email ?? "" };
  const initials = user.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  const roleLabel = identity?.role === "student"
    ? "Estudiante"
    : identity?.role === "platform_admin"
      ? "Administrador de plataforma"
      : "Administrador de academia";

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-[18px] font-medium text-brand-text">Mi perfil</h1>
        <p className="text-[13px] text-brand-muted mt-0.5">Gestiona tu cuenta y preferencias</p>
      </div>

      <div className="max-w-lg space-y-4">
        {/* Profile card */}
        <div className="bg-surface-2 border border-brand-border rounded-card p-6">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-full bg-purple-bg text-purple flex items-center justify-center text-xl font-semibold">
              {initials || "U"}
            </div>
            <div>
              <h2 className="text-[15px] font-medium text-brand-text">{user.name}</h2>
              <p className="text-[13px] text-brand-muted">{user.email}</p>
            </div>
            <div className="ml-auto">
              <Badge variant="purple">{identity?.role === "student" ? "Estudiante" : "Admin"}</Badge>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <User className="w-3.5 h-3.5 text-brand-hint" />
            <h3 className="text-[12px] font-medium text-brand-muted uppercase tracking-wide">Información de la cuenta</h3>
          </div>

          <dl className="divide-y divide-brand-border">
            <div className="flex items-start gap-2 py-3">
              <User className="w-3.5 h-3.5 text-brand-hint mt-0.5" />
              <div><dt className="text-[11px] text-brand-muted">Nombre completo</dt><dd className="text-[13px] text-brand-text">{user.name}</dd></div>
            </div>
            <div className="flex items-start gap-2 py-3">
              <Mail className="w-3.5 h-3.5 text-brand-hint mt-0.5" />
              <div><dt className="text-[11px] text-brand-muted">Correo electrónico</dt><dd className="text-[13px] text-brand-text">{user.email}</dd></div>
            </div>
            <div className="flex items-start gap-2 py-3">
              <Building2 className="w-3.5 h-3.5 text-brand-hint mt-0.5" />
              <div><dt className="text-[11px] text-brand-muted">Academia</dt><dd className="text-[13px] text-brand-text">{tenant?.name ?? "Sin academia asignada"}</dd></div>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
