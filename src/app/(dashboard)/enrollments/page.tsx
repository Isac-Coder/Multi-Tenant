import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function EnrollmentsPage() {
  const { AppDataSource, initializeDatabase } = await import("@/database/data-source");
  await initializeDatabase();
  const enrollmentRepo = AppDataSource.getRepository(Enrollment);
  const enrollments = await enrollmentRepo.find({
    relations: {
        student: true,
        course: true
    },
  });

  return (
    <div className="min-h-screen bg-surface-0 p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-brand-text">Matrículas</h1>
        <Link href="/enrollments/new">
            <Button variant="primary">
                <Plus className="w-4 h-4" /> Nueva Matrícula
            </Button>
        </Link>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {enrollments.map((enrollment) => (
          <Card key={enrollment.id} className="p-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-brand-text">
                {enrollment.student.name} 
                <span className="text-brand-muted font-normal"> se matriculó en </span>
                {enrollment.course.title}
              </h3>
              <p className="text-xs text-brand-hint">
                Fecha: {enrollment.enrolledAt.toLocaleDateString()}
              </p>
            </div>
            <Badge variant="success">Completado</Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}
