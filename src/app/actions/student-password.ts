"use server";

import { redirect } from "next/navigation";
import { AppDataSource, initializeDatabase } from "@/database/data-source";
import { User } from "@/entities/User";
import { getSessionIdentity, startSession } from "@/lib/auth-session";
import { hashPassword } from "@/lib/password";

export async function changeStudentPasswordAction(formData: FormData): Promise<void> {
  const session = await getSessionIdentity();
  if (!session || session.role !== "student" || !session.mustChangePassword) {
    redirect("/");
  }

  const password = String(formData.get("password") ?? "");
  const confirmation = String(formData.get("confirmPassword") ?? "");
  if (password.length < 8) redirect("/change-password?error=length");
  if (password !== confirmation) redirect("/change-password?error=mismatch");

  await initializeDatabase();
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneBy({ email: session.email, tenantId: session.tenantId });
  if (!user || user.role !== "student" || !user.mustChangePassword) redirect("/login");

  user.passwordHash = await hashPassword(password);
  user.mustChangePassword = false;
  await userRepository.save(user);
  await startSession(user.email, user.tenantId, user.role, user.name);
  redirect("/");
}