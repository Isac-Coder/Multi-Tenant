"use server";

import { AppDataSource, initializeDatabase } from "@/database/data-source";
import { Student } from "@/entities/Student";

export async function createStudentAction(prevState: any, formData: FormData) {
  await initializeDatabase();
  const name = formData.get("firstName") + " " + formData.get("lastName");
  const email = formData.get("email") as string;
  const phone = (formData.get("phone") as string || "").replace(/\D/g, "");
  // Hardcoded for now as multi-tenant context needs to be handled
  const tenantId = "d734cf18-6878-4395-8123-9c8699158569"; 

  try {
    const studentRepo = AppDataSource.getRepository(Student);
    const newStudent = studentRepo.create({ name, email, phone, tenantId });
    await studentRepo.save(newStudent);
    return { success: true };
  } catch (error) {
    return { error: "Error al crear estudiante" };
  }
}
