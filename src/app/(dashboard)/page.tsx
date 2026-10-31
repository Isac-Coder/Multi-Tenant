
import { AppDataSource, initializeDatabase } from "@/database/data-source";
import { Student } from "@/entities/Student";
import { Course } from "@/entities/Course";
import { Enrollment } from "@/entities/Enrollment";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default async function Home() {
  await initializeDatabase();
  
  const studentRepo = AppDataSource.getRepository(Student);
  const courseRepo = AppDataSource.getRepository(Course);
  const enrollmentRepo = AppDataSource.getRepository(Enrollment);
  
  const [totalStudents, totalCourses, totalEnrollments] = await Promise.all([
    studentRepo.count(),
    courseRepo.count(),
    enrollmentRepo.count(),
  ]);

  return (
    <div className="min-h-screen bg-surface-0 p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-brand-text">Dashboard</h1>
        <Button variant="primary">Add New</Button>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h2 className="text-brand-muted text-sm font-medium">Total Students</h2>
          <p className="text-3xl font-bold text-brand-text mt-2">{totalStudents}</p>
        </Card>
        <Card className="p-6">
          <h2 className="text-brand-muted text-sm font-medium">Active Courses</h2>
          <p className="text-3xl font-bold text-brand-text mt-2">{totalCourses}</p>
        </Card>
        <Card className="p-6">
          <h2 className="text-brand-muted text-sm font-medium">Total Enrollments</h2>
          <p className="text-3xl font-bold text-brand-text mt-2">{totalEnrollments}</p>
        </Card>
      </div>
    </div>
  );
}
