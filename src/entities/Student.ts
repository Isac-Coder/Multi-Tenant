import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import type { Relation } from "typeorm";
import { Tenant as TenantTarget } from "./Tenant.ts";
import type { Tenant } from "./Tenant.ts";

export type StudentStatus = "active" | "inactive";

@Entity("students")
export class Student {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "varchar" })
  email!: string;

  @Column({ type: "varchar", nullable: true })
  phone!: string;

  @Column({ type: "varchar", default: "active" })
  status!: StudentStatus;

  @Column({ type: "uuid" })
  tenantId!: string;

  @ManyToOne(() => TenantTarget, (tenant) => tenant.students)
  @JoinColumn({ name: "tenantId" })
  tenant!: Relation<Tenant>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
