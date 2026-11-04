import { NextRequest, NextResponse } from "next/server";
import { Tenant } from "@/entities/Tenant";
import { createTenantWithSchema } from "@/database/tenant-provisioning";
import { withProxy } from "@/lib/proxy";

export async function GET(req: NextRequest) {
  return withProxy(req, async (req, _tenantId, role) => {
    if (role !== "platform_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
      const { AppDataSource } = await import("@/database/data-source");
      if (!AppDataSource.isInitialized) await AppDataSource.initialize();
      const tenants = await AppDataSource.getRepository(Tenant).find();
      return NextResponse.json(tenants);
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  });
}

export async function POST(req: NextRequest) {
  return withProxy(req, async (req, _tenantId, role) => {
    if (role !== "platform_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
      const body = await req.json();
      const name = String(body.name ?? "").trim();
      const slug = String(body.slug ?? "").trim().toLowerCase();
      if (!name || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
      }

      const { AppDataSource } = await import("@/database/data-source");
      if (!AppDataSource.isInitialized) await AppDataSource.initialize();
      const queryRunner = AppDataSource.createQueryRunner();
      let tenant;
      try {
        await queryRunner.connect();
        await queryRunner.startTransaction();
        tenant = await createTenantWithSchema(queryRunner, { name, slug, city: String(body.city ?? "").trim() });
        await queryRunner.commitTransaction();
      } catch (error) {
        if (queryRunner.isTransactionActive) await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
      return NextResponse.json(tenant, { status: 201 });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  });
}
