import { AppDataSource, initializeDatabase } from "@/database/data-source";
import { Student } from "@/entities/Student";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default async function EditStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await initializeDatabase();
  const student = await AppDataSource.getRepository(Student).findOneBy({ id });

  if (!student) return <div className="p-8">Estudiante no encontrado</div>;

  return (
    <div className="min-h-screen bg-surface-0 p-8">
      <h1 className="text-2xl font-bold text-brand-text mb-8">Editar Estudiante</h1>
      
      <Card className="p-6 max-w-lg">
        <form className="space-y-4">
          <Input label="Nombre completo" name="name" defaultValue={student.name} required />
          <Input label="Email" name="email" type="email" defaultValue={student.email} required />
          <div className="pt-4 flex gap-2">
            <Button variant="primary" type="submit">Actualizar</Button>
            <Button variant="ghost" type="button">Cancelar</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
