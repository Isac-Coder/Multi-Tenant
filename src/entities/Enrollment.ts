import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Student } from "./Student";
import { Course } from "./Course";
import { Tenant } from "./Tenant";

@Entity("enrollments")
export class Enrollment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  studentId: string;

  @Column()
  courseId: string;

  @Column()
  tenantId: string;

  @ManyToOne(() => Student)
  @JoinColumn({ name: "studentId" })
  student: Student;

  @ManyToOne(() => Course, (course) => course.enrollments)
  @JoinColumn({ name: "courseId" })
  course: Course;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: "tenantId" })
  tenant: Tenant;

  @CreateDateColumn()
  enrolledAt: Date;
}
