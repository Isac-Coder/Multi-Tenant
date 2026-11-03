import { Student } from "@/entities/Student";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function EditStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { AppDataSource, initializeDatabase } = await import("@/database/data-source");
  await initializeDatabase();
  const student = await AppDataSource.getRepository(Student).findOneBy({ id });

  if (!student) return (
    <div className="p-6 text-center">
      <p className="text-brand-muted">Estudiante no encontrado</p>
      <Link href="/students"><Button variant="ghost" className="mt-3">← Volver</Button></Link>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/students/${id}`}>
          <button className="flex items-center gap-1.5 text-[13px] text-brand-muted hover:text-brand-text transition-colors">
            <ArrowLeft className="w-4 h-4" /> Detalle
          </button>
        </Link>
        <span className="text-brand-border">/</span>
        <h1 className="text-[18px] font-medium text-brand-text">Editar estudiante</h1>
      </div>

      <div className="max-w-lg">
        <div className="bg-surface-2 border border-brand-border rounded-card p-6 shadow-sm">
          <form className="space-y-4">
            <Input label="Nombre completo *" name="name" defaultValue={student.name} required />
            <Input label="Correo electrónico *" name="email" type="email" defaultValue={student.email} required />
            <div className="flex justify-end gap-2.5 pt-2">
              <Link href={`/students/${id}`}>
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
