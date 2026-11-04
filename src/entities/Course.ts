import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import type { Relation } from "typeorm";
import { Tenant as TenantTarget } from "./Tenant.ts";
import { Enrollment as EnrollmentTarget } from "./Enrollment.ts";
import type { Tenant } from "./Tenant.ts";
import type { Enrollment } from "./Enrollment.ts";

@Entity("courses")
export class Course {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  title!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "integer", default: 60 })
  capacity!: number;

  @Column({ type: "uuid" })
  tenantId!: string;

  @ManyToOne(() => TenantTarget, (tenant) => tenant.courses)
  @JoinColumn({ name: "tenantId" })
  tenant!: Relation<Tenant>;

  @OneToMany(() => EnrollmentTarget, (enrollment) => enrollment.course)
  enrollments!: Relation<Enrollment[]>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
