import "reflect-metadata";
import { AppDataSource } from "./data-source.js";
import dotenv from "dotenv";

dotenv.config();

async function runSeed() {
  try {
    await AppDataSource.initialize();
    console.log("🚀 Iniciando creación de usuario restringido...");

    const dbUser = process.env.APP_DB_USER;
    const dbPassword = process.env.APP_DB_PASSWORD;

    if (!dbUser || !dbPassword || dbPassword === 'CAMBIA_ESTA_CONTRASEÑA_SEGURA') {
        throw new Error("Por favor configura APP_DB_USER y una APP_DB_PASSWORD segura en el archivo .env");
    }

    // SQL to create user and grant permissions
    // NOTA: Supabase gestiona usuarios de base de datos de manera específica.
    // Si esto falla por permisos insuficientes, deberás crear el rol a través
    // del SQL Editor en el panel de control de Supabase.
    await AppDataSource.query(`CREATE USER "${dbUser}" WITH PASSWORD '${dbPassword}';`);
    await AppDataSource.query(`GRANT USAGE ON SCHEMA public TO "${dbUser}";`);
    await AppDataSource.query(`GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO "${dbUser}";`);
    await AppDataSource.query(`GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO "${dbUser}";`);

    console.log(`✅ Usuario ${dbUser} creado y permisos otorgados.`);
    await AppDataSource.destroy();
  } catch (err) {
    console.error("❌ Error durante el seed:", err);
    console.info("💡 Consejo: Si este error es por permisos, crea el rol manualmente en el SQL Editor de Supabase.");
  }
}

runSeed();
