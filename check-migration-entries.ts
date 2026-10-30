import "reflect-metadata";
import { AppDataSource } from "./src/database/data-source.js";

async function checkMigrationEntries() {
  try {
    await AppDataSource.initialize();
    const result = await AppDataSource.query("SELECT * FROM migrations");
    console.log("Migraciones registradas:", result);
    await AppDataSource.destroy();
  } catch (err) {
    console.error("Error:", err);
  }
}

checkMigrationEntries();
