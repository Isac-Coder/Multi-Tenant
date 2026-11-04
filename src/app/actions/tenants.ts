"use server";

import { AppDataSource, initializeDatabase } from "@/database/data-source";
import { Tenant } from "@/entities/Tenant";
import { revalidatePath } from "next/cache";

export async function createTenantAction(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;

  if (!name || !slug) {
    return { error: "Nombre y slug son requeridos" };
  }

  await initializeDatabase();
  const tenantRepo = AppDataSource.getRepository(Tenant);

  const tenant = tenantRepo.create({
    name,
    slug,
  });

  await tenantRepo.save(tenant);
  revalidatePath("/tenants");
  
  return { success: true };
}
