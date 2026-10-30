import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import type { Student } from "./Student";
import type { Course } from "./Course";
import type { Tenant } from "./Tenant";

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

  @ManyToOne("Student")
  @JoinColumn({ name: "studentId" })
  student!: Student;

  @ManyToOne("Course", "enrollments")
  @JoinColumn({ name: "courseId" })
  course!: Course;

  @ManyToOne("Tenant")
  @JoinColumn({ name: "tenantId" })
  tenant!: Tenant;

  @CreateDateColumn()
  enrolledAt!: Date;
}
