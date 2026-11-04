import { Course } from "../../../../entities/Course";
import { Enrollment } from "../../../../entities/Enrollment";
import { Badge } from "../../../../components/ui/Badge";
import { Button } from "../../../../components/ui/Button";
import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { getCurrentTenantDataSource } = await import("../../../../database/tenant-data-source");
  const { dataSource: AppDataSource } = await getCurrentTenantDataSource();
  const course = await AppDataSource.getRepository(Course).findOneBy({ id });

  if (!course) return (
    <div className="p-6 text-center">
      <p className="text-brand-muted">Curso no encontrado</p>
      <Link href="/courses"><Button variant="ghost" className="mt-3">← Volver</Button></Link>
    </div>
  );

  const enrollmentCount = await AppDataSource.getRepository(Enrollment).countBy({ courseId: id });
  const fillPercentage = Math.min((enrollmentCount / course.capacity) * 100, 100);

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/courses">
          <button className="flex items-center gap-1.5 text-[13px] text-brand-muted hover:text-brand-text transition-colors">
            <ArrowLeft className="w-4 h-4" /> Cursos
          </button>
        </Link>
        <span className="text-brand-border">/</span>
        <h1 className="text-[18px] font-medium text-brand-text">Detalle del curso</h1>
      </div>

      <div className="max-w-lg space-y-4">
        <div className="bg-surface-2 border border-brand-border rounded-card p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h2 className="text-[16px] font-medium text-brand-text">{course.title}</h2>
                <p className="text-[12px] text-brand-hint">ID: {course.id.slice(0,8)}…</p>
              </div>
            </div>
            <Badge variant="success">Activo</Badge>
          </div>

          <div className="space-y-3 border-t border-brand-border pt-4">
            <div>
              <p className="text-[11px] font-medium text-brand-muted mb-1">Descripción</p>
              <p className="text-[13px] text-brand-text leading-relaxed">{course.description}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-brand-muted mb-1">Capacidad</p>
              <p className="text-[13px] text-brand-text">{enrollmentCount} / {course.capacity} estudiantes</p>
              <div className="h-1 bg-brand-border rounded-full mt-1.5">
                <div className="h-full bg-accent-mid rounded-full" style={{ width: `${fillPercentage}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Link href={`/courses/${id}/edit`}>
            <Button variant="primary">Editar curso</Button>
          </Link>
          <Link href="/courses">
            <Button variant="secondary">Volver al catálogo</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
