import "reflect-metadata";
import { AppDataSource, initializeDatabase } from "./src/database/data-source.js";
import { Tenant } from "./src/entities/Tenant.js";

async function testConnection() {
  try {
    console.log("🚀 Iniciando prueba de conexión a Supabase...");
    
    // 1. Inicializar la base de datos
    await initializeDatabase();
    console.log("✅ Conexión establecida exitosamente.");

    // 2. Probar la creación de tablas creando un Tenant de prueba
    console.log("🧪 Probando creación de registros (y validación de tablas)...");
    const tenantRepository = AppDataSource.getRepository(Tenant);
    
    const testTenant = new Tenant();
    testTenant.name = "Academia de Prueba " + Math.floor(Math.random() * 1000);
    testTenant.slug = "prueba-" + Math.floor(Math.random() * 1000);

    await tenantRepository.save(testTenant);
    console.log(`✅ Registro creado exitosamente: ${testTenant.name} (ID: ${testTenant.id})`);

    // 3. Limpieza (opcional)
    // await tenantRepository.remove(testTenant);
    // console.log("🧹 Registro de prueba eliminado.");

    console.log("\n🎉 ¡TODO FUNCIONA CORRECTAMENTE! Las tablas se han creado y la conexión es estable.");
  } catch (error) {
    console.error("❌ Error durante la prueba:");
    console.error(error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
  }
}

testConnection();
