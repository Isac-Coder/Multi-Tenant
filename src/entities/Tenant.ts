import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { Student } from "./Student";
import { Course } from "./Course";

@Entity("tenants")
export class Tenant {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Student, (student) => student.tenant)
  students: Student[];

  @OneToMany(() => Course, (course) => course.tenant)
  courses: Course[];
}
