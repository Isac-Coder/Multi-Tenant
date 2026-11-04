"use server";

import { getCurrentTenantDataSource } from "@/database/tenant-data-source";
import { Course } from "@/entities/Course";
import { Enrollment } from "@/entities/Enrollment";
import { Student } from "@/entities/Student";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createEnrollmentAction(formData: FormData) {
  const studentId = String(formData.get("studentId") ?? "");
  const courseId = String(formData.get("courseId") ?? "");

  if (!studentId || !courseId) {
    redirect("/enrollment/new?error=required");
  }

  const { dataSource, tenantId } = await getCurrentTenantDataSource();
  const studentRepo = dataSource.getRepository(Student);
  const courseRepo = dataSource.getRepository(Course);
  const enrollmentRepo = dataSource.getRepository(Enrollment);
  const [student, course] = await Promise.all([
    studentRepo.findOneBy({ id: studentId }),
    courseRepo.findOneBy({ id: courseId }),
  ]);

  if (!student || !course || student.tenantId !== tenantId || course.tenantId !== tenantId) {
    redirect("/enrollment/new?error=invalid");
  }

  const existingEnrollment = await enrollmentRepo.findOneBy({ studentId, courseId });
  if (existingEnrollment) {
    redirect("/enrollment/new?error=duplicate");
  }

  await enrollmentRepo.save(enrollmentRepo.create({
    studentId,
    courseId,
    tenantId,
  }));

  revalidatePath("/enrollment");
  revalidatePath("/");
  redirect("/enrollment");
}