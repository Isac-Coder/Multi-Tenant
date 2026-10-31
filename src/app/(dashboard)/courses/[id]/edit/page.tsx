import { Course } from "@/entities/Course";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Dynamic import to prevent build time execution of database code
  const { AppDataSource, initializeDatabase } = await import("@/database/data-source");
  await initializeDatabase();
  const course = await AppDataSource.getRepository(Course).findOneBy({ id });

  if (!course) return <div className="p-8">Curso no encontrado</div>;

  return (
    <div className="min-h-screen bg-surface-0 p-8">
      <h1 className="text-2xl font-bold text-brand-text mb-8">Editar Curso</h1>
      
      <Card className="p-6 max-w-lg">
        <form className="space-y-4">
          <Input label="Título del curso" name="title" defaultValue={course.title} required />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-brand-muted">Descripción</label>
            <textarea
              name="description"
              defaultValue={course.description}
              className="w-full px-2.5 py-1.5 text-sm bg-surface-2 border border-brand-border-strong rounded-lg
                         text-brand-text placeholder:text-brand-hint
                         focus:outline-none focus:border-accent-mid focus:ring-2 focus:ring-accent-light
                         transition-colors"
              rows={4}
              required
            />
          </div>
          <div className="pt-4 flex gap-2">
            <Button variant="primary" type="submit">Actualizar</Button>
            <Button variant="ghost" type="button">Cancelar</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
