import { Student } from "@/entities/Student";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function StudentsPage() {
  const { AppDataSource, initializeDatabase } = await import("@/database/data-source");
  await initializeDatabase();
  const studentRepo = AppDataSource.getRepository(Student);
  const students = await studentRepo.find();

  return (
    <div className="min-h-screen bg-surface-0 p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-brand-text">Estudiantes</h1>
        <Link href="/students/new">
          <Button variant="primary">
            <Plus className="w-4 h-4" /> Nuevo Estudiante
          </Button>
        </Link>
      </header>
      
      <div className="flex gap-4 mb-6">
        <Input placeholder="Buscar por nombre, email..." className="max-w-xs" />
        <Button variant="secondary">Filtrar</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => (
          <Card key={student.id} className="p-5 flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-brand-text">{student.name}</h3>
              <Badge variant="neutral">Activo</Badge>
            </div>
            <p className="text-sm text-brand-muted">{student.email}</p>
            <div className="mt-auto pt-4 flex gap-2">
              <Link href={`/students/${student.id}/edit`}>
                  <Button size="sm" variant="secondary">Editar</Button>
              </Link>
              <Link href={`/students/${student.id}`}>
                  <Button size="sm" variant="ghost">Ver detalle</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
