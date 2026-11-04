"use server";

import { AppDataSource, initializeDatabase } from "@/database/data-source";
import { createTenantWithSchema } from "@/database/tenant-provisioning";
import { getSessionIdentity } from "@/lib/auth-session";
import { revalidatePath } from "next/cache";

export async function createTenantAction(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;

  if (!name || !slug) {
    return { error: "Nombre y slug son requeridos" };
  }

  const session = await getSessionIdentity();
  if (session?.role !== "platform_admin") {
    return { error: "No tienes permiso para crear tenants" };
  }

  await initializeDatabase();
  const queryRunner = AppDataSource.createQueryRunner();
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();
    await createTenantWithSchema(queryRunner, {
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
    });
    await queryRunner.commitTransaction();
  } catch (error) {
    if (queryRunner.isTransactionActive) await queryRunner.rollbackTransaction();
    console.error("Error creating tenant schema", error);
    return { error: "No se pudo crear el tenant. Verifica que el nombre y el slug no estén en uso." };
  } finally {
    await queryRunner.release();
  }

  revalidatePath("/tenants");
  
  return { success: true };
}
