import { NextRequest, NextResponse } from "next/server";
import { AppDataSource } from "@/database/data-source";
import { Enrollment } from "@/entities/Enrollment";

export async function GET(req: NextRequest) {
  try {
    await AppDataSource.initialize();
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get("tenantId");

    if (!tenantId) {
      return NextResponse.json({ error: "tenantId is required" }, { status: 400 });
    }

    const enrollmentRepository = AppDataSource.getRepository(Enrollment);
    const enrollments = await enrollmentRepository.find({ where: { tenantId } });
    return NextResponse.json(enrollments);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await AppDataSource.initialize();
    const body = await req.json();
    const enrollmentRepository = AppDataSource.getRepository(Enrollment);
    
    const enrollment = enrollmentRepository.create({
      studentId: body.studentId,
      courseId: body.courseId,
      tenantId: body.tenantId,
    });

    await enrollmentRepository.save(enrollment);
    return NextResponse.json(enrollment, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
