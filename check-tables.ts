import "reflect-metadata";
import { AppDataSource } from "./src/database/data-source";

async function checkTables() {
  try {
    await AppDataSource.initialize();
    const queryRunner = AppDataSource.createQueryRunner();
    const tables = await queryRunner.getTables(["tenants", "students", "courses", "enrollments"]);
    console.log("Tablas encontradas:", tables.map(t => t.name));
    await AppDataSource.destroy();
  } catch (err) {
    console.error("Error:", err);
  }
}

checkTables();
