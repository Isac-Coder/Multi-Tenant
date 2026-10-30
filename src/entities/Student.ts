import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import type { Tenant } from "./Tenant";

@Entity("students")
export class Student {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "varchar" })
  email!: string;

  @Column({ type: "uuid" })
  tenantId!: string;

  @ManyToOne("Tenant", "students")
  @JoinColumn({ name: "tenantId" })
  tenant!: Tenant;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
