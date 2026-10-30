import { NextRequest, NextResponse } from "next/server";
import { AppDataSource } from "@/database/data-source";
import { Student } from "@/entities/Student";
import { withProxy } from "@/proxy";

export async function GET(req: NextRequest) {
  return withProxy(req, async (req, tenantId) => {
    try {
      if (!AppDataSource.isInitialized) await AppDataSource.initialize();
      const studentRepository = AppDataSource.getRepository(Student);
      const students = await studentRepository.find({ where: { tenantId } });
      return NextResponse.json(students);
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  });
}

export async function POST(req: NextRequest) {
  return withProxy(req, async (req, tenantId) => {
    try {
      const body = await req.json();
      if (!body.name || !body.email) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
      }

      if (!AppDataSource.isInitialized) await AppDataSource.initialize();
      const studentRepository = AppDataSource.getRepository(Student);
      
      const student = studentRepository.create({
        name: body.name,
        email: body.email,
        tenantId,
      });

      await studentRepository.save(student);
      return NextResponse.json(student, { status: 201 });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  });
}
