import { NextRequest, NextResponse } from "next/server";
import { Course } from "@/entities/Course";
import { withProxy } from "@/lib/proxy";

export async function GET(req: NextRequest) {
  return withProxy(req, async (req, tenantId) => {
    try {
      const { getTenantDataSource } = await import("@/database/tenant-data-source");
      const dataSource = await getTenantDataSource(tenantId);
      const courseRepository = dataSource.getRepository(Course);
      
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
      const capacity = Number(body.capacity ?? 60);
      if (!body.title || !body.description || !Number.isInteger(capacity) || capacity < 1) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
      }

      const { getTenantDataSource } = await import("@/database/tenant-data-source");
      const dataSource = await getTenantDataSource(tenantId);
      const courseRepository = dataSource.getRepository(Course);
      
      const newCourse = courseRepository.create({
        title: String(body.title).trim(),
        description: String(body.description).trim(),
        capacity,
        tenantId,
      });
      
      await courseRepository.save(newCourse);
      return NextResponse.json(newCourse, { status: 201 });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  });
}

