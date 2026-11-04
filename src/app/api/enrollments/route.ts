import { NextRequest, NextResponse } from "next/server";
import { Enrollment } from "@/entities/Enrollment";
import { Course } from "@/entities/Course";
import { Student } from "@/entities/Student";
import { withProxy } from "@/lib/proxy";

export async function GET(req: NextRequest) {
  return withProxy(req, async (req, tenantId) => {
    try {
      const { getTenantDataSource } = await import("@/database/tenant-data-source");
      const dataSource = await getTenantDataSource(tenantId);
      const enrollmentRepository = dataSource.getRepository(Enrollment);
      const enrollments = await enrollmentRepository.find({ where: { tenantId } });
      return NextResponse.json(enrollments);
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  });
}

export async function POST(req: NextRequest) {
  return withProxy(req, async (req, tenantId) => {
    try {
      const body = await req.json();
      if (!body.studentId || !body.courseId) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
      }

      const { getTenantDataSource } = await import("@/database/tenant-data-source");
      const dataSource = await getTenantDataSource(tenantId);
      const enrollmentRepository = dataSource.getRepository(Enrollment);

      const [student, course] = await Promise.all([
        dataSource.getRepository(Student).findOneBy({ id: body.studentId }),
        dataSource.getRepository(Course).findOneBy({ id: body.courseId }),
      ]);
      if (!student || !course || student.tenantId !== tenantId || course.tenantId !== tenantId) {
        return NextResponse.json({ error: "Student or course not found" }, { status: 404 });
      }

      const existingEnrollment = await enrollmentRepository.findOneBy({
        studentId: body.studentId,
        courseId: body.courseId,
      });
      if (existingEnrollment) {
        return NextResponse.json({ error: "Enrollment already exists" }, { status: 409 });
      }
      
      const enrollment = enrollmentRepository.create({
        studentId: body.studentId,
        courseId: body.courseId,
        tenantId,
      });

      await enrollmentRepository.save(enrollment);
      return NextResponse.json(enrollment, { status: 201 });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  });
}
