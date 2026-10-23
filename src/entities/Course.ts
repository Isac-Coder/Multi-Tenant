import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import type { Tenant } from "./Tenant.js";
import type { Enrollment } from "./Enrollment.js";

@Entity("courses")
export class Course {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column("text")
  description!: string;

  @Column()
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
