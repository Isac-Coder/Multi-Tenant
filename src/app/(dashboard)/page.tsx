
import { Student } from "@/entities/Student";
import { Course } from "@/entities/Course";
import { Enrollment } from "@/entities/Enrollment";
import { Card } from "@/components/ui/Card";
import { MetricCard } from "@/components/ui/MetricCard";
import { Button } from "@/components/ui/Button";

export default async function Home() {
  const { AppDataSource, initializeDatabase } = await import("@/database/data-source");
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
        <MetricCard label="Total Students" value={totalStudents} sub="↑ 12 este mes" />
        <MetricCard label="Active Courses" value={totalCourses} sub="↑ 2 nuevos" />
        <MetricCard label="Total Enrollments" value={totalEnrollments} sub="↑ 18 esta semana" />
      </div>
    </div>
  );
}
