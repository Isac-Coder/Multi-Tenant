import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import type { Relation } from "typeorm";
import { Student as StudentTarget } from "./Student.ts";
import { Course as CourseTarget } from "./Course.ts";
import type { Student } from "./Student.ts";
import type { Course } from "./Course.ts";

@Entity({ name: "tenants", schema: "public" })
export class Tenant {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", unique: true })
  name!: string;

  @Column({ type: "varchar", unique: true })
  slug!: string;

  @Column({ type: "varchar", unique: true })
  schemaName!: string;

  @Column({ type: "varchar", nullable: true })
  city!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => StudentTarget, (student) => student.tenant)
  students!: Relation<Student[]>;

  @OneToMany(() => CourseTarget, (course) => course.tenant)
  courses!: Relation<Course[]>;
}
