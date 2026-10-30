import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import type { Tenant } from "./Tenant.js";
import type { Enrollment } from "./Enrollment.js";

@Entity("courses")
export class Course {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  title!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "uuid" })
  tenantId!: string;

  @ManyToOne("Tenant", "courses")
  @JoinColumn({ name: "tenantId" })
  tenant!: Tenant;

  @OneToMany("Enrollment", "course")
  enrollments!: Enrollment[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
