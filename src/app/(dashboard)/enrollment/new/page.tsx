import { Student } from "@/entities/Student";
import { Course } from "@/entities/Course";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { ArrowLeft, Key } from "lucide-react";
import Link from "next/link";

export default async function NewEnrollmentPage() {
  const { AppDataSource, initializeDatabase } = await import("@/database/data-source");
  await initializeDatabase();
  const [students, courses] = await Promise.all([
    AppDataSource.getRepository(Student).find({ order: { name: "ASC" } }),
    AppDataSource.getRepository(Course).find({ order: { title: "ASC" } }),
  ]);

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
          <form className="space-y-4">
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

            <div className="flex items-start gap-2 bg-accent-light text-accent text-xs p-2.5 rounded-lg border-l-[3px] border-accent-mid">
              <Key className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Idempotencia activa:</strong> Si envías este formulario dos veces,
                solo se creará una inscripción. Usamos{" "}
                <code className="bg-accent/10 px-1 rounded">Idempotency-Key</code> automáticamente.
              </span>
            </div>

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
