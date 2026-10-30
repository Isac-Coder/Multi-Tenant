import { NextRequest, NextResponse } from "next/server";
import { AppDataSource } from "@/database/data-source";
import { Course } from "@/entities/Course";
import { withProxy } from "@/proxy";

export async function GET(req: NextRequest) {
  return withProxy(req, async (req, tenantId) => {
    try {
      if (!AppDataSource.isInitialized) await AppDataSource.initialize();
      const courseRepository = AppDataSource.getRepository(Course);
      
      const courses = await courseRepository.find({ where: { tenantId } });
      return NextResponse.json(courses);
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  });
}

export async function POST(req: NextRequest) {
  return withProxy(req, async (req, tenantId) => {
    try {
      const body = await req.json();
      
      // Validación básica
      if (!body.title || !body.description) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
      }

      if (!AppDataSource.isInitialized) await AppDataSource.initialize();
      const courseRepository = AppDataSource.getRepository(Course);
      
      const newCourse = courseRepository.create({
        ...body,
        tenantId
      });
      
      await courseRepository.save(newCourse);
      return NextResponse.json(newCourse, { status: 201 });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  });
}

