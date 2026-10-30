console.log("import.meta.url:", import.meta.url);
const includes = import.meta.url.includes("src/database/migrations/*.ts");
console.log("Includes check:", includes);
const migrationPath = includes ? "src/database/migrations/*.ts" : "dist/database/migrations/*.js";
console.log("Resulting path:", migrationPath);
