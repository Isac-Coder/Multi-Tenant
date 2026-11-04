"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AppDataSource, initializeDatabase } from "@/database/data-source";
import { Tenant } from "@/entities/Tenant";
import { User } from "@/entities/User";
import { createTenantWithSchema } from "@/database/tenant-provisioning";
import { clearPendingSignup, getPendingSignup, startSession, storePendingSignup } from "@/lib/auth-session";
import { hashPassword } from "@/lib/password";

function confirmationUrl(details: { name: string; email: string; academyName: string; slug: string; city: string; error?: string }) {
  return `/register/confirm?${new URLSearchParams(details)}`;
}

export async function beginSignupAction(formData: FormData): Promise<void> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || password.length < 8) {
    redirect("/signup?error=invalid");
  }

  try {
    await initializeDatabase();
    const existingUser = await AppDataSource.getRepository(User).findOneBy({ email });
    if (existingUser) redirect("/signup?error=email");

    const passwordHash = await hashPassword(password);
    await storePendingSignup({ name, email, passwordHash });
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error;
    redirect("/signup?error=unavailable");
  }

  redirect(`/register?${new URLSearchParams({ name, email })}`);
}

export async function completeRegistrationAction(formData: FormData): Promise<void> {
  const pendingSignup = await getPendingSignup();
  if (!pendingSignup) redirect("/signup?error=expired");

  const academyName = String(formData.get("academyName") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const city = String(formData.get("city") ?? "").trim();
  const details = { name: pendingSignup.name, email: pendingSignup.email, academyName, slug, city };

  if (!academyName || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    redirect(confirmationUrl({ ...details, error: "invalid" }));
  }

  await initializeDatabase();
  const existingUser = await AppDataSource.getRepository(User).findOneBy({ email: pendingSignup.email });
  const existingTenant = await AppDataSource.getRepository(Tenant).findOneBy({ slug });
  if (existingUser || existingTenant) {
    redirect(confirmationUrl({ ...details, error: "duplicate" }));
  }

  const queryRunner = AppDataSource.createQueryRunner();
  let tenantId: string;
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const tenant = await createTenantWithSchema(queryRunner, { name: academyName, slug, city });
    tenantId = tenant.id;
    await queryRunner.query(
      `INSERT INTO "users" ("name", "email", "passwordHash", "tenantId") VALUES ($1, $2, $3, $4)`,
      [pendingSignup.name, pendingSignup.email, pendingSignup.passwordHash, tenantId],
    );
    await queryRunner.commitTransaction();
  } catch (error) {
    if (queryRunner.isTransactionActive) await queryRunner.rollbackTransaction();
    if (error && typeof error === "object" && "code" in error && error.code === "23505") {
      redirect(confirmationUrl({ ...details, error: "duplicate" }));
    }
    throw error;
  } finally {
    await queryRunner.release();
  }

  await startSession(pendingSignup.email, tenantId, "tenant_admin", pendingSignup.name);
  await clearPendingSignup();
  revalidatePath("/");
  redirect("/");
}