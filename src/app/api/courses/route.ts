import { NextRequest, NextResponse } from "next/server";
import { AppDataSource } from "@/database/data-source";
import { Course } from "@/entities/Course";

export async function GET(req: NextRequest) {
  try {
    await AppDataSource.initialize();
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get("tenantId");

    if (!tenantId) {
      return NextResponse.json({ error: "tenantId is required" }, { status: 400 });
    }

    const courseRepository = AppDataSource.getRepository(Course);
    const courses = await courseRepository.find({ where: { tenantId } });
    return NextResponse.json(courses);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await AppDataSource.initialize();
    const body = await req.json();
    const courseRepository = AppDataSource.getRepository(Course);
    
    const course = courseRepository.create({
      title: body.title,
      description: body.description,
      tenantId: body.tenantId,
    });

    await courseRepository.save(course);
    return NextResponse.json(course, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
