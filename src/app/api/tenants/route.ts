import { NextRequest, NextResponse } from "next/server";
import { Tenant } from "@/entities/Tenant";

export async function GET(req: NextRequest) {
  try {
    const { AppDataSource } = await import("@/database/data-source");
    await AppDataSource.initialize();
    const tenantRepository = AppDataSource.getRepository(Tenant);
    const tenants = await tenantRepository.find();
    return NextResponse.json(tenants);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { AppDataSource } = await import("@/database/data-source");
    await AppDataSource.initialize();
    const body = await req.json();
    const tenantRepository = AppDataSource.getRepository(Tenant);
    
    const tenant = tenantRepository.create({
      name: body.name,
      slug: body.slug,
    });

    await tenantRepository.save(tenant);
    return NextResponse.json(tenant, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
