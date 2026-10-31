import { Tenant } from "@/entities/Tenant";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function TenantsPage() {
  const { AppDataSource, initializeDatabase } = await import("@/database/data-source");
  await initializeDatabase();
  const tenantRepo = AppDataSource.getRepository(Tenant);
  const tenants = await tenantRepo.find();

  return (
    <div className="min-h-screen bg-surface-0 p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-brand-text">Tenants (Inquilinos)</h1>
        <Link href="/tenants/new">
            <Button variant="primary">
                <Plus className="w-4 h-4" /> Nuevo Tenant
            </Button>
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tenants.map((tenant) => (
          <Card key={tenant.id} className="p-5 flex flex-col gap-3">
            <h3 className="font-semibold text-brand-text text-lg">{tenant.name}</h3>
            <p className="text-sm text-brand-muted">Slug: <span className="font-mono bg-surface-1 p-1 rounded">{tenant.slug}</span></p>
            <div className="mt-auto pt-4 flex gap-2">
              <Button size="sm" variant="secondary">Editar</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
