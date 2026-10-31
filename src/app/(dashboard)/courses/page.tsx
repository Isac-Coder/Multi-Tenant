import { Course } from "@/entities/Course";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function CoursesPage() {
  // Dynamic import to prevent build time execution
  const { AppDataSource, initializeDatabase } = await import("@/database/data-source");
  await initializeDatabase();
  const courseRepo = AppDataSource.getRepository(Course);
  const courses = await courseRepo.find();

  return (
    <div className="min-h-screen bg-surface-0 p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-brand-text">Cursos</h1>
        <Link href="/courses/new">
            <Button variant="primary">
              <Plus className="w-4 h-4" /> Nuevo Curso
            </Button>
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="p-5 flex flex-col gap-3">
            <h3 className="font-semibold text-brand-text text-lg">{course.title}</h3>
            <p className="text-sm text-brand-muted line-clamp-2">{course.description}</p>
            <div className="mt-auto pt-4 flex gap-2">
              <Link href={`/courses/${course.id}/edit`}>
                  <Button size="sm" variant="secondary">Editar</Button>
              </Link>
              <Link href={`/courses/${course.id}`}>
                  <Button size="sm" variant="ghost">Ver detalle</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
