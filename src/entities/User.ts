import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "users", schema: "public" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "varchar", unique: true })
  email!: string;

  @Column({ type: "varchar" })
  passwordHash!: string;

  @Column({ type: "varchar", default: "student" })
  role!: "platform_admin" | "tenant_admin" | "student";

  @Column({ type: "boolean", default: false })
  mustChangePassword!: boolean;

  @Column({ type: "uuid" })
  tenantId!: string;

  @CreateDateColumn()
  createdAt!: Date;
}