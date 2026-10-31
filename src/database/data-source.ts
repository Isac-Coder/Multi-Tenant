import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Tenant } from "../entities/Tenant";
import { Student } from "../entities/Student";
import { Course } from "../entities/Course";
import { Enrollment } from "../entities/Enrollment";


dotenv.config();

let AppDataSource: DataSource;

if (typeof window === 'undefined') {
  // Dynamic import to avoid loading Postgres driver at build time in some contexts
  // or just ensure it is only accessed in server-side component runtime.
  AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: false, // Set to false in production
    logging: true,
    entities: [Tenant, Student, Course, Enrollment],
    subscribers: [],
    migrations: ["src/database/migrations/*.ts"],
  });
} else {
  // Dummy instance
  AppDataSource = {
      isInitialized: false,
        getRepository: () => ({
            find: async () => [],
            findOneBy: async () => null,
            count: async () => 0
        } as any)
    } as unknown as DataSource;
  }

export { AppDataSource };

export const initializeDatabase = async () => {
  if (typeof window !== 'undefined') return; 

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
