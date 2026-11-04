import { DataSource } from "typeorm";
import { getSessionIdentity } from "../lib/auth-session.ts";
import { Course } from "../entities/Course.ts";
import { Enrollment } from "../entities/Enrollment.ts";
import { Student } from "../entities/Student.ts";
import { Tenant } from "../entities/Tenant.ts";
import { AppDataSource, initializeDatabase } from "./data-source.ts";

const tenantDataSources = new Map<string, Promise<DataSource>>();

export async function getTenantDataSource(tenantId: string): Promise<DataSource> {
  await initializeDatabase();
  const tenant = await AppDataSource.getRepository(Tenant).findOneBy({ id: tenantId });
  if (!tenant || !/^tenant_[a-f0-9]{32}$/.test(tenant.schemaName)) {
    throw new Error("Tenant schema is unavailable");
  }

  let dataSourcePromise = tenantDataSources.get(tenant.schemaName);
  if (!dataSourcePromise) {
    dataSourcePromise = (async () => {
      const dataSource = new DataSource({
        ...(AppDataSource.options as any),
        schema: tenant.schemaName,
        entities: [Tenant, Student, Course, Enrollment],
        migrations: [],
      } as any);
      await dataSource.initialize();
      return dataSource;
    })();
    tenantDataSources.set(tenant.schemaName, dataSourcePromise);
  }

  try {
    return await dataSourcePromise;
  } catch (error) {
    tenantDataSources.delete(tenant.schemaName);
    throw error;
  }
}

export async function getCurrentTenantDataSource(): Promise<{ dataSource: DataSource; tenantId: string; schemaName: string }> {
  const session = await getSessionIdentity();
  if (!session) throw new Error("Authentication required");
  const dataSource = await getTenantDataSource(session.tenantId);
  const schemaName = String((dataSource.options as any).schema ?? "");
  if (!/^tenant_[a-f0-9]{32}$/.test(schemaName)) throw new Error("Tenant schema is unavailable");
  return {
    dataSource,
    tenantId: session.tenantId,
    schemaName,
  };
}