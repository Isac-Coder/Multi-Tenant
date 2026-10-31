import { AppDataSource, initializeDatabase } from "@/database/data-source";
import { Student } from "@/entities/Student";
import { Course } from "@/entities/Course";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";

export default async function NewEnrollmentPage() {
  await initializeDatabase();
  const studentRepo = AppDataSource.getRepository(Student);
  const courseRepo = AppDataSource.getRepository(Course);
  
  const [students, courses] = await Promise.all([
    studentRepo.find(),
    courseRepo.find(),
  ]);

  return (
    <div className="min-h-screen bg-surface-0 p-8">
      <h1 className="text-2xl font-bold text-brand-text mb-8">Nueva Matrícula</h1>
      
      <Card className="p-6 max-w-lg">
        <form className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-brand-muted">Estudiante</label>
            <Select name="studentId" required>
              <option value="">Seleccione un estudiante</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>{student.name}</option>
              ))}
            </Select>
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-brand-muted">Curso</label>
            <Select name="courseId" required>
              <option value="">Seleccione un curso</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </Select>
          </div>
          
          <div className="pt-4 flex gap-2">
            <Button variant="primary" type="submit">Guardar Matrícula</Button>
            <Button variant="ghost" type="button">Cancelar</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
