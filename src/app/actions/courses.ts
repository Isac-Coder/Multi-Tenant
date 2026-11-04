"use server";

import { AppDataSource, initializeDatabase } from "@/database/data-source";
import { Course } from "@/entities/Course";
import { Tenant } from "@/entities/Tenant";
import { revalidatePath } from "next/cache";

export async function createCourseAction(prevState: any, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const capacity = parseInt(formData.get("capacity") as string) || 0;

  if (!title || !description) {
    return { error: "Título y descripción son requeridos" };
  }

  await initializeDatabase();
  const courseRepo = AppDataSource.getRepository(Course);
  const tenantRepo = AppDataSource.getRepository(Tenant);
  
  const tenant = await tenantRepo.findOneBy({});
  if (!tenant) {
    return { error: "No hay tenants registrados. Crea uno primero." };
  }

  const course = courseRepo.create({
    title,
    description,
    tenantId: tenant.id,
  });

  await courseRepo.save(course);
  revalidatePath("/courses");
  
  return { success: true };
}
