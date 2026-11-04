import "reflect-metadata";
import { AppDataSource, initializeDatabase } from "./src/database/data-source";

async function testConnection() {
  try {
    await initializeDatabase();
    console.log("Database connection successful:", AppDataSource.isInitialized);
    process.exit(0);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}

testConnection();
