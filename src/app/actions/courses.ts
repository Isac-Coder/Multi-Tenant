"use server";

import { getCurrentTenantDataSource } from "@/database/tenant-data-source";
import { Course } from "@/entities/Course";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCourseAction(prevState: any, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const capacityInput = String(formData.get("capacity") ?? "60");
  const capacity = Number.parseInt(capacityInput, 10);

  if (!title || !description || !Number.isInteger(capacity) || capacity < 1) {
    return { error: "Título, descripción y una capacidad válida son requeridos" };
  }

  const { dataSource, tenantId } = await getCurrentTenantDataSource();
  const courseRepo = dataSource.getRepository(Course);

  await courseRepo.insert({
    title,
    description,
    capacity,
    tenantId,
  });
  revalidatePath("/courses");
  
  return { success: true };
}

export async function updateCourseAction(id: string, formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const capacity = Number.parseInt(String(formData.get("capacity") ?? ""), 10);

  if (!title || !description || !Number.isInteger(capacity) || capacity < 1) {
    redirect(`/courses/${id}/edit?error=invalid`);
  }

  const { dataSource } = await getCurrentTenantDataSource();
  const courseRepo = dataSource.getRepository(Course);
  const course = await courseRepo.findOneBy({ id });
  if (!course) {
    redirect("/courses");
  }

  course.title = title;
  course.description = description;
  course.capacity = capacity;
  await courseRepo.save(course);
  revalidatePath("/courses");
  revalidatePath(`/courses/${id}`);
  redirect(`/courses/${id}`);
}
