import { NextRequest, NextResponse } from "next/server";
import { AppDataSource } from "@/database/data-source";
import { Enrollment } from "@/entities/Enrollment";
import { withProxy } from "@/proxy";

export async function GET(req: NextRequest) {
  return withProxy(req, async (req, tenantId) => {
    try {
      if (!AppDataSource.isInitialized) await AppDataSource.initialize();
      const enrollmentRepository = AppDataSource.getRepository(Enrollment);
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

      if (!AppDataSource.isInitialized) await AppDataSource.initialize();
      const enrollmentRepository = AppDataSource.getRepository(Enrollment);
      
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
