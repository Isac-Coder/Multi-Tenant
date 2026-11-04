import type { QueryRunner } from "typeorm";

export function getTenantSchemaName(tenantId: string): string {
  const compactId = tenantId.replace(/-/g, "").toLowerCase();
  if (!/^[a-f0-9]{32}$/.test(compactId)) {
    throw new Error("Invalid tenant ID");
  }
  return `tenant_${compactId}`;
}

export async function createTenantSchema(queryRunner: QueryRunner, schemaName: string): Promise<void> {
  if (!/^tenant_[a-f0-9]{32}$/.test(schemaName)) {
    throw new Error("Invalid tenant schema name");
  }

  await queryRunner.query(`CREATE SCHEMA "${schemaName}"`);
  await queryRunner.query(`CREATE TABLE "${schemaName}"."students" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "name" character varying NOT NULL,
    "email" character varying NOT NULL,
    "phone" character varying,
    "status" character varying NOT NULL DEFAULT 'active',
    "tenantId" uuid NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT "PK_students" PRIMARY KEY ("id"),
    CONSTRAINT "FK_students_tenant" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE CASCADE
  )`);
  await queryRunner.query(`CREATE TABLE "${schemaName}"."courses" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "title" character varying NOT NULL,
    "description" text NOT NULL,
    "capacity" integer NOT NULL DEFAULT 60,
    "tenantId" uuid NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT "PK_courses" PRIMARY KEY ("id"),
    CONSTRAINT "FK_courses_tenant" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE CASCADE
  )`);
  await queryRunner.query(`CREATE TABLE "${schemaName}"."enrollments" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "studentId" uuid NOT NULL,
    "courseId" uuid NOT NULL,
    "tenantId" uuid NOT NULL,
    "enrolledAt" TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT "PK_enrollments" PRIMARY KEY ("id"),
    CONSTRAINT "FK_enrollments_student" FOREIGN KEY ("studentId") REFERENCES "${schemaName}"."students"("id") ON DELETE CASCADE,
    CONSTRAINT "FK_enrollments_course" FOREIGN KEY ("courseId") REFERENCES "${schemaName}"."courses"("id") ON DELETE CASCADE,
    CONSTRAINT "FK_enrollments_tenant" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE CASCADE
  )`);
}