import "reflect-metadata";
import { DataSource } from "typeorm";
// TypeORM 0.3.x+ requires the driver to be imported directly or available in node_modules.
// In some ESM environments, explicitly requiring the driver can help.
import * as pg from "pg";
(global as any).pg = pg;

import { Tenant } from "../entities/Tenant";
import { Student } from "../entities/Student";
import { Course } from "../entities/Course";
import { Enrollment } from "../entities/Enrollment";


// dotenv.config();

let AppDataSource: DataSource;
let isInitializing = false;

if (typeof window === 'undefined') {
  // Dynamic import to avoid loading Postgres driver at build time in some contexts
  // or just ensure it is only accessed in server-side component runtime.
  AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    entities: [Tenant, Student, Course, Enrollment],
    migrations: ["src/database/migrations/*.ts"],
    synchronize: false,
    logging: true,
    extra: {
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    },
    // Explicitly set the driver if needed
    driver: (global as any).pg,
  } as any);

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

  if (isInitializing) {
    // Wait for existing initialization
    while (isInitializing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return;
  }

  try {
    if (!AppDataSource.isInitialized) {
      isInitializing = true;
      await AppDataSource.initialize();
      console.log("Data Source has been initialized!");
    }
  } catch (err) {
    console.error("Error during Data Source initialization", err);
    throw err;
  } finally {
    isInitializing = false;
  }
};
