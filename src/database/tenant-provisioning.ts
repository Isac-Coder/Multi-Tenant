import { randomUUID } from "node:crypto";
import type { QueryRunner } from "typeorm";
import { createTenantSchema, getTenantSchemaName } from "./tenant-schema.ts";

export interface NewTenantDetails {
  name: string;
  slug: string;
  city?: string | null;
}

export async function createTenantWithSchema(queryRunner: QueryRunner, details: NewTenantDetails) {
  const id = randomUUID();
  const schemaName = getTenantSchemaName(id);

  await queryRunner.query(
    `INSERT INTO "public"."tenants" ("id", "name", "slug", "city", "schemaName") VALUES ($1, $2, $3, $4, $5)`,
    [id, details.name, details.slug, details.city || null, schemaName],
  );
  await createTenantSchema(queryRunner, schemaName);

  return { id, ...details, schemaName };
}