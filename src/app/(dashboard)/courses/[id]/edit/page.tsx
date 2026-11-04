import { Course } from "../../../../../entities/Course";
import { Button } from "../../../../../components/ui/Button";
import { Input } from "../../../../../components/ui/Input";
import { updateCourseAction } from "../../../../actions/courses";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function EditCoursePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const [{ id }, { error }] = await Promise.all([params, searchParams]);
  const { getCurrentTenantDataSource } = await import("../../../../../database/tenant-data-source");
  const { dataSource: AppDataSource } = await getCurrentTenantDataSource();
  const course = await AppDataSource.getRepository(Course).findOneBy({ id });

  if (!course) return (
    <div className="p-6 text-center">
      <p className="text-brand-muted">Curso no encontrado</p>
      <Link href="/courses"><Button variant="ghost" className="mt-3">← Volver</Button></Link>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/courses/${id}`}>
          <button className="flex items-center gap-1.5 text-[13px] text-brand-muted hover:text-brand-text transition-colors">
            <ArrowLeft className="w-4 h-4" /> Detalle
          </button>
        </Link>
        <span className="text-brand-border">/</span>
        <h1 className="text-[18px] font-medium text-brand-text">Editar curso</h1>
      </div>

      <div className="max-w-lg">
        <div className="bg-surface-2 border border-brand-border rounded-card p-6 shadow-sm">
          <form action={updateCourseAction.bind(null, id)} className="space-y-4">
            <Input label="Título del curso *" name="title" defaultValue={course.title} required />
            <Input label="Capacidad máxima *" name="capacity" type="number" min="1" defaultValue={course.capacity} required />
            <div>
              <label className="text-xs font-medium text-brand-muted block mb-1">Descripción *</label>
              <textarea
                name="description"
                rows={4}
                defaultValue={course.description}
                className="w-full px-2.5 py-1.5 text-sm bg-surface-2 border border-brand-border-strong rounded-lg
                           text-brand-text placeholder:text-brand-hint resize-none
                           focus:outline-none focus:border-accent-mid focus:ring-2 focus:ring-accent-light transition-colors"
                required
              />
            </div>
            {error === "invalid" && <p className="text-danger text-xs">Ingresa una capacidad válida.</p>}
            <div className="flex justify-end gap-2.5 pt-2">
              <Link href={`/courses/${id}`}>
                <Button variant="ghost">Cancelar</Button>
              </Link>
              <Button variant="primary" type="submit">Actualizar</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
