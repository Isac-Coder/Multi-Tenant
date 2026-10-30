import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: true,
  entities: [],
});

async function testConnection() {
  try {
    console.log("🚀 Iniciando prueba simple de conexión a Supabase...");
    await AppDataSource.initialize();
    console.log("✅ Conexión establecida exitosamente.");
    await AppDataSource.destroy();
  } catch (err) {
    console.error("❌ Error de conexión:", err);
  }
}

testConnection();
