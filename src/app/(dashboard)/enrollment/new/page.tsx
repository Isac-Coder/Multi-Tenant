import { Student } from "../../../../entities/Student";
import { Course } from "../../../../entities/Course";
import { Button } from "../../../../components/ui/Button";
import { Select } from "../../../../components/ui/Select";
import { createEnrollmentAction } from "../../../actions/enrollments";
import { ArrowLeft, Key } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function NewEnrollmentPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const { getCurrentTenantDataSource } = await import("../../../../database/tenant-data-source");
  const { dataSource: AppDataSource } = await getCurrentTenantDataSource();
  const [students, courses] = await Promise.all([
    AppDataSource.getRepository(Student).find({ order: { name: "ASC" } }),
    AppDataSource.getRepository(Course).find({ order: { title: "ASC" } }),
  ]);
  const errorMessage = error === "required"
    ? "Selecciona un estudiante y un curso"
    : error === "invalid"
      ? "El estudiante y el curso deben pertenecer a la misma academia"
      : error === "duplicate"
        ? "El estudiante ya está inscrito en este curso"
        : null;

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/enrollment">
          <button className="flex items-center gap-1.5 text-[13px] text-brand-muted hover:text-brand-text transition-colors">
            <ArrowLeft className="w-4 h-4" /> Inscripciones
          </button>
        </Link>
        <span className="text-brand-border">/</span>
        <h1 className="text-[18px] font-medium text-brand-text">Nueva inscripción</h1>
      </div>

      <div className="max-w-lg">
        <div className="bg-surface-2 border border-brand-border rounded-card p-6 shadow-sm">
          <h2 className="text-[14px] font-medium text-brand-text mb-4">Datos de la inscripción</h2>
          <form action={createEnrollmentAction} className="space-y-4">
            <Select label="Estudiante *" name="studentId" required>
              <option value="">Seleccione un estudiante</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </Select>

            <Select label="Curso *" name="courseId" required>
              <option value="">Seleccione un curso</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </Select>

            {errorMessage && <p className="text-danger text-xs">{errorMessage}</p>}

            <div className="flex justify-end gap-2.5 pt-2">
              <Link href="/enrollment">
                <Button variant="ghost">Cancelar</Button>
              </Link>
              <Button variant="primary" type="submit">Guardar inscripción</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
