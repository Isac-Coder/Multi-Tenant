"use server";

import { AppDataSource } from "@/database/data-source";
import { getCurrentTenantDataSource } from "@/database/tenant-data-source";
import { Student } from "@/entities/Student";
import { User } from "@/entities/User";
import { generateTemporaryPassword, hashPassword } from "@/lib/password";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createStudentAction(prevState: any, formData: FormData) {
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const name = [firstName, lastName].filter(Boolean).join(" ");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").replace(/\D/g, "");
  const generateAccount = formData.get("generateAccount") === "true";

  if (!name || !email) {
    return { error: "Nombre y correo electrónico son requeridos" };
  }

  try {
    const { tenantId, schemaName } = await getCurrentTenantDataSource();
    const temporaryPassword = generateAccount ? generateTemporaryPassword() : null;
    const passwordHash = temporaryPassword ? await hashPassword(temporaryPassword) : null;
    const queryRunner = AppDataSource.createQueryRunner();
    let connected = false;

    try {
      await queryRunner.connect();
      connected = true;
      await queryRunner.startTransaction();

      if (generateAccount) {
        const existingUser = await queryRunner.query(
          `SELECT 1 FROM "public"."users" WHERE lower("email") = $1 LIMIT 1`,
          [email],
        );
        if (existingUser.length) {
          await queryRunner.rollbackTransaction();
          return { error: "Ya existe una cuenta con ese correo electrónico" };
        }
      }

      await queryRunner.query(
        `INSERT INTO "${schemaName}"."students" ("name", "email", "phone", "tenantId") VALUES ($1, $2, $3, $4)`,
        [name, email, phone || null, tenantId],
      );

      if (temporaryPassword && passwordHash) {
        await queryRunner.query(
          `INSERT INTO "public"."users" ("name", "email", "passwordHash", "role", "mustChangePassword", "tenantId") VALUES ($1, $2, $3, 'student', true, $4)`,
          [name, email, passwordHash, tenantId],
        );
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      if (queryRunner.isTransactionActive) await queryRunner.rollbackTransaction();
      if (error && typeof error === "object" && "code" in error && error.code === "23505") {
        return { error: "Ya existe una cuenta con ese correo electrónico" };
      }
      throw error;
    } finally {
      if (connected) await queryRunner.release();
    }

    revalidatePath("/students");
    revalidatePath("/");
    return { success: true, temporaryPassword, email };
  } catch (error) {
    console.error("Error creating student", error);
    return { error: "Error al crear estudiante" };
  }
}

export async function updateStudentAction(id: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").replace(/\D/g, "");
  const status = String(formData.get("status") ?? "");

  if (!name || !email || !["active", "inactive"].includes(status)) {
    redirect(`/students/${id}/edit?error=required`);
  }

  const { dataSource } = await getCurrentTenantDataSource();
  const studentRepo = dataSource.getRepository(Student);
  const student = await studentRepo.findOneBy({ id });
  if (!student) {
    redirect("/students");
  }

  student.name = name;
  student.email = email;
  student.phone = phone;
  student.status = status as Student["status"];
  await studentRepo.save(student);
  revalidatePath("/students");
  revalidatePath(`/students/${id}`);
  redirect(`/students/${id}`);
}
