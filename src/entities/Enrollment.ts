import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import type { Relation } from "typeorm";
import { Student as StudentTarget } from "./Student.ts";
import { Course as CourseTarget } from "./Course.ts";
import { Tenant as TenantTarget } from "./Tenant.ts";
import type { Student } from "./Student.ts";
import type { Course } from "./Course.ts";
import type { Tenant } from "./Tenant.ts";

@Entity("enrollments")
export class Enrollment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  studentId!: string;

  @Column({ type: "uuid" })
  courseId!: string;

  @Column({ type: "uuid" })
  tenantId!: string;

  @ManyToOne(() => StudentTarget)
  @JoinColumn({ name: "studentId" })
  student!: Relation<Student>;

  @ManyToOne(() => CourseTarget, (course) => course.enrollments)
  @JoinColumn({ name: "courseId" })
  course!: Relation<Course>;

  @ManyToOne(() => TenantTarget)
  @JoinColumn({ name: "tenantId" })
  tenant!: Relation<Tenant>;

  @CreateDateColumn()
  enrolledAt!: Date;
}
