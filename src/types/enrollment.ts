import { Student } from './student';
import { Course } from './course';

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  student?: Student; // Relación opcional para vistas
  course?: Course;   // Relación opcional para vistas
  tenantId: string;
  enrolledAt: Date;
}
