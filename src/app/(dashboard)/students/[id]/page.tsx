import { Student } from "@/entities/Student";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default async function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const { AppDataSource, initializeDatabase } = await import("@/database/data-source");
  await initializeDatabase();
  const student = await AppDataSource.getRepository(Student).findOneBy({ id });

  if (!student) return <div className="p-8">Estudiante no encontrado</div>;

  return (
    <div className="min-h-screen bg-surface-0 p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-brand-text">Detalle del Estudiante</h1>
        <div className="flex gap-2">
            <Link href={`/students/${id}/edit`}>
                <Button variant="secondary">Editar</Button>
            </Link>
            <Link href="/students">
                <Button variant="ghost">Volver</Button>
            </Link>
        </div>
      </header>

      <Card className="p-6 max-w-lg">
        <div className="space-y-4">
            <div>
                <label className="text-xs font-medium text-brand-muted">Nombre</label>
                <p className="text-brand-text">{student.name}</p>
            </div>
            <div>
                <label className="text-xs font-medium text-brand-muted">Email</label>
                <p className="text-brand-text">{student.email}</p>
            </div>
            <div>
                <label className="text-xs font-medium text-brand-muted">Fecha de creación</label>
                <p className="text-brand-text">{student.createdAt.toLocaleDateString()}</p>
            </div>
        </div>
      </Card>
    </div>
  );
}
