import { NextRequest, NextResponse } from "next/server";
import { AppDataSource } from "@/database/data-source";
import { Student } from "@/entities/Student";

export async function GET(req: NextRequest) {
  try {
    await AppDataSource.initialize();
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get("tenantId");

    if (!tenantId) {
      return NextResponse.json({ error: "tenantId is required" }, { status: 400 });
    }

    const studentRepository = AppDataSource.getRepository(Student);
    const students = await studentRepository.find({ where: { tenantId } });
    return NextResponse.json(students);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await AppDataSource.initialize();
    const body = await req.json();
    const studentRepository = AppDataSource.getRepository(Student);
    
    const student = studentRepository.create({
      name: body.name,
      email: body.email,
      tenantId: body.tenantId,
    });

    await studentRepository.save(student);
    return NextResponse.json(student, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
