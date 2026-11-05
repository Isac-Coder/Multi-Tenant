import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddCourseCapacity1793794000000 implements MigrationInterface {
  name = "AddCourseCapacity1793794000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "courses" ADD "capacity" integer NOT NULL DEFAULT 60`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "capacity"`);
  }
}