import { AppDataSource, initializeDatabase } from "./src/database/data-source.ts";
import { Tenant } from "./src/entities/Tenant.ts";

async function main() {
    await initializeDatabase();
    const tenants = await AppDataSource.getRepository(Tenant).find();
    console.log(JSON.stringify(tenants, null, 2));
}
main();
