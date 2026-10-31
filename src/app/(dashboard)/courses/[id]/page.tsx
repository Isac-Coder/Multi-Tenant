import { Course } from "@/entities/Course";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Dynamic import to prevent build time execution
  const { AppDataSource, initializeDatabase } = await import("@/database/data-source");
  await initializeDatabase();
  const course = await AppDataSource.getRepository(Course).findOneBy({ id });

  if (!course) return <div className="p-8">Curso no encontrado</div>;

  return (
    <div className="min-h-screen bg-surface-0 p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-brand-text">Detalle del Curso</h1>
        <div className="flex gap-2">
            <Link href={`/courses/${id}/edit`}>
                <Button variant="secondary">Editar</Button>
            </Link>
            <Link href="/courses">
                <Button variant="ghost">Volver</Button>
            </Link>
        </div>
      </header>

      <Card className="p-6 max-w-lg">
        <div className="space-y-4">
            <div>
                <label className="text-xs font-medium text-brand-muted">Título</label>
                <p className="text-brand-text font-semibold text-lg">{course.title}</p>
            </div>
            <div>
                <label className="text-xs font-medium text-brand-muted">Descripción</label>
                <p className="text-brand-text">{course.description}</p>
            </div>
        </div>
      </Card>
    </div>
  );
}
