import "reflect-metadata";
import { AppDataSource } from "./src/database/data-source.js";

async function checkMigrationTable() {
  try {
    await AppDataSource.initialize();
    const result = await AppDataSource.query("SELECT * FROM migrations");
    console.log("Migraciones ejecutadas:", result);
    await AppDataSource.destroy();
  } catch (err) {
    console.error("Error (quizás no existe la tabla de migraciones):", err);
  }
}

checkMigrationTable();
