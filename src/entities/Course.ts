import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Tenant } from "./Tenant";
import { Enrollment } from "./Enrollment";

@Entity("courses")
export class Course {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column("text")
  description: string;

  @Column()
  tenantId: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.courses)
  @JoinColumn({ name: "tenantId" })
  tenant: Tenant;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: Enrollment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
