import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Tenant } from "../entities/Tenant.js";
import { Student } from "../entities/Student.js";
import { Course } from "../entities/Course.js";
import { Enrollment } from "../entities/Enrollment.js";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true, // Set to false in production
  logging: true,
  entities: [Tenant, Student, Course, Enrollment],
  subscribers: [],
  migrations: [],
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
