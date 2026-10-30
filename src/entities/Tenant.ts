import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import type { Student } from "./Student.js";
import type { Course } from "./Course.js";

@Entity("tenants")
export class Tenant {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", unique: true })
  name!: string;

  @Column({ type: "varchar", unique: true })
  slug!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany("Student", "tenant")
  students!: Student[];

  @OneToMany("Course", "tenant")
  courses!: Course[];
}
