import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Tenant } from "../entities/Tenant";
import { Student } from "../entities/Student";
import { Course } from "../entities/Course";
import { Enrollment } from "../entities/Enrollment";


dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: false, // Set to false in production
  logging: true,
  entities: [Tenant, Student, Course, Enrollment],
  subscribers: [],
  migrations: ["src/database/migrations/*.ts"],
});

export const initializeDatabase = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("Data Source has been initialized!");
    }
  } catch (err) {
    console.error("Error during Data Source initialization", err);
    throw err;
  }
};
