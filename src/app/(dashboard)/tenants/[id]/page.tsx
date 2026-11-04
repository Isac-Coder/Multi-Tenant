import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, ClipboardList, GraduationCap, Users } from "lucide-react";
import { AppDataSource, initializeDatabase } from "../../../../database/data-source";
import { getTenantDataSource } from "../../../../database/tenant-data-source";
import { Tenant } from "../../../../entities/Tenant";
import { Student } from "../../../../entities/Student";
import { Course } from "../../../../entities/Course";
import { Enrollment } from "../../../../entities/Enrollment";
import { User } from "../../../../entities/User";
import { Button } from "../../../../components/ui/Button";
import { Badge } from "../../../../components/ui/Badge";
import { getSessionIdentity } from "@/lib/auth-session";

export default async function TenantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSessionIdentity();
  if (!session || (session.role !== "platform_admin" && session.tenantId !== id)) notFound();
  await initializeDatabase();

  const tenant = await AppDataSource.getRepository(Tenant).findOneBy({ id });
  if (!tenant) notFound();

  const tenantDataSource = await getTenantDataSource(id);
  const [students, courses, enrollments, users] = await Promise.all([
    tenantDataSource.getRepository(Student).count(),
    tenantDataSource.getRepository(Course).count(),
    tenantDataSource.getRepository(Enrollment).count(),
    AppDataSource.getRepository(User).countBy({ tenantId: id }),
  ]);

  const metrics = [
    { label: "Estudiantes", value: students, icon: GraduationCap },
    { label: "Cursos", value: courses, icon: BookOpen },
    { label: "Inscripciones", value: enrollments, icon: ClipboardList },
    { label: "Usuarios", value: users, icon: Users },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/tenants">
          <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /> Tenants</Button>
        </Link>
        <span className="text-brand-border">/</span>
        <h1 className="text-[18px] font-medium text-brand-text truncate">{tenant.name}</h1>
      </div>

      <div className="flex items-center justify-between border-b border-brand-border pb-4 mb-5">
        <div>
          <p className="text-[13px] text-brand-muted">{tenant.slug}.edutenant.app</p>
          <p className="text-[12px] text-brand-hint mt-1">{tenant.city || "Ciudad no especificada"}</p>
        </div>
        <Badge variant="success">Activo</Badge>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {metrics.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-surface-1 border border-brand-border rounded-card p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-brand-muted">{label}</p>
              <Icon className="w-4 h-4 text-brand-hint" />
            </div>
            <p className="text-[22px] font-medium text-brand-text">{value}</p>
          </div>
        ))}
      </div>

      <section className="max-w-2xl">
        <h2 className="text-[14px] font-medium text-brand-text mb-3">Información de la academia</h2>
        <dl className="divide-y divide-brand-border border-y border-brand-border">
          <div className="flex justify-between gap-4 py-3">
            <dt className="text-[12px] text-brand-muted">ID</dt>
            <dd className="text-[12px] font-mono text-brand-text break-all">{tenant.id}</dd>
          </div>
          <div className="flex justify-between gap-4 py-3">
            <dt className="text-[12px] text-brand-muted">Slug</dt>
            <dd className="text-[12px] text-brand-text">{tenant.slug}</dd>
          </div>
          <div className="flex justify-between gap-4 py-3">
            <dt className="text-[12px] text-brand-muted">Fecha de registro</dt>
            <dd className="text-[12px] text-brand-text">{new Date(tenant.createdAt).toLocaleDateString("es-CO")}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}